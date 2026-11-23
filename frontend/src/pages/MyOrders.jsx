// MyOrders.jsx — displays past orders placed by the logged-in user
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config.js";

function MyOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.result);
        }
      } catch (err) {
        console.log("Error loading orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <main>
        <div className="orders-page" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h1>My Orders</h1>
          <p style={{ marginTop: "14px", fontFamily: "Afacad, sans-serif", fontSize: "16px", color: "#555" }}>
            Please log in to view your past orders.
          </p>
          <div style={{ marginTop: "20px" }}>
            <Link to="/login" className="btn secondary" style={{ display: "inline-block" }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="orders-page">
        <h1>My Order History</h1>

        {loading ? (
          <p className="loading-text">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p className="empty-text">You haven’t placed any orders yet.</p>
            <Link to="/" className="btn secondary" style={{ display: "inline-block", marginTop: "16px" }}>
              Browse Bookstore
            </Link>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <strong>Order ID:</strong> #{order._id.slice(-6).toUpperCase()}
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="order-card-total">
                    ${order.totalPrice.toFixed(2)}
                  </div>
                </div>

                <div style={{ margin: "14px 0" }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.title} (Qty: {item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: "13px", color: "#666", marginTop: "10px", borderTop: "1px solid #f0f0f0", paddingTop: "8px" }}>
                  Ship to: <strong>{order.shippingName}</strong> · {order.shippingAddress} ({order.shippingPhone})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrders;
