const { body } = require("express-validator");

exports.validateBusiness = [
  body("businessName").notEmpty().withMessage("Business name is required"),
  body("businessType").isIn(["Gym", "Supplement Store", "Equipment Store"]),
  body("businessLocation").notEmpty(),
  body("ownerName").notEmpty(),
  body("ownerMobile").matches(/^[0-9]{10}$/),
  body("country").notEmpty(),
  body("state").notEmpty(),
  body("city").notEmpty(),
];
