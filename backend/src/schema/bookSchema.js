// bookSchema.js — defines what a Book looks like in MongoDB
import { Schema, model } from "mongoose";

let bookSchema = Schema({
  title: { type: String, required: [true, "title is required"] },
  author: { type: String, required: [true, "author is required"] },
  price: { type: Number, required: [true, "price is required"] },
  // image is a path string like "/images/stoner.webp" (points to public/images/)
  image: { type: String },
  description: { type: String },
  // category matches home sections: new, classic, toppick, fiction, nonfiction
  category: { type: String },
  stock: { type: Number, default: 10 },
});

let Book = model("Book", bookSchema);

export default Book;
