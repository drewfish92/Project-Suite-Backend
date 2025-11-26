const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Expense routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create expense - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get expense - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update expense - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete expense - implementation pending' });
});

module.exports = router;
