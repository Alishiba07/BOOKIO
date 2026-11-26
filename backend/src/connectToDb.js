// connectToDb.js — connects to MongoDB using mongoose with connection caching for serverless
import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore in environments where setting DNS is restricted
}

import mongoose from "mongoose";
import { dbUrl } from "./constant.js";

let cachedConnection = null;

const connectToDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB successfully!");
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectToDb;
