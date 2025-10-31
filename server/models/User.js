import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] }, // persist refresh tokens per user
});

export default mongoose.model("User", userSchema);
