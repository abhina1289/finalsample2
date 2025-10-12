const mongoose = require("mongoose");
const Receipt = require("../model/receiptModel");

// ➕ Create receipt (per user)
exports.createReceipt = async (req, res) => {
  try {
    const { receiptName, amount, date, imageUrl } = req.body;

    if (!receiptName || !amount || !date) {
      return res.status(400).json({
        success: false,
        message: "Receipt name, amount, and date are required",
      });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number",
      });
    }

    const newReceipt = new Receipt({
      user: req.user.id, // 👈 link receipt to logged-in user
      receiptName,
      amount: amountNum,
      date,
      imageUrl: imageUrl || "",
    });

    await newReceipt.save();

    res.status(201).json({
      success: true,
      message: "Receipt created successfully",
      receipt: newReceipt,
    });
  } catch (err) {
    console.error("Create receipt error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create receipt",
      error: err.message,
    });
  }
};

// 📂 Get all receipts (user-specific)
exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: receipts.length,
      receipts,
    });
  } catch (err) {
    console.error("Get receipts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch receipts",
      error: err.message,
    });
  }
};

// 📄 Get single receipt (must belong to user)
exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!receipt) {
      return res.status(404).json({ success: false, message: "Receipt not found" });
    }

    res.status(200).json({ success: true, receipt });
  } catch (err) {
    console.error("Get receipt error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch receipt",
      error: err.message,
    });
  }
};

// ✏️ Update receipt (only owner can update)
// ✏️ Update receipt (only owner can update)
exports.updateReceipt = async (req, res) => {
  try {
    const { receiptName, amount, date, imageUrl } = req.body;

    // Build update object dynamically
    const updateFields = {};
    if (receiptName !== undefined) updateFields.receiptName = receiptName;
    if (date !== undefined) updateFields.date = date;
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;

    if (amount !== undefined) {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be a valid positive number",
        });
      }
      updateFields.amount = amountNum;
    }

    const updatedReceipt = await Receipt.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ensure ownership
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedReceipt) {
      return res.status(404).json({ success: false, message: "Receipt not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Receipt updated successfully",
      receipt: updatedReceipt,
    });
  } catch (err) {
    console.error("Update receipt error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update receipt",
      error: err.message,
    });
  }
};


// ❌ Delete receipt (only owner can delete)
exports.deleteReceipt = async (req, res) => {
  try {
    const deletedReceipt = await Receipt.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // 👈 only their own receipts
    });

    if (!deletedReceipt) {
      return res.status(404).json({ success: false, message: "Receipt not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Receipt deleted successfully",
      deletedReceipt,
    });
  } catch (err) {
    console.error("Delete receipt error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete receipt",
      error: err.message,
    });
  }
};

// 📊 Get totals (user-specific)
exports.getTotalReceipts = async (req, res) => {
  try {
    const result = await Receipt.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } }, // 👈 filter by user
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totals = result[0] || { totalAmount: 0, count: 0 };

    res.status(200).json({ success: true, totals });
  } catch (err) {
    console.error("Get totals error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to calculate totals",
      error: err.message,
    });
  }
};
