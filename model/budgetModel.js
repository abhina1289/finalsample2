const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
  title: String,
  saved: Number,
  goal: Number,
  start: Number,
  monthsLeft: Number,
});

const budgetSchema = new mongoose.Schema({
  year: Number,
  totalSavingsGoal: Number,
  startCapital: Number,
  monthlyPayments: Number,
  totalSaved: Number,
  leftToSave: Number,
  funds: [fundSchema],
});

module.exports = mongoose.model('Budget', budgetSchema);
