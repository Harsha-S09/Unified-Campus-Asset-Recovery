const db = require("../config/db");
const jwt = require("jsonwebtoken");

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, student_id, phone, department, password } = req.body;

    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ? OR student_id = ?",
      [email, student_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    await db.query(
      "INSERT INTO users (name, email, student_id, phone, department, password) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, student_id, phone, department, password]
    );

    res.status(201).json({
      message: "Registration successful. Wait for admin approval."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    if (!user.is_approved) {
      return res.status(403).json({ message: "Waiting for admin approval" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PENDING USERS
exports.getPendingUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, student_id FROM users WHERE is_approved = FALSE AND role = 'student'"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// APPROVE USER
exports.approveUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await db.query(
      "UPDATE users SET is_approved = TRUE WHERE id = ?",
      [userId]
    );

    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REVOKE USER
exports.revokeUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await db.query(
      "UPDATE users SET is_approved = FALSE WHERE id = ?",
      [userId]
    );

    res.json({ message: "User access revoked" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};