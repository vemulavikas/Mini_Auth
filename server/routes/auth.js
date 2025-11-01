import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Simple helper validations
const isValidEmail = (email) =>
  typeof email === "string" &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (pwd) =>
  typeof pwd === "string" && pwd.length >= 8; // require 8+ chars

// Token generators
const generateAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

// ========== REGISTER ==========
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic server-side validation
    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required" });

    if (!isValidEmail(email))
      return res.status(400).json({ msg: "Invalid email format" });

    if (!isValidPassword(password))
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    return res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ========== LOGIN ==========
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in user's document
    await User.updateOne(
      { _id: user._id },
      { $addToSet: { refreshTokens: refreshToken } } // avoid duplicates
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ========== REFRESH ==========
router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ msg: "No token provided" });

    // Verify token validity and that it exists in some user's refreshTokens
    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ msg: "Refresh token invalid or expired" });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(403).json({ msg: "User not found" });

    if (!user.refreshTokens.includes(token))
      return res.status(403).json({ msg: "Refresh token revoked" });

    // Issue new access token
    const accessToken = generateAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ========== LOGOUT ==========
router.post("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ msg: "No token provided" });

    // Remove refresh token from whichever user has it
    await User.updateOne({ refreshTokens: token }, { $pull: { refreshTokens: token } });

    return res.json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
