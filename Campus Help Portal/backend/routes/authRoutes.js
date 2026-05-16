const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getPendingUsers,
  approveUser,
  revokeUser
} = require("../controllers/authController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin only
router.get("/pending", verifyToken, isAdmin, getPendingUsers);
router.put("/approve/:id", verifyToken, isAdmin, approveUser);
router.put("/revoke/:id", verifyToken, isAdmin, revokeUser);

module.exports = router;