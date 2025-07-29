// routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  addExpense,
  deleteExpense,
  clearAllExpenses,
  getTotalExpenses
} = require('../controllers/expenseController');

// GET /api/expenses - Get all expenses
router.get('/expenses', getAllExpenses);

// POST /api/expenses - Add new expense
router.post('/expenses', addExpense);

// DELETE /api/expenses/:id - Delete specific expense
router.delete('/expenses/:id', deleteExpense);

// DELETE /api/expenses - Clear all expenses
router.delete('/expenses', clearAllExpenses);

// GET /api/expenses/total - Get total expenses
router.get('/expenses/total', getTotalExpenses);

module.exports = router;