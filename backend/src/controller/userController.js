// userController.js — handles register, login, get one user, update user
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../schema/userSchema.js";
import { secretKey } from "../constant.js";

// POST /api/users/register — create a new account
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // hash the password before saving (10 = salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/users/login — check email + password, return a JWT token
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // compare the entered password with the hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Wrong password" });
    }

    // create a token that lasts 365 days
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "365d" });

    // never send the password back to the client
    const { password: _, ...safeUser } = user.toObject();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      result: safeUser,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/users/:id — get one user by ID
export const getUser = async (req, res) => {
  try {
    const result = await User.findById(req.params.id).select("-password");
    if (!result) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User found", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/users/:id — update user (protected)
export const updateUser = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.status(200).json({ success: true, message: "User updated successfully", result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
