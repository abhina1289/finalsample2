// controllers/expenseController.js
const Expense = require('../model/expenseModel');

// Get all expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: error.message
    });
  }
};

// Add new expense
const addExpense = async (req, res) => {
  try {
    const { name, amount } = req.body;

    if (!name || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Name and amount are required'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    const newExpense = new Expense({
      name: name.trim(),
      amount: parseFloat(amount)
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: savedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding expense',
      error: error.message
    });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: deletedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message
    });
  }
};

// Clear all expenses
const clearAllExpenses = async (req, res) => {
  try {
    await Expense.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: 'All expenses cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing expenses',
      error: error.message
    });
  }
};

// Get total expenses
const getTotalExpenses = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const total = result.length > 0 ? result[0].total : 0;
    const count = result.length > 0 ? result[0].count : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAmount: total,
        totalCount: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating total expenses',
      error: error.message
    });
  }
};

module.exports = {
  getAllExpenses,
  addExpense,
  deleteExpense,
  clearAllExpenses,
  getTotalExpenses
};