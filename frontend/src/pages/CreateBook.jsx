// CreateBook.jsx — form to add a new book to MongoDB (protected route)
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config.js";

function CreateBook({ token }) {
  const navigate = useNavigate();

  // Controlled form inputs
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("fiction");
  const [stock, setStock] = useState(10);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      setLoading(true);
      const bookData = {
        title,
        author,
        price: Number(price),
        image: image || "/images/stoner.webp",
        description,
        category,
        stock: Number(stock),
      };

      console.log("Submitting new book:", bookData);

      const res = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Book created successfully!");
        setTimeout(() => {
          navigate(category === "nonfiction" ? "/nonfiction" : "/fiction");
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to create book");
      }
    } catch (err) {
      setErrorMsg("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main>
        <div className="create-book-page" style={{ textAlign: "center", padding: "80px 20px" }}>
          <h1>Add New Book</h1>
          <p style={{ marginTop: "14px", fontFamily: "Afacad, sans-serif", fontSize: "16px", color: "#555" }}>
            You need to be logged in to add books to the catalog.
          </p>
          <div style={{ marginTop: "20px" }}>
            <Link to="/login" className="btn secondary" style={{ display: "inline-block" }}>
              Log In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="create-book-page">
        <h1>Add New Book</h1>

        {successMsg && <div className="success-msg">{successMsg}</div>}
        {errorMsg && <div className="error-msg">{errorMsg}</div>}

        <form className="create-book-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.01"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Image Path (e.g. /images/stoner.webp)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="fiction">Fiction</option>
            <option value="nonfiction">Non-Fiction</option>
            <option value="new">New Arrival</option>
            <option value="classic">Classic</option>
            <option value="toppick">Top Pick</option>
          </select>

          <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <textarea
            placeholder="Book description or synopsis..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          ></textarea>

          <button type="submit" className="create-book-submit-btn" disabled={loading}>
            {loading ? "Adding Book..." : "Add Book to Catalog"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateBook;
