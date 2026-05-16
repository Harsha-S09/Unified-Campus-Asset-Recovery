const express = require("express");
const router = express.Router();

const {
  createItem,
  getAllItems,
  getSingleItem,
  updateStatus,
  verifyItem,
  deleteItem
} = require("../controllers/lostItemController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Create item
router.post("/", verifyToken, upload.single("image"), createItem);

// Get all items
router.get("/", getAllItems);

// Get single item
router.get("/:id", getSingleItem);

// Update status (owner only)
router.put("/status/:id", verifyToken, updateStatus);

// Admin verify
router.put("/verify/:id", verifyToken, isAdmin, verifyItem);

// Admin delete
router.delete("/:id", verifyToken, isAdmin, deleteItem);

module.exports = router;