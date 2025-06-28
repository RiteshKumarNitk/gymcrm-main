const Business = require("../models/Business");

exports.createBusiness = async (req, res) => {
  try {
    const business = new Business(req.body);
    await business.save();
    res.status(201).json({ message: "Business created successfully", business });
  } catch (error) {
     console.error("Error creating business:", error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};


exports.getAllBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find();
    res.status(200).json(businesses);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};