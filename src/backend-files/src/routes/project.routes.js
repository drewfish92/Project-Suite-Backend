const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const prisma = require('../utils/prisma');

// Get all projects for organization
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {
      organization_id: req.user.organizationId
    };

    if (status) {
      where.status = status;
    }

    const projects = await prisma.projects.findMany({
      where,
      orderBy: { created_at: 'desc' }
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Get single project
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const project = await prisma.projects.findFirst({
      where: {
        id: req.params.id,
        organization_id: req.user.organizationId
      }
    });

    if (!project) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Create project
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, description, status, start_date, end_date } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Project name is required'
        }
      });
    }

    const project = await prisma.projects.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        status: status || 'active',
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        organization_id: req.user.organizationId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

// Update project
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, description, status, start_date, end_date } = req.body;

    // Check if project exists and belongs to user's organization
    const existingProject = await prisma.projects.findFirst({
      where: {
        id: req.params.id,
        organization_id: req.user.organizationId
      }
    });

    if (!existingProject) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    const updateData = {
      updated_at: new Date()
    };

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (status !== undefined) updateData.status = status;
    if (start_date !== undefined) updateData.start_date = start_date ? new Date(start_date) : null;
    if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date) : null;

    const project = await prisma.projects.update({
      where: { id: req.params.id },
      data: updateData
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    // Check if project exists and belongs to user's organization
    const existingProject = await prisma.projects.findFirst({
      where: {
        id: req.params.id,
        organization_id: req.user.organizationId
      }
    });

    if (!existingProject) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found'
        }
      });
    }

    await prisma.projects.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
