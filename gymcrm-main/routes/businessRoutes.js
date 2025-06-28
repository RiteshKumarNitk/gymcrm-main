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
