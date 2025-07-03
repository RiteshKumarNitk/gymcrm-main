const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'balance', 'sports'],
    required: true
  },
  muscleGroups: [String],
  equipment: [String],
  instructions: String,
  videoUrl: String,
  imageUrl: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  caloriesPerMinute: Number,
  isCustom: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
}, { timestamps: true });

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // members
  
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: [{
      reps: Number,
      weight: Number,
      duration: Number, // in seconds
      distance: Number, // in meters
      restTime: Number, // in seconds
      notes: String
    }],
    order: Number
  }],
  
  type: {
    type: String,
    enum: ['personal', 'group', 'template'],
    default: 'personal'
  },
  
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  duration: Number, // estimated duration in minutes
  targetMuscleGroups: [String],
  tags: [String],
  
  // For group workouts
  maxParticipants: Number,
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledAt: Date,
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const workoutLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  startTime: { type: Date, required: true },
  endTime: Date,
  
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: [{
      reps: Number,
      weight: Number,
      duration: Number,
      distance: Number,
      completed: { type: Boolean, default: false },
      notes: String
    }],
    completed: { type: Boolean, default: false }
  }],
  
  totalDuration: Number, // actual duration in minutes
  caloriesBurned: Number,
  notes: String,
  rating: { type: Number, min: 1, max: 5 },
  
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'paused', 'cancelled'],
    default: 'in_progress'
  }
}, { timestamps: true });

// Indexes
exerciseSchema.index({ businessId: 1, category: 1 });
exerciseSchema.index({ name: 'text', instructions: 'text' });

workoutSchema.index({ businessId: 1, createdBy: 1 });
workoutSchema.index({ assignedTo: 1 });
workoutSchema.index({ trainer: 1, scheduledAt: 1 });

workoutLogSchema.index({ user: 1, createdAt: -1 });
workoutLogSchema.index({ businessId: 1, createdAt: -1 });

module.exports = {
  Exercise: mongoose.model('Exercise', exerciseSchema),
  Workout: mongoose.model('Workout', workoutSchema),
  WorkoutLog: mongoose.model('WorkoutLog', workoutLogSchema)
};
