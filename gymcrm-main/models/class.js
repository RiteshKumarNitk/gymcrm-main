const mongoose = require('mongoose');

const classTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  duration: { type: Number, required: true }, // in minutes
  maxCapacity: { type: Number, required: true },
  price: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
    default: 'all_levels'
  },
  equipment: [String],
  category: {
    type: String,
    enum: ['yoga', 'pilates', 'zumba', 'spinning', 'crossfit', 'hiit', 'strength', 'cardio', 'dance', 'martial_arts', 'other'],
    required: true
  },
  imageUrl: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const classSessionSchema = new mongoose.Schema({
  classType: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassType', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  
  // Capacity management
  maxCapacity: { type: Number, required: true },
  currentBookings: { type: Number, default: 0 },
  
  // Booking management
  bookings: [{
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bookedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['booked', 'attended', 'no_show', 'cancelled'],
      default: 'booked'
    },
    checkedInAt: Date,
    rating: Number,
    feedback: String
  }],
  
  waitlist: [{
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    position: Number
  }],
  
  // Session details
  room: String,
  notes: String,
  price: Number, // can override class type price
  
  // Session status
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  // Recurring session info
  isRecurring: { type: Boolean, default: false },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    interval: Number, // every X days/weeks/months
    daysOfWeek: [Number], // 0-6, Sunday = 0
    endDate: Date,
    maxOccurrences: Number
  },
  
  originalSession: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSession' }, // for recurring sessions
  
  // Analytics
  revenue: { type: Number, default: 0 },
  attendanceRate: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

const classBookingSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSession', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  bookedAt: { type: Date, default: Date.now },
  
  status: {
    type: String,
    enum: ['active', 'cancelled', 'attended', 'no_show'],
    default: 'active'
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'cancelled'],
    default: 'pending'
  },
  
  paymentMethod: {
    type: String,
    enum: ['membership', 'drop_in', 'package', 'free']
  },
  
  price: Number,
  checkedInAt: Date,
  
  // Feedback
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  
  // Cancellation
  cancelledAt: Date,
  cancellationReason: String,
  refundAmount: Number
}, { timestamps: true });

// Indexes
classTypeSchema.index({ businessId: 1, isActive: 1 });
classTypeSchema.index({ name: 'text', description: 'text' });

classSessionSchema.index({ businessId: 1, startTime: 1 });
classSessionSchema.index({ trainer: 1, startTime: 1 });
classSessionSchema.index({ classType: 1, startTime: 1 });
classSessionSchema.index({ 'bookings.member': 1 });

classBookingSchema.index({ member: 1, bookedAt: -1 });
classBookingSchema.index({ session: 1, status: 1 });
classBookingSchema.index({ businessId: 1, createdAt: -1 });

// Virtual for available spots
classSessionSchema.virtual('availableSpots').get(function() {
  return this.maxCapacity - this.currentBookings;
});

// Pre-save hook to update current bookings
classSessionSchema.pre('save', function(next) {
  if (this.bookings) {
    this.currentBookings = this.bookings.filter(booking => 
      booking.status === 'booked' || booking.status === 'attended'
    ).length;
  }
  next();
});

module.exports = {
  ClassType: mongoose.model('ClassType', classTypeSchema),
  ClassSession: mongoose.model('ClassSession', classSessionSchema),
  ClassBooking: mongoose.model('ClassBooking', classBookingSchema)
};
