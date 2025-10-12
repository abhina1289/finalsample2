const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalBudget: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total budget cannot be negative']
  },
  usedBudget: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Used budget cannot be negative']
  },
  remainingBudget: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Remaining budget cannot be negative']
  }
}, {
  timestamps: true,
  collection: 'budgets'
});

// Keep consistency before save
budgetSchema.pre('save', function(next) {
  this.remainingBudget = this.totalBudget - this.usedBudget;
  if (this.usedBudget > this.totalBudget) {
    next(new Error('Used budget cannot exceed total budget'));
  } else {
    next();
  }
});

// Virtual property for % utilization
budgetSchema.virtual('utilizationPercentage').get(function() {
  return this.totalBudget > 0 ? Math.round((this.usedBudget / this.totalBudget) * 100) : 0;
});

budgetSchema.set('toJSON', { virtuals: true });

// ✅ Prevent OverwriteModelError
module.exports = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
