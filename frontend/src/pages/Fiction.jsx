// Fiction.jsx — displays all fiction books
import { useState, useEffect } from "react";
import BookCard from "../components/BookCard.jsx";
import { API_URL } from "../config.js";

function Fiction({ addToCart }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all books in the 'fiction' category
  useEffect(() => {
    const fetchFiction = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/books?category=fiction`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.result);
        }
      } catch (err) {
        console.log("Error loading fiction books:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiction();
  }, []);

  return (
    <main>
      <section className="page-width">
        <h1 className="fiction-page-title">FICTION</h1>
        <p className="title-quote">
          Every good story begins with “what if” for all the moments when reality isn’t enough.
        </p>

        {loading ? (
          <p className="loading-text">Loading fiction collection...</p>
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

export default Fiction;
