const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controllers (we'll create these next)
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteUser
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteUser);

module.exports = router;
