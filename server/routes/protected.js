// routes/protected.js
// A small route to demonstrate how protected routes work on the backend.

const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET /api/me -> returns profile of the logged-in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // authMiddleware set req.userId
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Use toPublicJSON to avoid sending password/otp
    return res.json(user.toPublicJSON());
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
