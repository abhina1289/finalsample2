// routes/receiptRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/jwtMiddleware");

const {
  createReceipt,
  getReceipts,
  getReceiptById,
  updateReceipt,
  deleteReceipt,
  getTotalReceipts
} = require("../controllers/receiptController");

// ✅ Receipt routes (all protected by JWT)
router.post("/", authenticateToken, createReceipt);        // ➕ Create new receipt
router.get("/", authenticateToken, getReceipts);          // 📂 Get all receipts (user-specific)
router.get("/total", authenticateToken, getTotalReceipts);// 📊 Get totals for receipts
router.get("/:id", authenticateToken, getReceiptById);    // 📄 Get single receipt
router.put("/:id", authenticateToken, updateReceipt);     // ✏️ Update receipt
router.delete("/:id", authenticateToken, deleteReceipt);  // ❌ Delete receipt

module.exports = router;
