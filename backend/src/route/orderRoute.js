// orderRoute.js — all order-related API routes
import { Router } from "express";
import { createOrder, getMyOrders } from "../controller/orderController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Router();

// GET /api/orders/my — must come before /:id to avoid conflicts
router.route("/my").get(isAuthenticated, getMyOrders);

// POST /api/orders — place a new order
router.route("/").post(isAuthenticated, createOrder);

export default router;
