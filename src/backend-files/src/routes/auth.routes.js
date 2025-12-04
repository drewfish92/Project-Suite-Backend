const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

// Register (simplified - you'll integrate with your auth provider)
router.post('/register', async (req, res, next) => {
  try {
    const { userId, name, email, organizationName } = req.body;

    if (!userId || !name || !email) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'userId, name, and email are required'
        }
      });
    }

    // Check if user already exists
    const existingProfile = await prisma.profiles.findUnique({
      where: { user_id: userId }
    });

    if (existingProfile) {
      return res.status(400).json({
        error: {
          code: 'USER_EXISTS',
          message: 'User already exists'
        }
      });
    }

    // Create organization if provided
    let organizationId = null;
    if (organizationName) {
      const organization = await prisma.organizations.create({
        data: {
          name: organizationName,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      organizationId = organization.id;
    }

    // Create profile
    const profile = await prisma.profiles.create({
      data: {
        user_id: userId,
        name,
        role: organizationId ? 'owner' : 'user',
        organization_id: organizationId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: profile.user_id, profileId: profile.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      profile
    });
  } catch (error) {
    next(error);
  }
});

// Login (simplified - you'll integrate with your auth provider)
router.post('/login', async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'userId is required'
        }
      });
    }

    const profile = await prisma.profiles.findUnique({
      where: { user_id: userId },
      include: {
        organization: true
      }
    });

    if (!profile) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: profile.user_id, profileId: profile.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      profile
    });
  } catch (error) {
    next(error);
  }
});

// Verify token
router.get('/verify', authenticate, async (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

module.exports = router;
