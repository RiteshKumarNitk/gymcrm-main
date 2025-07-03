const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.registerOrUpdateUser);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;