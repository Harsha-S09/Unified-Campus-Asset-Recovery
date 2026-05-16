const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getConversation,
  getUserConversations
} = require("../controllers/messageController");

const { verifyToken } = require("../middleware/authMiddleware");

// Send message
router.post("/", verifyToken, sendMessage);

// Get conversation between two users (for an item)
router.get("/conversation/:userId/:itemId", verifyToken, getConversation);

// Get all conversations of logged in user
router.get("/my", verifyToken, getUserConversations);

module.exports = router;