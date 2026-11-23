// About.jsx — the About Us page
// Beautified layout with high visual appeal, keeping original essence and images
import { Link } from "react-router-dom";

function About() {
  return (
    <main>
      {/* Elegant Header Banner */}
      <section className="about-hero">
        <h1>WELCOME TO BOOKIO</h1>
        <p>A Little Store of Big Stories — Where Every Book Finds Its Reader</p>
      </section>

      <div className="about-content">
        {/* Story Section */}
        <section className="about-story">
          <img src="/images/bookstack.avif" alt="BOOKIO Books Collection" />
          <div className="about-story-text">
            <h2>Our Story</h2>
            <p>
              Bookio was born out of a simple belief: reading should feel like a sanctuary, not an overwhelming chore. In an era of cluttered shelves and impersonal storefronts, we set out to create a warm, curated space where timeless classics and contemporary voices coexist.
            </p>
            <p style={{ marginTop: "14px" }}>
              Every book in our collection is handpicked with intention. Built by readers, shaped by their passions, and crafted for their comfort, Bookio is your quiet corner to discover stories that linger long after the final page.
            </p>
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="about-values">
          <div className="about-value-card">
            <i className="fa-solid fa-book-open"></i>
            <h3>Thoughtful Curation</h3>
            <p>We don’t believe in endless rows of noise. We choose titles that challenge, inspire, and deeply move.</p>
          </div>
          <div className="about-value-card">
            <i className="fa-solid fa-heart"></i>
            <h3>Reader-First Design</h3>
            <p>From seamless browsing to instant delivery, every touchpoint is designed with the reader in mind.</p>
          </div>
          <div className="about-value-card">
            <i className="fa-solid fa-feather-pointed"></i>
            <h3>Change Begins Here</h3>
            <p>For the dreamers, thinkers, and storytellers who believe that a single book can reshape tomorrow.</p>
          </div>
        </section>

        {/* Manifesto Section */}
        <section className="about-manifesto">
          <div style={{ display: "flex", gap: "40px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <h2>Our Manifesto</h2>
              <p>
                At Bookio, we believe that stories are humanity’s greatest bridge. We exist to remove the friction between curious minds and profound literature. We stand for transparency, simplicity, and love for the written word.
              </p>
              <ul>
                <li>We listen to our readers.</li>
                <li>We build for our readers.</li>
                <li>We grow with our readers.</li>
              </ul>
            </div>
            <div style={{ width: "240px", flexShrink: 0 }}>
              <img
                src="/images/Book cover.jpg"
                alt="Bookio Manifesto Poster"
                style={{ width: "100%", borderRadius: "4px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}
              />
            </div>
          </div>
        </section>

        {/* Our Promise Banner */}
        <section className="about-promise">
          <h2>Our Promise To Every Reader</h2>
          <p>
            To keep improving, keep learning, and keep putting our community at the heart of everything we create.
          </p>
          <div style={{ marginTop: "20px" }}>
            <Link to="/" className="btn secondary" style={{ display: "inline-block" }}>
              Explore Our Shelves →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;
