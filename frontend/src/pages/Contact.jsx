// Contact.jsx — contact page with information and a controlled form
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  // Controlled form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // Redirect to the thank you page
    navigate("/thankyou");
  };

  return (
    <main>
      <section className="contact">
        <div className="contact-container">
          {/* Left column: Contact Info */}
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p className="subtitle">We’re here to help.</p>
            <p className="say">
              Whether you have a question about a title, feedback on our store, or just want to talk about books, we’d love to hear from you.
            </p>

            <div className="info-block">
              <strong>Email</strong>
              <p>contact@bookio.com</p>
            </div>

            <div className="info-block">
              <strong>Phone</strong>
              <p>+977 1-4700975 (landline)</p>
              <p>+977 9846525426 (mobile)</p>
            </div>

            <div className="socials">
              <i className="fa-brands fa-facebook"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-brands fa-x-twitter"></i>
            </div>
          </div>

          {/* Right column: Controlled Contact Form */}
          <div className="contact-form">
            <h3>Send us a message</h3>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <textarea
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
