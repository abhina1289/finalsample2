const Budget = require('../model/budgetModel');

// Add or Update Budget Deposit
exports.addBudget = async (req, res) => {
  try {
    const { depositAmount } = req.body;
    const userId = req.user.id; // From JWT middleware

    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      return res.status(400).json({ 
        message: "Invalid deposit amount. Please enter a positive number." 
      });
    }

    const amount = parseFloat(depositAmount);
    let budget = await Budget.findOne({ userId });

    if (budget) {
      budget.totalBudget += amount;
      budget.remainingBudget += amount;
    } else {
      budget = new Budget({
        userId,
        totalBudget: amount,
        usedBudget: 0,
        remainingBudget: amount
      });
    }

    await budget.save();

    res.status(200).json({
      message: "Budget deposit successful",
      budget
    });
  } catch (error) {
    console.error('Error in addBudget:', error);
    res.status(500).json({ 
      message: "Internal server error while depositing budget" 
    });
  }
};

// Get Current Budget
exports.getBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budget = await Budget.findOne({ userId });
    
    if (!budget) {
      return res.status(404).json({ 
        message: "No budget found. Please deposit some amount first." 
      });
    }

    res.status(200).json({ budget });
  } catch (error) {
    console.error('Error in getBudget:', error);
    res.status(500).json({ 
      message: "Internal server error while fetching budget" 
    });
  }
};

// Update used budget (expense tracking)
exports.updateUsedBudget = async (req, res) => {
  try {
    const { expenseAmount } = req.body;
    const userId = req.user.id;

    if (!expenseAmount || isNaN(expenseAmount) || parseFloat(expenseAmount) <= 0) {
      return res.status(400).json({ 
        message: "Invalid expense amount. Please enter a positive number." 
      });
    }

    const amount = parseFloat(expenseAmount);
    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(404).json({ 
        message: "No budget found. Please deposit some amount first." 
      });
    }

    if (amount > budget.remainingBudget) {
      return res.status(400).json({ 
        message: "Insufficient budget. Cannot exceed remaining budget." 
      });
    }

    budget.usedBudget += amount;
    budget.remainingBudget -= amount;

    await budget.save();

    res.status(200).json({
      message: "Budget updated successfully",
      budget
    });
  } catch (error) {
    console.error('Error in updateUsedBudget:', error);
    res.status(500).json({ 
      message: "Internal server error while updating budget" 
    });
  }
};
