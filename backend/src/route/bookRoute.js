// bookRoute.js — all book-related API routes
import { Router } from "express";
import { createBook, getAllBooks, getOneBook, updateBook, deleteBook } from "../controller/bookController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Router();

// POST /api/books (protected) and GET /api/books (public)
router.route("/").post(isAuthenticated, createBook).get(getAllBooks);

// GET, PATCH, DELETE /api/books/:id
router.route("/:id").get(getOneBook).patch(isAuthenticated, updateBook).delete(isAuthenticated, deleteBook);

export default router;
