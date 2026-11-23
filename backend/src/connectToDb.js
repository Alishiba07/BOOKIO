// connectToDb.js — connects to MongoDB using mongoose
import mongoose from "mongoose";
import { dbUrl } from "./constant.js";

const connectToDb = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
    process.exit(1); // stop the app if DB fails
  }
};

export default connectToDb;
