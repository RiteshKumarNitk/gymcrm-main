const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: false },
  uid: { type: String, unique: false }, // Firebase UID
  phone: { type: String },
  email: { type: String },
  name: { type: String },
  photoUrl: { type: String },
  role: {
    type: String,
    enum: ["superadmin", "gymadmin", "trainer", "member"],
    default: "member",
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: false,
  },
  // Enhanced profile fields
  profile: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    },
    medicalInfo: {
      conditions: [String],
      allergies: [String],
      medications: [String]
    }
  },
  // Trainer specific fields
  trainerInfo: {
    specializations: [String], // yoga, weightlifting, cardio, etc.
    certifications: [{
      name: String,
      issuedBy: String,
      issuedDate: Date,
      expiryDate: Date,
      certificateUrl: String
    }],
    experience: Number, // years
    hourlyRate: Number,
    availability: {
      monday: [{ start: String, end: String }],
      tuesday: [{ start: String, end: String }],
      wednesday: [{ start: String, end: String }],
      thursday: [{ start: String, end: String }],
      friday: [{ start: String, end: String }],
      saturday: [{ start: String, end: String }],
      sunday: [{ start: String, end: String }]
    },
    bio: String,
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 }
  },
  // Member specific fields
  memberInfo: {
    joinDate: { type: Date, default: Date.now },
    membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership' },
    fitnessGoals: [String],
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    preferredTrainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    measurements: [{
      date: { type: Date, default: Date.now },
      weight: Number,
      height: Number,
      bodyFat: Number,
      muscle: Number,
      notes: String
    }]
  },
  // Activity tracking
  lastLogin: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  
  // Notification preferences
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ uid: 1 });
userSchema.index({ businessId: 1, role: 1 });
userSchema.index({ 'memberInfo.membershipId': 1 });

module.exports = mongoose.model("User", userSchema);
