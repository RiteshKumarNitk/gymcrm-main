const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.registerOrUpdateUser);
router.get("/all", userController.getAllUsers);
router.get("/business/:businessId", userController.getUsersByBusiness);

module.exports = router;