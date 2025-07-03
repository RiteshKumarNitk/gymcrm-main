const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Create membership - admin only
router.post(
  '/',
  authenticate,
  requireRole(['gymadmin', 'superadmin']),
  membershipController.createMembership
);

// Update membership - admin only
router.put(
  '/:id',
  authenticate,
  requireRole(['gymadmin', 'superadmin']),
  membershipController.updateMembership
);

// Get memberships for business - admin only
router.get(
  '/business',
  authenticate,
  requireRole(['gymadmin', 'superadmin']),
  membershipController.getBusinessMemberships
);

// Get membership details - accessible by admin and member
router.get(
  '/:id',
  authenticate,
  membershipController.getMembershipDetails
);

module.exports = router;