const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Schedule routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create schedule - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get schedule - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update schedule - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete schedule - implementation pending' });
});

module.exports = router;
