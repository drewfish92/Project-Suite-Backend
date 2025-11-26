const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Report routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create report - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get report - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update report - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete report - implementation pending' });
});

module.exports = router;
