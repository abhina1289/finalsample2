const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: [
      'Food', 'Transport', 'Utilities', 'Entertainment',
      'Healthcare', 'Shopping', 'Business', 'Education', 'Travel', 'Other'
    ],
    default: 'Other'
  },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  description: { type: String, default: '', trim: true },
  receiptUrl: { type: String, default: '', trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto update timestamps
expenseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
expenseSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
