const express = require('express');
const router = express.Router();
const { 
  addBudget, 
  getBudget, 
  updateUsedBudget 
} = require('../controllers/budgetController');
const { authenticateToken } = require('../middleware/jwtMiddleware');

// 💰 Add deposit to budget (per user)
router.post('/deposit', authenticateToken, addBudget);

// 📊 Get current budget for logged-in user
router.get('/', authenticateToken, getBudget);

// 🧾 Update used budget for expenses (deduct from remaining)
router.post('/expense', authenticateToken, updateUsedBudget);

module.exports = router;
