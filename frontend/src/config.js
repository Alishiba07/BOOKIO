// config.js — central place for the backend URL
// In development, fall back to localhost:8000.
// In production (served via Nginx reverse proxy), fall back to "" (relative URL) so /api/... routes to the same host without CORS issues.
export const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? "http://localhost:8000" : "");
