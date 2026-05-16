const db = require("../config/db");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, item_id, message } = req.body;

    await db.query(
      "INSERT INTO messages (sender_id, receiver_id, item_id, message) VALUES (?, ?, ?, ?)",
      [req.user.id, receiver_id, item_id || null, message]
    );

    res.status(201).json({ message: "Message sent successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET CONVERSATION BETWEEN TWO USERS FOR ITEM
exports.getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    const itemId = req.params.itemId;

    const [messages] = await db.query(
      `SELECT * FROM messages
       WHERE 
       ((sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?))
       AND item_id = ?
       ORDER BY created_at ASC`,
      [
        currentUserId,
        otherUserId,
        otherUserId,
        currentUserId,
        itemId
      ]
    );

    res.json(messages);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL CONVERSATIONS FOR LOGGED IN USER
exports.getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const [conversations] = await db.query(
      `SELECT DISTINCT 
         m.item_id,
         u.id as other_user_id,
         u.name as other_user_name
       FROM messages m
       JOIN users u 
         ON (u.id = m.sender_id OR u.id = m.receiver_id)
       WHERE (m.sender_id = ? OR m.receiver_id = ?)
       AND u.id != ?`,
      [userId, userId, userId]
    );

    res.json(conversations);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};