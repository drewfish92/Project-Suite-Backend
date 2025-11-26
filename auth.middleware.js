const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { AppError, asyncHandler } = require('./error.middleware');

// Verify JWT token and attach user to request
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    throw new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        organization: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 401, 'UNAUTHORIZED');
    }

    if (!user.isActive) {
      throw new AppError('User account is deactivated', 401, 'ACCOUNT_DEACTIVATED');
    }

    // Attach user and organization to request
    req.user = user;
    req.organizationId = user.organizationId;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired', 401, 'TOKEN_EXPIRED');
    }
    throw error;
  }
});

// Check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `User role ${req.user.role} is not authorized to access this route`,
        403,
        'FORBIDDEN'
      );
    }
    next();
  };
};

// Check subscription status and tier
const checkSubscription = (requiredTier = null) => {
  return asyncHandler(async (req, res, next) => {
    const organization = req.user.organization;

    // Check if trial has expired
    if (organization.subscriptionStatus === 'trial') {
      const trialEndDate = new Date(organization.trialEndDate);
      const now = new Date();
      
      if (now > trialEndDate) {
        throw new AppError(
          'Your trial has expired. Please subscribe to continue.',
          403,
          'TRIAL_EXPIRED'
        );
      }
    }

    // Check if subscription is active
    if (!['trial', 'active'].includes(organization.subscriptionStatus)) {
      throw new AppError(
        'Your subscription is not active. Please update your payment method.',
        402,
        'SUBSCRIPTION_REQUIRED'
      );
    }

    // Check subscription tier if required
    if (requiredTier) {
      const tiers = ['starter', 'professional', 'enterprise'];
      const userTierIndex = tiers.indexOf(organization.subscriptionTier);
      const requiredTierIndex = tiers.indexOf(requiredTier);

      if (userTierIndex < requiredTierIndex) {
        throw new AppError(
          `This feature requires ${requiredTier} plan or higher`,
          403,
          'UPGRADE_REQUIRED'
        );
      }
    }

    next();
  });
};

// Ensure all queries are scoped to user's organization
const ensureOrgContext = (req, res, next) => {
  // Add organizationId to query params if not present
  if (req.query && !req.query.organizationId) {
    req.query.organizationId = req.organizationId;
  }
  
  // Add organizationId to body if not present
  if (req.body && !req.body.organizationId) {
    req.body.organizationId = req.organizationId;
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  checkSubscription,
  ensureOrgContext
};

