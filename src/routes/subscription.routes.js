const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Subscription routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create subscription - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get subscription - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update subscription - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete subscription - implementation pending' });
});

module.exports = router;
