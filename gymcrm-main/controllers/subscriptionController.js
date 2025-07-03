const { SubscriptionPlan } = require('../models/payment');
const Business = require('../models/business');

// Get all subscription plans
exports.getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true })
      .sort({ sortOrder: 1, price: 1 });
    
    res.json(plans);
  } catch (error) {
    console.error('Get Subscription Plans Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Subscribe business to a plan
exports.subscribeToPlan = async (req, res) => {
  try {
    const { planId, paymentMethodId } = req.body;
    const businessId = req.user.businessId;
    
    if (!businessId) {
      return res.status(403).json({ error: 'No business associated with user' });
    }
    
    const [plan, business] = await Promise.all([
      SubscriptionPlan.findById(planId),
      Business.findById(businessId)
    ]);
    
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }
    
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    // Check if business is already subscribed
    if (business.subscription.status === 'active') {
      return res.status(400).json({ error: 'Business already has an active subscription' });
    }
    
    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    switch (plan.billingCycle) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    // Update business subscription
    business.subscription = {
      plan: plan.name.toLowerCase(),
      status: 'active',
      startDate,
      endDate,
      maxMembers: plan.maxMembers,
      maxTrainers: plan.maxTrainers,
      features: plan.features
    };
    
    await business.save();
    
    res.json({
      message: 'Successfully subscribed to plan',
      subscription: business.subscription
    });
    
  } catch (error) {
    console.error('Subscribe to Plan Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get business subscription details
exports.getBusinessSubscription = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    
    if (!businessId) {
      return res.status(403).json({ error: 'No business associated with user' });
    }
    
    const business = await Business.findById(businessId)
      .select('subscription stats');
    
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    // Calculate usage metrics
    const usageMetrics = {
      memberUsage: {
        current: business.stats.totalMembers,
        limit: business.subscription.maxMembers,
        percentage: (business.stats.totalMembers / business.subscription.maxMembers) * 100
      },
      trainerUsage: {
        current: business.stats.totalTrainers,
        limit: business.subscription.maxTrainers,
        percentage: (business.stats.totalTrainers / business.subscription.maxTrainers) * 100
      }
    };
    
    res.json({
      subscription: business.subscription,
      usage: usageMetrics
    });
    
  } catch (error) {
    console.error('Get Business Subscription Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { reason, cancellationDate } = req.body;
    const businessId = req.user.businessId;
    
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    
    // Update subscription status
    business.subscription.status = 'cancelled';
    business.subscription.cancelledAt = cancellationDate || new Date();
    business.subscription.cancellationReason = reason;
    
    await business.save();
    
    res.json({
      message: 'Subscription cancelled successfully',
      subscription: business.subscription
    });
    
  } catch (error) {
    console.error('Cancel Subscription Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
