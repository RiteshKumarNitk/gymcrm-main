const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  category: {
    type: String,
    enum: ['cardio', 'strength', 'free_weights', 'functional', 'recovery', 'accessories', 'other'],
    required: true
  },
  
  type: {
    type: String,
    enum: ['machine', 'free_weight', 'accessory', 'tech'],
    required: true
  },
  
  // Equipment details
  brand: String,
  model: String,
  serialNumber: String,
  purchaseDate: Date,
  purchasePrice: Number,
  supplier: String,
  warrantyExpiry: Date,
  
  // Location and availability
  location: String, // gym area/room
  isAvailable: { type: Boolean, default: true },
  isBookable: { type: Boolean, default: false }, // can be reserved by members
  maxBookingDuration: Number, // in minutes
  
  // Maintenance
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,
  maintenanceFrequency: Number, // in days
  maintenanceNotes: String,
  
  // Usage tracking
  totalUsageHours: { type: Number, default: 0 },
  monthlyUsage: [{ // track monthly usage
    month: Date,
    hours: Number,
    sessions: Number
  }],
  
  // Condition and status
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'out_of_order'],
    default: 'excellent'
  },
  
  status: {
    type: String,
    enum: ['active', 'maintenance', 'repair', 'retired'],
    default: 'active'
  },
  
  // Additional info
  capacity: Number, // max weight, people, etc.
  imageUrl: String,
  manualUrl: String,
  instructions: String,
  safetyNotes: [String],
  
  // QR code for easy access
  qrCode: String,
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const equipmentBookingSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: Number, // in minutes
  
  status: {
    type: String,
    enum: ['booked', 'in_use', 'completed', 'cancelled', 'no_show'],
    default: 'booked'
  },
  
  actualStartTime: Date,
  actualEndTime: Date,
  
  notes: String,
  purpose: String, // workout type, rehabilitation, etc.
  
  // Check-in/out
  checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Feedback
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  issuesReported: [String]
}, { timestamps: true });

const maintenanceLogSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  type: {
    type: String,
    enum: ['routine', 'repair', 'inspection', 'upgrade', 'calibration'],
    required: true
  },
  
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  performedDate: { type: Date, default: Date.now },
  
  description: String,
  workPerformed: [String],
  partsReplaced: [String],
  cost: Number,
  vendor: String,
  
  // Before and after condition
  conditionBefore: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'out_of_order']
  },
  conditionAfter: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'out_of_order']
  },
  
  nextMaintenanceDate: Date,
  warrantyInfo: String,
  
  attachments: [String], // URLs to photos, documents
  
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, { timestamps: true });

const equipmentUsageSchema = new mongoose.Schema({
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  startTime: { type: Date, required: true },
  endTime: Date,
  duration: Number, // in minutes
  
  workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSession' },
  
  // Usage metrics
  exerciseType: String,
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very_high']
  },
  
  // For cardio equipment
  caloriesBurned: Number,
  distance: Number,
  avgHeartRate: Number,
  maxHeartRate: Number,
  
  // For strength equipment
  weight: Number,
  reps: Number,
  sets: Number,
  
  notes: String,
  
  // Automatic tracking (if equipment supports it)
  autoTracked: { type: Boolean, default: false },
  rawData: mongoose.Schema.Types.Mixed
}, { timestamps: true });

// Indexes
equipmentSchema.index({ businessId: 1, category: 1 });
equipmentSchema.index({ businessId: 1, status: 1 });
equipmentSchema.index({ nextMaintenanceDate: 1 });
equipmentSchema.index({ name: 'text', description: 'text' });

equipmentBookingSchema.index({ equipment: 1, startTime: 1 });
equipmentBookingSchema.index({ member: 1, createdAt: -1 });
equipmentBookingSchema.index({ businessId: 1, startTime: 1 });

maintenanceLogSchema.index({ equipment: 1, performedDate: -1 });
maintenanceLogSchema.index({ businessId: 1, performedDate: -1 });
maintenanceLogSchema.index({ nextMaintenanceDate: 1 });

equipmentUsageSchema.index({ equipment: 1, startTime: -1 });
equipmentUsageSchema.index({ user: 1, startTime: -1 });
equipmentUsageSchema.index({ businessId: 1, startTime: -1 });

// Virtual for calculating utilization rate
equipmentSchema.virtual('utilizationRate').get(function() {
  const currentMonth = new Date();
  const monthData = this.monthlyUsage.find(m => 
    m.month.getMonth() === currentMonth.getMonth() && 
    m.month.getFullYear() === currentMonth.getFullYear()
  );
  
  if (!monthData) return 0;
  
  // Assuming 12 hours operational per day, 30 days per month
  const maxAvailableHours = 12 * 30;
  return (monthData.hours / maxAvailableHours) * 100;
});

module.exports = {
  Equipment: mongoose.model('Equipment', equipmentSchema),
  EquipmentBooking: mongoose.model('EquipmentBooking', equipmentBookingSchema),
  MaintenanceLog: mongoose.model('MaintenanceLog', maintenanceLogSchema),
  EquipmentUsage: mongoose.model('EquipmentUsage', equipmentUsageSchema)
};
