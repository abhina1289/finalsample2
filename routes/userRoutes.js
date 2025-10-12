const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  userList,
  verifyToken
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/jwtMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (requires valid JWT token only)
router.get('/verify', authenticateToken, verifyToken);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.delete('/profile', authenticateToken, deleteUser);

// User list route - REMOVE requireAdmin, just use authenticateToken
router.get('/userlist', authenticateToken, userList);

module.exports = router;