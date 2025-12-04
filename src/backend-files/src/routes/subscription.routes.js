const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const prisma = require('../utils/prisma');

// Get organization subscription
router.get('/', authenticate, async (req, res, next) => {
  try {
    const subscription = await prisma.subscriptions.findUnique({
      where: { organization_id: req.user.organizationId }
    });

    if (!subscription) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'No subscription found'
        }
      });
    }

    res.json(subscription);
  } catch (error) {
    next(error);
  }
});

// Create subscription (placeholder - will be replaced with Stripe integration)
router.post('/', authenticate, requireRole('admin', 'owner'), async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!plan) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Plan is required'
        }
      });
    }

    // Check if subscription already exists
    const existing = await prisma.subscriptions.findUnique({
      where: { organization_id: req.user.organizationId }
    });

    if (existing) {
      return res.status(400).json({
        error: {
          code: 'SUBSCRIPTION_EXISTS',
          message: 'Organization already has a subscription'
        }
      });
    }

    const subscription = await prisma.subscriptions.create({
      data: {
        plan,
        status: 'inactive',
        organization_id: req.user.organizationId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
});

// Update subscription (placeholder - will be replaced with Stripe integration)
router.put('/', authenticate, requireRole('admin', 'owner'), async (req, res, next) => {
  try {
    const { plan, status } = req.body;

    const updateData = {
      updated_at: new Date()
    };

    if (plan !== undefined) updateData.plan = plan;
    if (status !== undefined) updateData.status = status;

    const subscription = await prisma.subscriptions.update({
      where: { organization_id: req.user.organizationId },
      data: updateData
    });

    res.json(subscription);
  } catch (error) {
    next(error);
  }
});

// Cancel subscription (placeholder - will be replaced with Stripe integration)
router.delete('/', authenticate, requireRole('admin', 'owner'), async (req, res, next) => {
  try {
    await prisma.subscriptions.update({
      where: { organization_id: req.user.organizationId },
      data: {
        status: 'cancelled',
        cancel_at_period_end: true,
        updated_at: new Date()
      }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
