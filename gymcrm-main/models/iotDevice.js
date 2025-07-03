const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'heart_rate_monitor', 'fitness_tracker', 'smart_scale', 'blood_pressure_monitor',
      'smart_equipment', 'environmental_sensor', 'access_control', 'camera', 'other'
    ],
    required: true
  },
  
  // Device details
  brand: String,
  model: String,
  firmwareVersion: String,
  serialNumber: String,
  
  // Connection info
  connectionType: {
    type: String,
    enum: ['bluetooth', 'wifi', 'cellular', 'zigbee', 'lora', 'ethernet'],
    required: true
  },
  
  // Location and assignment
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  location: String, // specific area in gym
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for personal devices
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }, // if attached to equipment
  
  // Device status
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance', 'error', 'unknown'],
    default: 'unknown'
  },
  
  lastSeen: Date,
  batteryLevel: Number, // percentage
  signalStrength: Number, // percentage or dBm
  
  // Configuration
  settings: {
    samplingRate: Number, // Hz or samples per minute
    sensitivity: Number,
    threshold: Number,
    autoSync: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true }
  },
  
  // Capabilities
  capabilities: [{
    name: String, // heart_rate, steps, weight, temperature, etc.
    unit: String, // bpm, steps, kg, celsius, etc.
    accuracy: String, // high, medium, low
    range: {
      min: Number,
      max: Number
    }
  }],
  
  // API/SDK info
  apiEndpoint: String,
  apiKey: String,
  webhookUrl: String,
  
  isActive: { type: Boolean, default: true },
  isCalibrated: { type: Boolean, default: false },
  lastCalibration: Date
}, { timestamps: true });

const deviceDataSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // null for environmental sensors
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  timestamp: { type: Date, required: true },
  
  // Data payload
  dataType: { type: String, required: true }, // heart_rate, steps, weight, etc.
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  
  // Additional context
  activity: String, // workout, rest, sleep, etc.
  location: String,
  confidence: Number, // data quality score 0-100
  
  // Workout context
  workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
  classSession: { type: mongoose.Schema.Types.ObjectId, ref: 'ClassSession' },
  
  // Raw data (for debugging)
  rawData: mongoose.Schema.Types.Mixed,
  
  // Data validation
  isValidated: { type: Boolean, default: false },
  isOutlier: { type: Boolean, default: false },
  validationNotes: String
}, { timestamps: true });

const biometricDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  date: { type: Date, required: true },
  
  // Basic metrics
  weight: Number, // kg
  height: Number, // cm
  bodyFat: Number, // percentage
  muscleMass: Number, // kg
  boneDensity: Number, // g/cm²
  waterPercentage: Number,
  metabolicAge: Number,
  visceralFat: Number,
  
  // Measurements
  measurements: {
    chest: Number, // cm
    waist: Number,
    hips: Number,
    neck: Number,
    biceps: Number,
    thighs: Number,
    forearms: Number,
    calves: Number
  },
  
  // Cardiovascular
  restingHeartRate: Number, // bpm
  maxHeartRate: Number,
  bloodPressure: {
    systolic: Number, // mmHg
    diastolic: Number,
    pulse: Number
  },
  
  // Performance metrics
  vo2Max: Number, // ml/kg/min
  strengthIndex: Number,
  flexibilityScore: Number,
  enduranceScore: Number,
  balanceScore: Number,
  
  // Method of measurement
  measurementMethod: {
    type: String,
    enum: ['manual', 'smart_scale', 'dexa_scan', 'bod_pod', 'calipers', 'other'],
    default: 'manual'
  },
  
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  measuredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // trainer who took measurements
  
  notes: String,
  goals: [String], // what this measurement is tracking
  
  // Photo documentation
  photos: [String], // URLs to progress photos
  
  isValidated: { type: Boolean, default: false }
}, { timestamps: true });

const wearableIntegrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  // Wearable info
  platform: {
    type: String,
    enum: ['fitbit', 'garmin', 'apple_health', 'google_fit', 'samsung_health', 'polar', 'whoop', 'oura', 'other'],
    required: true
  },
  
  deviceName: String,
  deviceModel: String,
  
  // Authentication
  accessToken: String,
  refreshToken: String,
  tokenExpiry: Date,
  userId: String, // platform-specific user ID
  
  // Sync settings
  syncEnabled: { type: Boolean, default: true },
  lastSync: Date,
  syncFrequency: { type: Number, default: 15 }, // minutes
  
  // Data types to sync
  dataTypes: [{
    type: {
      type: String,
      enum: ['steps', 'heart_rate', 'sleep', 'calories', 'distance', 'floors', 'active_minutes', 'weight', 'body_fat']
    },
    enabled: { type: Boolean, default: true },
    lastSync: Date
  }],
  
  // Sync history
  syncHistory: [{
    timestamp: { type: Date, default: Date.now },
    dataType: String,
    recordsCount: Number,
    status: {
      type: String,
      enum: ['success', 'partial', 'failed'],
      default: 'success'
    },
    errorMessage: String
  }],
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const environmentalDataSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  
  timestamp: { type: Date, required: true },
  location: { type: String, required: true }, // specific area in gym
  
  // Environmental metrics
  temperature: Number, // celsius
  humidity: Number, // percentage
  airQuality: Number, // AQI or PPM
  noise: Number, // decibels
  lighting: Number, // lux
  occupancy: Number, // number of people
  co2Level: Number, // PPM
  
  // Comfort scores
  comfortIndex: Number, // 0-100
  recommendations: [String],
  
  // Alerts
  alerts: [{
    type: {
      type: String,
      enum: ['temperature', 'humidity', 'air_quality', 'noise', 'occupancy', 'co2']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    message: String,
    acknowledged: { type: Boolean, default: false }
  }]
}, { timestamps: true });

// Indexes
deviceSchema.index({ deviceId: 1 });
deviceSchema.index({ businessId: 1, type: 1 });
deviceSchema.index({ assignedTo: 1 });
deviceSchema.index({ status: 1, lastSeen: -1 });

deviceDataSchema.index({ device: 1, timestamp: -1 });
deviceDataSchema.index({ user: 1, dataType: 1, timestamp: -1 });
deviceDataSchema.index({ businessId: 1, timestamp: -1 });
deviceDataSchema.index({ workout: 1, exercise: 1 });

biometricDataSchema.index({ user: 1, date: -1 });
biometricDataSchema.index({ businessId: 1, date: -1 });
biometricDataSchema.index({ measurementMethod: 1 });

wearableIntegrationSchema.index({ user: 1, platform: 1 });
wearableIntegrationSchema.index({ businessId: 1 });
wearableIntegrationSchema.index({ lastSync: 1, syncEnabled: 1 });

environmentalDataSchema.index({ businessId: 1, timestamp: -1 });
environmentalDataSchema.index({ location: 1, timestamp: -1 });
environmentalDataSchema.index({ 'alerts.severity': 1, 'alerts.acknowledged': 1 });

// Virtual for device health
deviceSchema.virtual('healthScore').get(function() {
  let score = 100;
  
  // Reduce score based on last seen
  if (this.lastSeen) {
    const hoursOffline = (Date.now() - this.lastSeen) / (1000 * 60 * 60);
    if (hoursOffline > 24) score -= 50;
    else if (hoursOffline > 1) score -= 20;
  } else {
    score -= 60;
  }
  
  // Reduce score based on battery level
  if (this.batteryLevel !== undefined) {
    if (this.batteryLevel < 10) score -= 30;
    else if (this.batteryLevel < 25) score -= 15;
  }
  
  // Reduce score based on signal strength
  if (this.signalStrength !== undefined && this.signalStrength < 30) {
    score -= 10;
  }
  
  return Math.max(0, score);
});

// Pre-save hook for device data validation
deviceDataSchema.pre('save', function(next) {
  // Basic validation based on data type
  const validationRules = {
    heart_rate: { min: 30, max: 220 },
    steps: { min: 0, max: 100000 },
    weight: { min: 20, max: 300 },
    temperature: { min: 15, max: 45 },
    humidity: { min: 0, max: 100 }
  };
  
  const rule = validationRules[this.dataType];
  if (rule) {
    this.isValidated = this.value >= rule.min && this.value <= rule.max;
    this.isOutlier = this.value < rule.min || this.value > rule.max;
  }
  
  next();
});

module.exports = {
  Device: mongoose.model('Device', deviceSchema),
  DeviceData: mongoose.model('DeviceData', deviceDataSchema),
  BiometricData: mongoose.model('BiometricData', biometricDataSchema),
  WearableIntegration: mongoose.model('WearableIntegration', wearableIntegrationSchema),
  EnvironmentalData: mongoose.model('EnvironmentalData', environmentalDataSchema)
};
