const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const prisma = require('../utils/prisma');

// Get current user profile
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const profile = await prisma.profiles.findUnique({
      where: { user_id: req.user.userId },
      include: {
        organization: {
          include: {
            subscriptions: true
          }
        }
      }
    });

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// Update current user profile
router.put('/me', authenticate, async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name is required'
        }
      });
    }

    const profile = await prisma.profiles.update({
      where: { user_id: req.user.userId },
      data: {
        name: name.trim(),
        updated_at: new Date()
      }
    });

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// Get all users in organization (admin only)
router.get('/', authenticate, requireRole('admin', 'owner'), async (req, res, next) => {
  try {
    const users = await prisma.profiles.findMany({
      where: { organization_id: req.user.organizationId },
      orderBy: { created_at: 'desc' }
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Update user role (admin only)
router.put('/:userId/role', authenticate, requireRole('admin', 'owner'), async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'owner'].includes(role)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid role. Must be user, admin, or owner'
        }
      });
    }

    const profile = await prisma.profiles.update({
      where: { user_id: req.params.userId },
      data: {
        role,
        updated_at: new Date()
      }
    });

    res.json(profile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
