const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  receiptName: {
     type: String,
      required: true 
    },
  imageUrl: {
     type: String 
    },
  amount: { 
    type: Number,
     required: true 
    },
  date: {
     type: String,
      required: true 
    },
},
 {
  timestamps: true,
});

module.exports = mongoose.model("Receipt", receiptSchema);
