import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000","https://mini-auth-pi.vercel.app"],
    credentials: true,
  })
);

// Rate limiter (global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // allow a bit more for dev
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// routes
app.use("/api/auth", authRoutes);

// db
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
