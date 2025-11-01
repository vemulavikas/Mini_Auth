import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: [{ type: String }], // 👈 store refresh tokens here
});

export default mongoose.model("User", userSchema);
