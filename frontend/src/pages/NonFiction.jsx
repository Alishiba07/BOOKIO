// NonFiction.jsx — displays all non-fiction books
import { useState, useEffect } from "react";
import BookCard from "../components/BookCard.jsx";
import { API_URL } from "../config.js";

function NonFiction({ addToCart }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all books in the 'nonfiction' category
  useEffect(() => {
    const fetchNonFiction = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/books?category=nonfiction`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.result);
        }
      } catch (err) {
        console.log("Error loading non-fiction books:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNonFiction();
  }, []);

  return (
    <main>
      <section className="page-width">
        <h1 className="nonfiction-page-title">NON-FICTION</h1>
        <p className="title-quote">
          For the curious minds, the seekers of truth, and the architects of knowledge.
        </p>

        {loading ? (
          <p className="loading-text">Loading non-fiction collection...</p>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <BookCard key={book._id} book={book} addToCart={addToCart} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default NonFiction;
