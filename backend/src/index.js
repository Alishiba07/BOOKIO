// index.js — the main entry point for the backend server
import express from "express";
import cors from "cors";
import connectToDb from "./connectToDb.js";
import { port } from "./constant.js";
import userRoute from "./route/userRoute.js";
import bookRoute from "./route/bookRoute.js";
import orderRoute from "./route/orderRoute.js";

const app = express();

// middleware: allow requests from any origin (needed for React frontend)
app.use(cors());

// middleware: parse JSON request bodies
app.use(express.json());

// test route — open http://localhost:8000/ to check if server is running
app.get("/", (req, res) => {
  res.json({ success: true, message: "BOOKIO API is running successfully!" });
});

// mount all routes
app.use("/api/users", userRoute);
app.use("/api/books", bookRoute);
app.use("/api/orders", orderRoute);

// connect to MongoDB, then start listening
connectToDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
