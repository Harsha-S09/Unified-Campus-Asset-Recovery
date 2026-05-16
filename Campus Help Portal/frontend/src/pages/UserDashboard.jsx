import { useState, useEffect, useContext } from "react";
import API from "../services/api";
import AuthContext from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    item_name: "",
    description: "",
    location_lost: "",
    date_lost: "",
    contact_info: "",
    image: null
  });

  // Messaging states
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load items once
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await API.get("/items");
        setItems(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const refreshItems = async () => {
    const res = await API.get("/items");
    setItems(res.data);
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    await API.post("/items", formData);

    setForm({
      item_name: "",
      description: "",
      location_lost: "",
      date_lost: "",
      contact_info: "",
      image: null
    });

    refreshItems();
  };

  const markAsFound = async (id) => {
    await API.put(`/items/status/${id}`);
    refreshItems();
  };

  // -------------------------
  // Messaging Functions
  // -------------------------

  const openChat = async (item) => {
    try {
      setSelectedChat(item);

      const res = await API.get(
        `/messages/conversation/${item.user_id}/${item.id}`
      );

      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await API.post("/messages", {
        receiver_id: selectedChat.user_id,
        item_id: selectedChat.id,
        message: newMessage
      });

      setNewMessage("");

      // Reload conversation
      const res = await API.get(
        `/messages/conversation/${selectedChat.user_id}/${selectedChat.id}`
      );

      setMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div>
      <h2>User Dashboard</h2>

      {/* ===================== */}
      {/* Create Lost Item */}
      {/* ===================== */}
      <div className="user-section">
        <h3>Report Lost Item</h3>

        <form className="item-form" onSubmit={handleSubmit}>
          <input
            name="item_name"
            placeholder="Item Name"
            value={form.item_name}
            onChange={handleChange}
            required
          />

          <input
            name="location_lost"
            placeholder="Location Lost"
            value={form.location_lost}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date_lost"
            value={form.date_lost}
            onChange={handleChange}
            required
          />

          <input
            name="contact_info"
            placeholder="Contact Info"
            value={form.contact_info}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input type="file" name="image" onChange={handleChange} />

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* ===================== */}
      {/* Filter Section */}
      {/* ===================== */}
      <div className="filter-section">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("lost")}>Lost</button>
        <button onClick={() => setFilter("found")}>Found</button>
      </div>

      {/* ===================== */}
      {/* Items List */}
      {/* ===================== */}
      <div className="items-section">
        {filteredItems.map((item) => (
          <div key={item.id} className="item-card">
            <h4>{item.item_name}</h4>
            <p>{item.description}</p>
            <p><strong>Location:</strong> {item.location_lost}</p>
            <p><strong>Date:</strong> {item.date_lost}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Contact:</strong> {item.contact_info}</p>
            <p><strong>Posted by:</strong> {item.name}</p>
            <p><strong>Verified:</strong> {item.is_verified ? "Yes" : "No"}</p>

            {item.image_path && (
              <img
                src={`http://localhost:5000/uploads/${item.image_path}`}
                alt="Lost item"
                className="item-image"
              />
            )}

            {/* Owner Mark as Found */}
            {item.user_id === user.id && item.status === "lost" && (
              <button onClick={() => markAsFound(item.id)}>
                Mark as Found
              </button>
            )}

            {/* Message Button */}
            {item.user_id !== user.id && (
              <button onClick={() => openChat(item)}>
                Message
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ===================== */}
      {/* Chat Section */}
      {/* ===================== */}
      {selectedChat && (
        <div className="chat-section">
          <h3>Chat about: {selectedChat.item_name}</h3>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.sender_id === user.id
                    ? "chat-bubble me"
                    : "chat-bubble other"
                }
              >
                {msg.message}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
            />

            <button onClick={sendMessage}>Send</button>

            <button
              style={{ background: "#ef4444" }}
              onClick={() => setSelectedChat(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;