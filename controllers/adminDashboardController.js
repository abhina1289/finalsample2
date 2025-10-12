const User = require('../model/userModel');
const Budget = require('../model/budgetModel');
const Expense = require('../model/expenseModel');
const Receipt = require('../model/receiptModel');

// Dashboard Controllers
exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount, budgetCount, expenseCount, receiptCount] = await Promise.all([
      User.countDocuments(),
      Budget.countDocuments(),
      Expense.countDocuments(),
      Receipt.countDocuments()
    ]);

    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingExpenses = await Expense.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount,
        totalBudgets: budgetCount,
        totalExpenses: expenseCount,
        totalReceipts: receiptCount,
        totalExpenseAmount: totalExpenses[0]?.total || 0,
        pendingApprovals: pendingExpenses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username createdAt');

    const recentExpenses = await Expense.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username');

    const activities = [
      ...recentUsers.map(user => ({
        type: 'user',
        message: `New user ${user.username} registered`,
        time: user.createdAt,
        status: 'success'
      })),
      ...recentExpenses.map(expense => ({
        type: 'expense',
        message: `Expense ${expense.name} submitted by ${expense.userId?.username}`,
        time: expense.createdAt,
        status: 'pending'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

// User Management Controllers
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// Expense Management Controllers
exports.approveExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { 
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: req.user.id
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense approved successfully',
      data: updatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving expense',
      error: error.message
    });
  }
};

exports.rejectExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { 
        status: 'rejected',
        rejectedAt: new Date(),
        rejectedBy: req.user.id
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense rejected successfully',
      data: updatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting expense',
      error: error.message
    });
  }
};

// Reports Controller
exports.getReportData = async (req, res) => {
  try {
    const { reportType } = req.params;
    const { range } = req.query;

    let dateFilter = {};
    const now = new Date();
    
    switch (range) {
      case 'today':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
          }
        };
        break;
      case 'thisWeek':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        dateFilter = { createdAt: { $gte: weekStart } };
        break;
      case 'thisMonth':
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
            $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
          }
        };
        break;
    }

    let reportData = {};

    switch (reportType) {
      case 'expenses':
        reportData = await Expense.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$category',
              totalAmount: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          }
        ]);
        break;
      case 'budgets':
        reportData = await Budget.find(dateFilter);
        break;
      default:
        return res.status(400).jsonexport
         default AdminSettings;
      }