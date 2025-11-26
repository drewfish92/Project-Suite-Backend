const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Webhook routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create webhook - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get webhook - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update webhook - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete webhook - implementation pending' });
});

module.exports = router;
