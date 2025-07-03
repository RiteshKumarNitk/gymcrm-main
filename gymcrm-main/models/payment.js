const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Payment details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  
  type: {
    type: String,
    enum: ['membership', 'class_booking', 'personal_training', 'equipment_rental', 'product_sale', 'subscription', 'late_fee', 'other'],
    required: true
  },
  
  // Related entities
  membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership' },
  classBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassBooking' },
  equipmentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentBooking' },
  
  // Payment method
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'check', 'other'],
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  
  // Stripe/Payment Gateway Integration
  stripePaymentIntentId: String,
  stripeChargeId: String,
  gatewayTransactionId: String,
  gatewayResponse: mongoose.Schema.Types.Mixed,
  
  // Transaction details
  description: String,
  invoiceNumber: String,
  receiptUrl: String,
  
  // Dates
  paymentDate: { type: Date, default: Date.now },
  dueDate: Date,
  
  // Refund information
  refundAmount: Number,
  refundDate: Date,
  refundReason: String,
  refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Processed by
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Additional fees
  taxes: Number,
  fees: Number,
  discount: Number,
  discountCode: String,
  
  notes: String
}, { timestamps: true });

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  
  // Pricing
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: true
  },
  
  // Trial
  trialDays: { type: Number, default: 14 },
  
  // Limits
  maxMembers: { type: Number, required: true },
  maxTrainers: { type: Number, required: true },
  maxLocations: { type: Number, default: 1 },
  
  // Features
  features: [{
    name: { type: String, required: true },
    description: String,
    enabled: { type: Boolean, default: true }
  }],
  
  // Stripe integration
  stripePriceId: String,
  stripeProductId: String,
  
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  
  // Display order
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  invoiceNumber: { type: String, required: true, unique: true },
  
  // Invoice details
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  
  // Line items
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    type: {
      type: String,
      enum: ['membership', 'class', 'personal_training', 'equipment', 'product', 'fee', 'other']
    },
    relatedEntity: {
      entityType: String, // 'Membership', 'ClassBooking', etc.
      entityId: mongoose.Schema.Types.ObjectId
    }
  }],
  
  // Totals
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  
  // Payment
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, required: true },
  
  // Communication
  sentAt: Date,
  viewedAt: Date,
  
  // PDF generation
  pdfUrl: String,
  
  notes: String,
  internalNotes: String
}, { timestamps: true });

const membershipPlanSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  name: { type: String, required: true },
  description: String,
  
  // Pricing
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  
  // Duration
  duration: { type: Number, required: true }, // in days
  durationType: {
    type: String,
    enum: ['days', 'weeks', 'months', 'years'],
    default: 'months'
  },
  
  // Access permissions
  accessHours: {
    type: String,
    enum: ['24/7', 'business_hours', 'peak_hours', 'off_peak_hours'],
    default: 'business_hours'
  },
  
  // Included services
  includedClasses: { type: Number, default: 0 }, // 0 = unlimited, -1 = none
  includedPersonalTraining: { type: Number, default: 0 },
  guestPasses: { type: Number, default: 0 },
  
  // Features
  features: [String],
  restrictions: [String],
  
  // Contract terms
  contractLength: Number, // in months
  cancellationPolicy: String,
  freezePolicy: String,
  
  // Fees
  enrollmentFee: { type: Number, default: 0 },
  cancellationFee: { type: Number, default: 0 },
  
  // Auto-renewal
  autoRenew: { type: Boolean, default: true },
  
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  
  // Display
  color: String,
  imageUrl: String,
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes
paymentSchema.index({ businessId: 1, paymentDate: -1 });
paymentSchema.index({ userId: 1, paymentDate: -1 });
paymentSchema.index({ status: 1, dueDate: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ invoiceNumber: 1 });

subscriptionPlanSchema.index({ isActive: 1, sortOrder: 1 });

invoiceSchema.index({ businessId: 1, issueDate: -1 });
invoiceSchema.index({ userId: 1, issueDate: -1 });
invoiceSchema.index({ status: 1, dueDate: 1 });
invoiceSchema.index({ invoiceNumber: 1 });

membershipPlanSchema.index({ businessId: 1, isActive: 1 });
membershipPlanSchema.index({ businessId: 1, sortOrder: 1 });

// Pre-save hook for invoice number generation
invoiceSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const Business = mongoose.model('Business');
    const business = await Business.findById(this.businessId);
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last invoice for this business this month
    const lastInvoice = await mongoose.model('Invoice')
      .findOne({ 
        businessId: this.businessId,
        invoiceNumber: new RegExp(`^INV-${year}${month}-`)
      })
      .sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.invoiceNumber = `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
  
  // Calculate remaining amount
  this.remainingAmount = this.totalAmount - this.paidAmount;
  
  next();
});

module.exports = {
  Payment: mongoose.model('Payment', paymentSchema),
  SubscriptionPlan: mongoose.model('SubscriptionPlan', subscriptionPlanSchema),
  Invoice: mongoose.model('Invoice', invoiceSchema),
  MembershipPlan: mongoose.model('MembershipPlan', membershipPlanSchema)
};
