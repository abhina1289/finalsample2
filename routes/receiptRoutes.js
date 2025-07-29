const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createReceipt,
  getReceipts,
  updateReceipt,
  deleteReceipt,
} = require("./receiptController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), createReceipt);
router.get("/", getReceipts);
router.put("/:id", upload.single("image"), updateReceipt);
router.delete("/:id", deleteReceipt);

module.exports = router;
 