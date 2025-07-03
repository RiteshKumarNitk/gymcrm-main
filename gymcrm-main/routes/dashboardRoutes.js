const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Admin dashboard - requires gymadmin or superadmin role
router.get(
  '/admin', 
  authenticate, 
  requireRole(['gymadmin', 'superadmin']), 
  dashboardController.getAdminDashboard
);

// Member dashboard
router.get(
  '/member', 
  authenticate, 
  requireRole(['member']), 
  dashboardController.getMemberDashboard
);

module.exports = router;