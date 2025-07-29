const Receipt = require("./receiptModel");

// Add new receipt
exports.createReceipt = async (req, res) => {
  try {
    const { receiptName, amount, date } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newReceipt = new Receipt({
      receiptName,
      amount,
      date,
      imageUrl
    });

    await newReceipt.save();
    res.status(201).json(newReceipt);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get all receipts
exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.status(200).json(receipts);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update receipt
exports.updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiptName, amount, date } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedData = {
      receiptName,
      amount,
      date,
    };
    if (imageUrl) updatedData.imageUrl = imageUrl;

    const updatedReceipt = await Receipt.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    res.status(200).json(updatedReceipt);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Delete receipt
exports.deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    await Receipt.findByIdAndDelete(id);
    res.status(200).json({ message: "Receipt deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
