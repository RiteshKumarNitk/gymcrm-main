const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: false },
  uid: { type: String, unique: false }, // Firebase UID
  phone: { type: String },
  email: { type: String },
  name: { type: String },
  photoUrl: { type: String },
  role: {
    type: String,
    enum: ["superadmin", "gymadmin", "trainer", "member"],
    default: "member",
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
