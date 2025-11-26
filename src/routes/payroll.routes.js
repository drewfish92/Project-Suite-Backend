const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(501).json({ message: 'Payroll routes - implementation pending' });
});

router.post('/', (req, res) => {
  res.status(501).json({ message: 'Create payroll - implementation pending' });
});

router.get('/:id', (req, res) => {
  res.status(501).json({ message: 'Get payroll - implementation pending' });
});

router.put('/:id', (req, res) => {
  res.status(501).json({ message: 'Update payroll - implementation pending' });
});

router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Delete payroll - implementation pending' });
});

module.exports = router;
