const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // reference to user model
    required: true
  },
  receiptName: {
    type: String,
    required: [true, 'Receipt name is required'],
    trim: true,
    maxlength: [100, 'Receipt name cannot exceed 100 characters']
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  }
}, {
  timestamps: true
});

receiptSchema.index({ user: 1, createdAt: -1 }); // user-based queries will be faster

module.exports = mongoose.model("Receipt", receiptSchema);
