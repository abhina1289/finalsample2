const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/jwtMiddleware');
const {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  clearAllExpenses,
  getTotalExpenses,
  getAllExpensesForAdmin
} = require('../controllers/expenseController');

// IMPORTANT: Specific routes must come before parameterized routes
router.get('/total', authenticateToken, getTotalExpenses);
router.get('/admin/all', authenticateToken, getAllExpensesForAdmin);

// User routes
router.get('/', authenticateToken, getAllExpenses);
router.post('/', authenticateToken, addExpense);
router.put('/:id', authenticateToken, updateExpense);
router.delete('/:id', authenticateToken, deleteExpense);
router.delete('/', authenticateToken, clearAllExpenses);

module.exports = router;