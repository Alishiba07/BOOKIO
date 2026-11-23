// BookDetails.jsx — detailed view for a single book
// Dynamic route: /book/:id
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../config.js";

function BookDetails({ addToCart }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Fetch single book details by ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/books/${id}`);
        const data = await res.json();
        if (data.success) {
          setBook(data.result);
        }
      } catch (err) {
        console.log("Error loading book details:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAdd = () => {
    if (book) {
      addToCart(book);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading book details...</p>;
  }

  if (!book) {
    return (
      <div className="page-width" style={{ textAlign: "center", padding: "80px 0" }}>
        <h2>Book Not Found</h2>
        <p style={{ marginTop: "10px", color: "#666" }}>The requested book could not be found in our catalog.</p>
        <Link to="/" className="btn secondary" style={{ display: "inline-block", marginTop: "20px" }}>
          Back to Bookstore
        </Link>
      </div>
    );
  }

  return (
    <main>
      <div className="book-details-page">
        {/* Cover Image */}
        <img src={book.image} alt={book.title} />

        {/* Book Information */}
        <div className="book-details-info">
          <h1>{book.title}</h1>
          <p className="author">By {book.author}</p>
          <p className="price">${book.price}</p>
          <p className="description">
            {book.description || "A captivating work from our curated collection. Available for fast domestic delivery."}
          </p>

          <div style={{ marginBottom: "20px", fontSize: "14px", color: "#555", fontFamily: "Afacad, sans-serif" }}>
            <p><strong>Category:</strong> {book.category ? book.category.toUpperCase() : "GENERAL"}</p>
            <p><strong>Availability:</strong> {book.stock > 0 ? `In Stock (${book.stock} available)` : "Out of Stock"}</p>
          </div>

          {/* Add to Cart button */}
          <button className="add-cart-btn" onClick={handleAdd}>
            {added ? "✓ Added to Cart!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default BookDetails;
