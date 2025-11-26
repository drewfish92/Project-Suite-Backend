const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Time routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create time - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get time - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update time - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete time - implementation pending' });
});

module.exports = router;
