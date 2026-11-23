// Cart.jsx — shopping cart page showing selected books
import { Link } from "react-router-dom";

function Cart({ cart, removeFromCart }) {
  // Calculate total price of all items in cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <main>
      <div className="cart-page">
        <h1>Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p className="empty-text">Your cart is currently empty.</p>
            <Link to="/" className="btn secondary" style={{ display: "inline-block", marginTop: "16px" }}>
              Explore Books
            </Link>
          </div>
        ) : (
          <div>
            {/* List of cart items */}
            {cart.map((item) => (
              <div key={item.bookId} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-price">${item.price}</div>
                  <div className="cart-item-qty">Quantity: {item.quantity}</div>
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.bookId)}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Cart summary & Checkout action */}
            <div className="cart-total">
              Subtotal: <span>${totalPrice}</span>
            </div>

            <div style={{ textAlign: "right" }}>
              <Link to="/checkout" className="cart-checkout-btn">
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;
