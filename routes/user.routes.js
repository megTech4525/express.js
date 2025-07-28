const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/admin-dashboard', protect, admin, (req, res) => {
  res.send('Welcome Admin');
});

router.get('/user-dashboard', protect, (req, res) => {
  res.send(`Welcome ${req.user.username}`);
});

module.exports = router;
