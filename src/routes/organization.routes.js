const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const prisma = require('../utils/prisma');

// Get organization details
router.get('/', authenticate, async (req, res, next) => {
  try {
    if (!req.user.organizationId) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }

    const organization = await prisma.organizations.findUnique({
      where: { id: req.user.organizationId },
      include: {
        subscriptions: true,
        profiles: {
          select: {
            id: true,
            name: true,
            role: true,
            created_at: true
          }
        }
      }
    });

    res.json(organization);
  } catch (error) {
    next(error);
  }
});

// Update organization
router.put('/', authenticate, requireRole('admin', 'owner'), async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Organization name is required'
        }
      });
    }

    const organization = await prisma.organizations.update({
      where: { id: req.user.organizationId },
      data: {
        name: name.trim(),
        updated_at: new Date()
      }
    });

    res.json(organization);
  } catch (error) {
    next(error);
  }
});

// Get organization members
router.get('/members', authenticate, async (req, res, next) => {
  try {
    const members = await prisma.profiles.findMany({
      where: { organization_id: req.user.organizationId },
      select: {
        id: true,
        user_id: true,
        name: true,
        role: true,
        created_at: true,
        updated_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(members);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
