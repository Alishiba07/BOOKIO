// constant.js — central config file
// We read from process.env so the hosting site can override these.
// If not set, we fall back to safe local defaults.

export let port = process.env.PORT || 8000;
export let dbUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/bookio";
export let secretKey = process.env.JWT_SECRET || "bookio";
