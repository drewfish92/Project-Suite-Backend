const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Quote routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create quote - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get quote - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update quote - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete quote - implementation pending' });
});

module.exports = router;
