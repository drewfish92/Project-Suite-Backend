const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/database');
const { AppError } = require('../middleware/error.middleware');
const emailService = require('./email.service');

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Hash password
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  // Register new organization and admin user
  async register(data) {
    const {
      email,
      password,
      firstName,
      lastName,
      companyName,
      industry,
      companySize,
      planTier = 'starter'
    } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400, 'EMAIL_EXISTS');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = uuidv4();

    // Calculate trial end date
    const trialDays = parseInt(process.env.TRIAL_DAYS) || 14;
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + trialDays);

    // Create organization and user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: companyName,
          industry,
          companySize,
          subscriptionTier: planTier,
          subscriptionStatus: 'trial',
          trialEndDate,
          billingEmail: email
        }
      });

      // Create admin user
      const user = await tx.user.create({
        data: {
          organizationId: organization.id,
          email,
          passwordHash,
          firstName,
          lastName,
          role: 'admin',
          emailVerificationToken
        },
        include: {
          organization: true
        }
      });

      // Log subscription event
      await tx.subscriptionEvent.create({
        data: {
          organizationId: organization.id,
          eventType: 'trial_started',
          eventData: {
            trialEndDate,
            planTier
          }
        }
      });

      return { user, organization };
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(result.user, emailVerificationToken);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't fail registration if email fails
    }

    // Generate token
    const token = this.generateToken(result.user.id);

    // Remove sensitive data
    delete result.user.passwordHash;
    delete result.user.emailVerificationToken;

    return {
      user: result.user,
      organization: result.organization,
      token,
      trialEndDate
    };
  }

  // Login user
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true
      }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401, 'ACCOUNT_DEACTIVATED');
    }

    // Check password
    const isPasswordValid = await this.comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate token
    const token = this.generateToken(user.id);

    // Remove sensitive data
    delete user.passwordHash;
    delete user.emailVerificationToken;
    delete user.passwordResetToken;

    return {
      user,
      organization: user.organization,
      token
    };
  }

  // Verify email
  async verifyEmail(token) {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400, 'INVALID_TOKEN');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null
      }
    });

    return { success: true };
  }

  // Request password reset
  async forgotPassword(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    });

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(user, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return { success: true };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_TOKEN');
    }

    // Hash new password
    const passwordHash = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    return { success: true };
  }

  // Get current user
  async getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    // Remove sensitive data
    delete user.passwordHash;
    delete user.emailVerificationToken;
    delete user.passwordResetToken;

    return {
      user,
      organization: user.organization
    };
  }
}

module.exports = new AuthService();

