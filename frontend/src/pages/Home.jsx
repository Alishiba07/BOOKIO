// Home.jsx — the homepage of BOOKIO
// Displays the original hero section, New Arrivals, Classic Titles, Gift Card, and Top Picks
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard.jsx";
import { API_URL } from "../config.js";

function Home({ addToCart }) {
  // State for each section of books
  const [newArrivals, setNewArrivals] = useState([]);
  const [classics, setClassics] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from backend when component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        // Fetch new arrivals
        const resNew = await fetch(`${API_URL}/api/books?category=new`);
        const dataNew = await resNew.json();
        if (dataNew.success) setNewArrivals(dataNew.result);

        // Fetch classic books
        const resClassic = await fetch(`${API_URL}/api/books?category=classic`);
        const dataClassic = await resClassic.json();
        if (dataClassic.success) setClassics(dataClassic.result);

        // Fetch top picks
        const resTop = await fetch(`${API_URL}/api/books?category=toppick`);
        const dataTop = await resTop.json();
        if (dataTop.success) setTopPicks(dataTop.result);
      } catch (err) {
        console.log("Error loading homepage books:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <main>
      {/* Original Hero Section */}
      <section className="hero">
        <div className="full-width">
          <div className="hero-img">
            <img src="/images/bg.jpg" alt="BOOKIO Bookshelf" />
            <div className="hero-text">
              <h1>WELCOME TO BOOKIO!</h1>
              <p>A Little Store of Big Stories</p>
              <div className="hero-buttons">
                <Link to="/fiction" className="btn primary">Shop Fiction</Link>
                <Link to="/nonfiction" className="btn secondary">Shop Non-Fiction</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Brand inspirational quote banner */}
        <div className="text">
          <p className="text-1">For the dreamers who dare, the thinkers who build, the storytellers who shape tomorrow.</p>
          <p className="text-2">- Change Begins With a Book.</p>
        </div>
      </section>

      {/* Main book sections */}
      <div className="page-width">
        {/* Loading state indicator */}
        {loading && <p className="loading-text">Loading books from BOOKIO shelves...</p>}

        {/* Section 1: New Arrivals */}
        <section className="arrivals">
          <div>
            <h2>New Arrivals</h2>
          </div>
          <div className="arrival-img book-row">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* Section 2: Our Best Classic Titles */}
        <section className="classics">
          <div>
            <h2>Our Best Classic Titles</h2>
          </div>
          <div className="classics-img book-row">
            {classics.map((book) => (
              <BookCard key={book._id} book={book} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* Section 3: Digital Gift Card */}
        <section className="card">
          <div>
            <img src="/images/card.png" alt="BOOKIO Digital Gift Card" />
            <div className="card-text">
              <h3>Digital Gift Card</h3>
              <p>
                Let them choose with a BOOKIO digital gift card. After checkout, the digital gift card code is delivered instantly via email. Gift cards are redeemable at bookio.com and at our physical store on any available title or category.
              </p>
              <Link to="/fiction" className="card-text1">Shop Gift Card</Link>
            </div>
          </div>
        </section>

        {/* Section 4: Our Top Picks */}
        <section className="top-picks" style={{ marginBottom: "60px" }}>
          <div>
            <h2>Our Top Picks</h2>
          </div>
          <div className="picks-img book-row">
            {topPicks.map((book) => (
              <BookCard key={book._id} book={book} addToCart={addToCart} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
