const express = require("express");
const router = express.Router();
const { createBusiness } = require("../controllers/businessController");
const { validateBusiness } = require("../validations/businessValidation");
const { validationResult } = require("express-validator");

const Business = require("../models/Business");

router.post("/", validateBusiness, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, createBusiness);

router.get("/", async (req, res) => {
  const allBusiness = await Business.find();
  res.json(allBusiness);
});

module.exports = router;

// PORT=5000
// MONGO_URI=mongodb+srv://riteshkumarnitk21:dsfTdq9xIZWYbaah@gymcrm.7rxeak5.mongodb.net/gymcrm?retryWrites=true&w=majority
// # MONGO_URI=mongodb+srv://riteshkumarnitk21:riteshkumarnitk21@gym.cfb4v.mongodb.net
// # MONGO_URI=mongodb+srv://riteshkumarnitk21:My%40Secure%3Ariteshkumarnitk21@gym.cfb4v.mongodb.net/gymcrm?retryWrites=true&w=majority
// # MONGO_URI=mongodb+srv://riteshkumarnitk21:riteshkumarnitk2105@gymcrm.7rxeak5.mongodb.net/?retryWrites=true&w=majority&appName=gymcrm