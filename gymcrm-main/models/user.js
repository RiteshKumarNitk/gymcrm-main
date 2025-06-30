const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  photoUrl: String,
  role: {
    type: String,
    enum: ["superadmin", "gymadmin", "trainer", "member"],
    default: "member"
  },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
