import { useState, useEffect } from "react";
import API from "../services/api";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [items, setItems] = useState([]);

  // Load everything once on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, itemsRes] = await Promise.all([
          API.get("/auth/pending"),
          API.get("/items"),
        ]);

        setPendingUsers(usersRes.data);
        setItems(itemsRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const approveUser = async (id) => {
    await API.put(`/auth/approve/${id}`);
    refreshPending();
  };

  const revokeUser = async (id) => {
    await API.put(`/auth/revoke/${id}`);
    refreshPending();
  };

  const verifyItem = async (id) => {
    await API.put(`/items/verify/${id}`);
    refreshItems();
  };

  const deleteItem = async (id) => {
    await API.delete(`/items/${id}`);
    refreshItems();
  };

  const refreshPending = async () => {
    const res = await API.get("/auth/pending");
    setPendingUsers(res.data);
  };

  const refreshItems = async () => {
    const res = await API.get("/items");
    setItems(res.data);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div className="admin-section">
        <h3>Pending Student Approvals</h3>

        {pendingUsers.length === 0 ? (
          <p>No pending approvals</p>
        ) : (
          pendingUsers.map((user) => (
            <div key={user.id} className="admin-card">
              <p>
                <strong>{user.name}</strong> ({user.email})
              </p>
              <button onClick={() => approveUser(user.id)}>Approve</button>
              <button
                className="danger"
                onClick={() => revokeUser(user.id)}
              >
                Revoke
              </button>
            </div>
          ))
        )}
      </div>

      <div className="admin-section">
        <h3>All Lost Items</h3>

        {items.map((item) => (
          <div key={item.id} className="admin-card">
            <p>
              <strong>{item.item_name}</strong> - {item.status}
            </p>
            <p>Posted by: {item.name}</p>
            <p>Verified: {item.is_verified ? "Yes" : "No"}</p>

            <button onClick={() => verifyItem(item.id)}>Verify</button>
            <button
              className="danger"
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;