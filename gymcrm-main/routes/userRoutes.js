const express = require("express");
const router = express.Router();
const {
  registerOrUpdateUser,
  getAllUsers,
  getUsersByBusiness,
} = require("../controllers/userController");

// Register user (Google or Firebase UID)
router.post("/register", registerOrUpdateUser);

// Get all users (for superadmin/admin)
router.get("/", getAllUsers);

// Get users by gym (business) ID
router.get("/business/:businessId", getUsersByBusiness);

module.exports = router;
