const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Contact routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create contact - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get contact - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update contact - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete contact - implementation pending' });
});

module.exports = router;
