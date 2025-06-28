const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessType: {
    type: String,
    enum: ["Gym", "Supplement Store", "Equipment Store"],
    required: true,
  },
  businessLocation: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerMobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
});

module.exports = mongoose.model("Business", businessSchema);
