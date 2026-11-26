// connectToDb.js — connects to MongoDB using mongoose with connection caching for serverless
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Fix for querySrv ECONNREFUSED on local DNS/ISPs

import mongoose from "mongoose";
import { dbUrl } from "./constant.js";

let isConnected = false;

const connectToDb = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const db = await mongoose.connect(dbUrl);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
  }
};

export default connectToDb;
