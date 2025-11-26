const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Invoice routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create invoice - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get invoice - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update invoice - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete invoice - implementation pending' });
});

module.exports = router;
