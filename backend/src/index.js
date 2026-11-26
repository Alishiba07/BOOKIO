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

// ensure DB is connected before handling any request (critical for serverless / Vercel)
app.use(async (req, res, next) => {
  await connectToDb();
  next();
});

// test route — open / to check if server is running
app.get("/", (req, res) => {
  res.json({ success: true, message: "BOOKIO API is running successfully!" });
});

// mount all routes
app.use("/api/users", userRoute);
app.use("/api/books", bookRoute);
app.use("/api/orders", orderRoute);

// If not running in a serverless environment (e.g. local or standalone server), start listening
if (process.env.VERCEL !== "1") {
  connectToDb().then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });
}

export default app;
