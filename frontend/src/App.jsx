// App.jsx — root component: holds cart and auth state, renders all routes
import { useState } from "react";
import BookioRoute from "./BookioRoute.jsx";

function App() {
  // --- CART STATE ---
  // Cart is an array of { bookId, title, price, image, quantity }
  // We load from localStorage so it survives page refresh
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("bookio_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // --- AUTH STATE ---
  // After login we save token and user name in localStorage
  const [token, setToken] = useState(() => localStorage.getItem("bookio_token") || "");
  const [userName, setUserName] = useState(() => localStorage.getItem("bookio_user") || "");

  // Save cart to localStorage whenever it changes
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("bookio_cart", JSON.stringify(newCart));
  };

  // Add a book to the cart (or increase quantity if already there)
  const addToCart = (book) => {
    const existing = cart.find((item) => item.bookId === book._id);
    let newCart;
    if (existing) {
      // already in cart: bump quantity
      newCart = cart.map((item) =>
        item.bookId === book._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // new item
      newCart = [...cart, { bookId: book._id, title: book.title, price: book.price, image: book.image, quantity: 1 }];
    }
    saveCart(newCart);
  };

  // Remove one item from the cart
  const removeFromCart = (bookId) => {
    saveCart(cart.filter((item) => item.bookId !== bookId));
  };

  // Clear the cart (after checkout)
  const clearCart = () => saveCart([]);

  // Login: save token and name to state + localStorage
  const handleLogin = (token, name) => {
    setToken(token);
    setUserName(name);
    localStorage.setItem("bookio_token", token);
    localStorage.setItem("bookio_user", name);
  };

  // Logout: clear everything
  const handleLogout = () => {
    setToken("");
    setUserName("");
    localStorage.removeItem("bookio_token");
    localStorage.removeItem("bookio_user");
  };

  return (
    <BookioRoute
      cart={cart}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      clearCart={clearCart}
      token={token}
      userName={userName}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
}

export default App;
