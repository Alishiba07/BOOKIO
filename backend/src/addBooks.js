// addBooks.js — EXTRA script to seed books into MongoDB
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Fix for querySrv ECONNREFUSED on local DNS/ISPs

import mongoose from "mongoose";
import { dbUrl } from "./constant.js";
import Book from "./schema/bookSchema.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const books = require("../books.json");

const addBooks = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB...");

    // remove old books first to avoid duplicates
    await Book.deleteMany({});
    console.log("Old books cleared.");

    // insert all books at once
    await Book.insertMany(books);
    console.log(`Inserted ${books.length} books into MongoDB`);

    process.exit(0);
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

addBooks();
