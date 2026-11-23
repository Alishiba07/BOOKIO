// Navbar.jsx — top navigation bar with original logo, links, search (with icon), cart, and user account icon
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config.js";

function Navbar({ cartCount, token, userName, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // dropdown for user icon

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search: wait 250ms after user stops typing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API_URL}/api/books?search=${encodeURIComponent(searchTerm)}`);
        const data = await res.json();
        setResults(data.result || []);
        setShowDropdown(true);
      } catch {
        setResults([]);
      }
      setSearching(false);
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleResultClick = (bookId) => {
    setSearchTerm("");
    setShowDropdown(false);
    navigate(`/book/${bookId}`);
  };

  return (
    <header>
      <div className="container">
        {/* Left: Navigation Links */}
        <nav>
          <Link to="/">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Center: Original Logo made bigger */}
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="BOOKIO" />
          </Link>
        </div>

        {/* Right: Search bar with search icon, Cart icon, and User Account icon */}
        <div className="icon">
          {/* Search bar with embedded search icon */}
          <div className="search-wrapper" ref={dropdownRef}>
            <i className="fa-solid fa-magnifying-glass search-icon-embedded"></i>
            <input
              className="search-input"
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (results.length > 0) setShowDropdown(true);
              }}
            />

            {/* Live Search dropdown */}
            {showDropdown && (
              <div className="search-dropdown">
                {searching && <div className="search-no-results">Searching...</div>}
                {!searching && results.length === 0 && (
                  <div className="search-no-results">No books found</div>
                )}
                {!searching && results.map((book) => (
                  <div
                    key={book._id}
                    className="search-dropdown-item"
                    onClick={() => handleResultClick(book._id)}
                  >
                    <img src={book.image} alt={book.title} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>{book.title}</div>
                      <div style={{ fontSize: "12px", color: "#666" }}>{book.author} · ${book.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Icon with count badge */}
          <Link to="/cart" className="cart-wrapper" title="Shopping Cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Icon instead of Login / Register text */}
          <div className="user-icon-wrapper" ref={userMenuRef}>
            <button
              type="button"
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={token ? `Account: ${userName}` : "Account (Sign In / Register)"}
            >
              <i className={token ? "fa-solid fa-user user-active" : "fa-regular fa-user"}></i>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="user-dropdown-menu">
                {token ? (
                  <>
                    <div className="user-dropdown-header">
                      <span>Hello,</span>
                      <strong>{userName}</strong>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <Link
                      to="/my-orders"
                      className="user-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fa-solid fa-box-open"></i> My Orders
                    </Link>
                    <Link
                      to="/create-book"
                      className="user-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fa-solid fa-plus-circle"></i> Add Book
                    </Link>
                    <div className="user-dropdown-divider"></div>
                    <button
                      type="button"
                      className="user-dropdown-item logout-item"
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="user-dropdown-header">
                      <span>Welcome to BOOKIO</span>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <Link
                      to="/login"
                      className="user-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="user-dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <i className="fa-solid fa-user-plus"></i> Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
