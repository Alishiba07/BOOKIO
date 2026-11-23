// Checkout.jsx — checkout page with shipping form and order placement
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config.js";

function Checkout({ cart, clearCart, token }) {
  const navigate = useNavigate();

  // Controlled form state for shipping details
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Please login before placing your order.");
      return;
    }

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      // Prepare order data matching orderSchema
      const orderData = {
        items: cart.map((item) => ({
          book: item.bookId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingName,
        shippingAddress,
        shippingPhone,
        totalPrice: Number(totalPrice),
      };

      console.log("Submitting order:", orderData);

      // POST to backend with Authorization token
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        setSuccessMsg("Order placed successfully! Thank you for supporting BOOKIO.");
        setTimeout(() => {
          navigate("/my-orders");
        }, 2000);
      } else {
        setErrorMsg(data.message || "Failed to place order.");
      }
    } catch (err) {
      setErrorMsg("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in, prompt them to login first
  if (!token) {
    return (
      <main>
        <div className="checkout-page" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h1>Checkout</h1>
          <p style={{ marginTop: "14px", fontFamily: "Afacad, sans-serif", fontSize: "16px", color: "#555" }}>
            You need to be logged in to complete your checkout.
          </p>
          <div style={{ marginTop: "24px" }}>
            <Link to="/login" className="btn secondary" style={{ display: "inline-block" }}>
              Log In to Continue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="checkout-page">
        <h1>Checkout</h1>

        {successMsg && <div className="success-msg">{successMsg}</div>}
        {errorMsg && <div className="error-msg">{errorMsg}</div>}

        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3 style={{ fontFamily: "Frank Ruhl Libre, serif", marginBottom: "16px" }}>Shipping Details</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={shippingName}
            onChange={(e) => setShippingName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Shipping Address (Street, City, Postal Code)"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Contact Phone Number"
            value={shippingPhone}
            onChange={(e) => setShippingPhone(e.target.value)}
            required
          />

          {/* Order Summary */}
          <div className="checkout-order-summary">
            <h3>Order Summary ({cart.length} unique titles)</h3>
            {cart.map((item) => (
              <div key={item.bookId} className="checkout-order-item">
                <span>{item.title} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="checkout-total">
              <span>Total:</span>
              <span style={{ color: "rgb(255, 42, 5)" }}>${totalPrice}</span>
            </div>
          </div>

          <button
            type="submit"
            className="checkout-submit-btn"
            disabled={loading || cart.length === 0}
          >
            {loading ? "Placing Order..." : "Confirm & Place Order"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
