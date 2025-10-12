const mongoose = require('mongoose'); // Add this import
const Expense = require('../model/expenseModel');

// Get all expenses (user-specific)
const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching expenses', error: error.message });
  }
};

// Add new expense
const addExpense = async (req, res) => {
  try {
    const { name, amount, category, date, status, description, receiptUrl } = req.body;
    const userId = req.user.id;

    if (!name || !amount) {
      return res.status(400).json({ success: false, message: 'Name and amount are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
    }

    const newExpense = new Expense({
      name: name.trim(),
      amount: parseFloat(amount),
      category: category || 'Other',
      date: date ? new Date(date) : new Date(),
      status: status || 'pending',
      description: description || '',
      receiptUrl: receiptUrl || '',
      userId
    });

    const savedExpense = await newExpense.save();
    res.status(201).json({ success: true, message: 'Expense added successfully', data: savedExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding expense', error: error.message });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, category, date, status, description, receiptUrl } = req.body;
    const userId = req.user.id;

    if (!name || !amount) {
      return res.status(400).json({ success: false, message: 'Name and amount are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be greater than 0' });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { name: name.trim(), amount: parseFloat(amount), category, date, status, description, receiptUrl },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Expense updated successfully', data: updatedExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating expense', error: error.message });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({ success: true, message: 'Expense deleted successfully', data: deletedExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting expense', error: error.message });
  }
};

// Clear all expenses
const clearAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    await Expense.deleteMany({ userId });
    res.status(200).json({ success: true, message: 'All expenses cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing expenses', error: error.message });
  }
};

// Get total expenses - FIXED VERSION
const getTotalExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Convert userId to ObjectId if it's a string
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const result = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 }
        }
      }
    ]);

    const totals = {
      totalAmount: result.length > 0 ? result[0].totalAmount : 0,
      totalCount: result.length > 0 ? result[0].totalCount : 0
    };

    res.status(200).json({
      success: true,
      data: totals
    });
  } catch (error) {
    console.error("Error in getTotalExpenses:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating totals",
      error: error.message
    });
  }
};

// Admin: get all expenses
const getAllExpensesForAdmin = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('userId', 'name email');
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching admin expenses', error: error.message });
  }
};

module.exports = {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  clearAllExpenses,
  getTotalExpenses,
  getAllExpensesForAdmin
};