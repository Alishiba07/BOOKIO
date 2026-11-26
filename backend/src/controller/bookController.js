// bookController.js — handles create, read, update, delete for books
import Book from "../schema/bookSchema.js";
import { booksData } from "../booksData.js";

// POST /api/books — create a new book (protected)
export const createBook = async (req, res) => {
  try {
    const result = await Book.create(req.body);
    res.status(201).json({ success: true, message: "Book created successfully", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/books — get all books (public)
// Optional filters: ?category=fiction  or  ?search=harry
export const getAllBooks = async (req, res) => {
  try {
    // Auto-seed books into MongoDB Atlas if the collection is currently empty
    const totalCount = await Book.countDocuments();
    if (totalCount === 0 && booksData && booksData.length > 0) {
      console.log("Database empty. Auto-seeding 53 books into MongoDB...");
      await Book.insertMany(booksData);
    }

    let filter = {};

    // filter by category if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // search by title or author using a regex (case-insensitive)
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [{ title: regex }, { author: regex }];
    }

    const result = await Book.find(filter);
    res.status(200).json({ success: true, message: "Books fetched successfully", count: result.length, result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/books/seed — explicit route to force seed or reset database
export const seedBooks = async (req, res) => {
  try {
    await Book.deleteMany({});
    await Book.insertMany(booksData);
    res.status(200).json({
      success: true,
      message: `Successfully seeded ${booksData.length} books into MongoDB!`,
      count: booksData.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/books/:id — get one book by ID (public)
export const getOneBook = async (req, res) => {
  try {
    const result = await Book.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, message: "Book found", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/books/:id — update a book (protected)
export const updateBook = async (req, res) => {
  try {
    const result = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Book updated successfully", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/books/:id — delete a book (protected)
export const deleteBook = async (req, res) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Book deleted successfully", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
