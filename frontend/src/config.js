// config.js — central place for the backend URL
// Use VITE_API_URL environment variable in production, fallback to localhost for dev
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
