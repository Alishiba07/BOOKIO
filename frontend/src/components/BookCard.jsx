// BookCard.jsx — reusable card component for displaying one book
// Used on Home, Fiction, NonFiction pages
import { useNavigate } from "react-router-dom";

function BookCard({ book, addToCart }) {
  const navigate = useNavigate();

  // Navigate to book details page when image/title is clicked
  const handleClick = () => navigate(`/book/${book._id}`);

  return (
    <div className="bookcard">
      {/* Book cover image */}
      <img
        src={book.image}
        alt={book.title}
        onClick={handleClick}
      />

      {/* Info below the cover */}
      <div className="bookcard-info">
        <div className="bookcard-title" onClick={handleClick}>{book.title}</div>
        <div className="bookcard-author">{book.author}</div>
        <div className="bookcard-price">${book.price}</div>

        {/* Add to cart button — only shown if addToCart prop is provided */}
        {addToCart && (
          <button
            className="bookcard-add-btn"
            onClick={() => addToCart(book)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default BookCard;
