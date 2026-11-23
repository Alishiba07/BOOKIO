// userRoute.js — all user-related API routes
import { Router } from "express";
import { register, login, getUser, updateUser } from "../controller/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = Router();

// POST /api/users/register and POST /api/users/login
router.route("/register").post(register);
router.route("/login").post(login);

// GET and PATCH /api/users/:id
router.route("/:id").get(getUser).patch(isAuthenticated, updateUser);

export default router;
