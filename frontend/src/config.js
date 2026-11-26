// config.js — central place for the backend URL
// Points directly to your live production backend on Vercel
export const API_URL = (import.meta.env.VITE_API_URL || "https://bookio-backend-theta.vercel.app").replace(/\/+$/, "");
