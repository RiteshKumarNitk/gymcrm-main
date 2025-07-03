const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authenticate = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

// Get all subscription plans (public)
router.get('/plans', subscriptionController.getSubscriptionPlans);

// Subscribe to a plan - gym admin only
router.post(
  '/subscribe',
  authenticate,
  requireRole(['gymadmin', 'superadmin']),
  subscriptionController.subscribeToPlan
);

// Get current business subscription
router.get(
  '/current',
  authenticate,
  requireRole(['gymadmin', 'superadmin']),
  subscriptionController.getBusinessSubscription
);

// Cancel subscription
router.delete(
  '/cancel',
  authenticate,
  requireRole(['gymadmin', 'superadmin']),
  subscriptionController.cancelSubscription
);

module.exports = router;
