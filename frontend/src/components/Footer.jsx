// Footer.jsx — bottom footer with original logo and links
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        {/* Original Logo */}
        <div className="footer-logo">
          <img src="/images/logo.png" alt="BOOKIO" />
        </div>

        {/* Quick links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/fiction">Fiction</Link></li>
            <li><Link to="/nonfiction">Non-Fiction</Link></li>
          </ul>
        </div>

        {/* Genres */}
        <div className="footer-column">
          <h4>Genres</h4>
          <ul>
            <li><Link to="/fiction">Fiction</Link></li>
            <li><Link to="/nonfiction">Non-Fiction</Link></li>
          </ul>
        </div>

        {/* About & Contact */}
        <div className="footer-column">
          <h4><Link to="/about" className="about-link">About Us</Link></h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="#">Help &amp; Support</a></li>
            <li><a href="#">Terms &amp; Privacy</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom credit line */}
      <div className="footer-bottom" style={{ textAlign: "center", paddingTop: "20px", fontSize: "13px", color: "#777", fontFamily: "Afacad, sans-serif" }}>
        © 2024 BOOKIO · A Little Store of Big Stories
      </div>
    </footer>
  );
}

export default Footer;
