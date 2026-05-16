const db = require("../config/db");

// CREATE ITEM
exports.createItem = async (req, res) => {
  try {
    const { item_name, description, location_lost, date_lost, contact_info } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    await db.query(
      `INSERT INTO lost_items 
      (user_id, item_name, description, location_lost, date_lost, contact_info, image_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        item_name,
        description,
        location_lost,
        date_lost,
        contact_info,
        imagePath
      ]
    );

    res.status(201).json({ message: "Lost item posted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL ITEMS
exports.getAllItems = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT lost_items.*, users.name 
       FROM lost_items 
       JOIN users ON lost_items.user_id = users.id
       ORDER BY lost_items.created_at DESC`
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE ITEM
exports.getSingleItem = async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT lost_items.*, users.name 
       FROM lost_items 
       JOIN users ON lost_items.user_id = users.id
       WHERE lost_items.id = ?`,
      [req.params.id]
    );

    res.json(items[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE STATUS (Owner Only)
exports.updateStatus = async (req, res) => {
  try {
    const itemId = req.params.id;

    const [items] = await db.query(
      "SELECT * FROM lost_items WHERE id = ?",
      [itemId]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (items[0].user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await db.query(
      "UPDATE lost_items SET status = 'found' WHERE id = ?",
      [itemId]
    );

    res.json({ message: "Item marked as found" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN VERIFY
exports.verifyItem = async (req, res) => {
  try {
    await db.query(
      "UPDATE lost_items SET is_verified = TRUE WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Item verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN DELETE
exports.deleteItem = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM lost_items WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};