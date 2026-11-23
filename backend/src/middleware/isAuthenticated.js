// isAuthenticated.js — middleware that checks if the user is logged in
// It reads the JWT token from the Authorization header and verifies it.
import jwt from "jsonwebtoken";
import { secretKey } from "../constant.js";

const isAuthenticated = (req, res, next) => {
  try {
    // The header looks like: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // get the token part after "Bearer "
    const decoded = jwt.verify(token, secretKey); // check token is valid
    req.id = decoded.id; // save user id on request so controllers can use it
    next(); // allow the request to continue
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default isAuthenticated;
