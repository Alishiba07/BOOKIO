// BookioRoute.jsx — all routes in one place (like SunwayRoute.jsx from class)
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Fiction from "./pages/Fiction.jsx";
import NonFiction from "./pages/NonFiction.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import BookDetails from "./pages/BookDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import CreateBook from "./pages/CreateBook.jsx";

function BookioRoute({ cart, addToCart, removeFromCart, clearCart, token, userName, onLogin, onLogout }) {
  // total items in cart (for the navbar badge)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Navbar shows on every page */}
      <Navbar cartCount={cartCount} token={token} userName={userName} onLogout={onLogout} />

      {/* All page routes */}
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/fiction" element={<Fiction addToCart={addToCart} />} />
        <Route path="/nonfiction" element={<NonFiction addToCart={addToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/book/:id" element={<BookDetails addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} token={token} />} />
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-orders" element={<MyOrders token={token} />} />
        <Route path="/create-book" element={<CreateBook token={token} />} />
      </Routes>

      {/* Footer shows on every page */}
      <Footer />
    </>
  );
}

export default BookioRoute;
