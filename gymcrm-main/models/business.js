const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  businessType: {
    type: String,
    enum: ["Gym", "Fitness Studio", "Yoga Studio", "CrossFit Box", "Martial Arts", "Dance Studio"],
    required: true,
  },
  businessLocation: { type: String, required: true },
  ownerName: { type: String, required: true },
  ownerMobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  ownerEmail: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: {
    street: String,
    zipCode: String,
    landmark: String
  },
  // SAAS Subscription Management
  subscription: {
    plan: {
      type: String,
      enum: ['trial', 'basic', 'premium', 'enterprise'],
      default: 'trial'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'suspended', 'trial'],
      default: 'trial'
    },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    maxMembers: { type: Number, default: 50 }, // based on plan
    maxTrainers: { type: Number, default: 2 },
    features: [{
      name: String,
      enabled: { type: Boolean, default: true }
    }]
  },
  // Business Settings
  settings: {
    operatingHours: {
      monday: { open: String, close: String, closed: { type: Boolean, default: false } },
      tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
      thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
      friday: { open: String, close: String, closed: { type: Boolean, default: false } },
      saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
      sunday: { open: String, close: String, closed: { type: Boolean, default: true } }
    },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    logo: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String
    }
  },
  // Admin user reference
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Business metrics
  stats: {
    totalMembers: { type: Number, default: 0 },
    activeMembers: { type: Number, default: 0 },
    totalTrainers: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index for better performance
businessSchema.index({ ownerEmail: 1 });
businessSchema.index({ 'subscription.status': 1 });
businessSchema.index({ 'subscription.endDate': 1 });

module.exports = mongoose.model("Business", businessSchema);
