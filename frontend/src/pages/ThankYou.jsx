// ThankYou.jsx — confirmation page after sending a contact message
import { Link } from "react-router-dom";

function ThankYou() {
  return (
    <main>
      <section className="thankyou-page">
        <h1>Thank You!</h1>
        <p>Your message has been received. Our team will get back to you within 24 hours.</p>
        <Link to="/" className="thankyou-btn">
          Back to Bookstore
        </Link>
      </section>
    </main>
  );
}

export default ThankYou;
