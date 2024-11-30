
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all users for the "Assigned To" dropdown
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name email _id'); // Fetch only name, email, and _id
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
