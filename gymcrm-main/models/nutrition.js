const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  barcode: String,
  
  // Nutritional information per 100g
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true }, // grams
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: Number,
    sugar: Number,
    sodium: Number, // mg
    cholesterol: Number, // mg
    saturatedFat: Number,
    transFat: Number,
    vitaminA: Number, // % daily value
    vitaminC: Number,
    calcium: Number,
    iron: Number
  },
  
  // Serving information
  servingSize: { type: Number, default: 100 }, // grams
  servingUnit: { type: String, default: 'g' }, // g, ml, cup, piece, etc.
  
  category: {
    type: String,
    enum: ['protein', 'vegetables', 'fruits', 'grains', 'dairy', 'fats', 'beverages', 'snacks', 'other'],
    required: true
  },
  
  // Additional info
  allergens: [String], // nuts, dairy, gluten, etc.
  dietaryTags: [String], // vegan, vegetarian, keto, paleo, etc.
  
  // Custom foods
  isCustom: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  
  // Verification
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const mealLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  date: { type: Date, required: true },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
    required: true
  },
  
  foods: [{
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    quantity: { type: Number, required: true }, // in grams or serving units
    unit: { type: String, default: 'g' },
    
    // Calculated nutrition for this serving
    calculatedNutrition: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number,
      sugar: Number,
      sodium: Number
    }
  }],
  
  // Totals for this meal
  totalNutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
  },
  
  notes: String,
  imageUrl: String, // meal photo
  location: String, // restaurant, home, gym, etc.
  
  // Ratings and feelings
  satisfactionRating: { type: Number, min: 1, max: 5 },
  energyLevel: { type: Number, min: 1, max: 5 }, // how did you feel after eating
  hungerBefore: { type: Number, min: 1, max: 5 },
  hungerAfter: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

const mealPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // nutritionist/trainer
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // members
  
  // Plan details
  duration: { type: Number, required: true }, // days
  targetCalories: { type: Number, required: true },
  targetMacros: {
    protein: { type: Number, required: true }, // percentage
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  
  // Meal plan structure
  meals: [{
    day: { type: Number, required: true }, // 1-7 or 1-30 depending on duration
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
      required: true
    },
    foods: [{
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, default: 'g' }
    }],
    instructions: String,
    prepTime: Number, // minutes
    cookTime: Number // minutes
  }],
  
  // Plan properties
  dietaryRestrictions: [String], // vegan, keto, paleo, etc.
  allergenFree: [String], // nuts, dairy, gluten, etc.
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  // Goals this plan supports
  goals: [String], // weight_loss, muscle_gain, maintenance, etc.
  
  // Shopping list
  shoppingList: [{
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    totalQuantity: Number,
    unit: String,
    category: String,
    purchased: { type: Boolean, default: false }
  }],
  
  isTemplate: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Analytics
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  timesUsed: { type: Number, default: 0 }
}, { timestamps: true });

const nutritionGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  // Goal settings
  goalType: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'athletic_performance'],
    required: true
  },
  
  targetWeight: Number, // kg
  currentWeight: Number, // kg
  targetDate: Date,
  
  // Daily targets
  dailyCalories: { type: Number, required: true },
  dailyMacros: {
    protein: { type: Number, required: true }, // grams
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  
  // Micronutrient targets
  micronutrients: {
    fiber: Number,
    sodium: Number,
    sugar: Number,
    vitaminA: Number,
    vitaminC: Number,
    calcium: Number,
    iron: Number
  },
  
  // Activity level
  activityLevel: {
    type: String,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
    required: true
  },
  
  // Preferences
  mealsPerDay: { type: Number, default: 3 },
  dietaryRestrictions: [String],
  foodAllergies: [String],
  dislikedFoods: [String],
  preferredFoods: [String],
  
  // Progress tracking
  weeklyWeightGoal: Number, // kg per week
  progressCheckins: [{
    date: { type: Date, default: Date.now },
    weight: Number,
    bodyFat: Number,
    muscleMass: Number,
    waistCircumference: Number,
    notes: String
  }],
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const waterIntakeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  date: { type: Date, required: true },
  
  entries: [{
    time: { type: Date, default: Date.now },
    amount: { type: Number, required: true }, // ml
    source: {
      type: String,
      enum: ['water', 'sports_drink', 'tea', 'coffee', 'juice', 'other'],
      default: 'water'
    }
  }],
  
  totalIntake: { type: Number, default: 0 }, // ml
  targetIntake: { type: Number, default: 2000 }, // ml
  
  // Reminders
  reminderFrequency: { type: Number, default: 60 }, // minutes
  lastReminder: Date
}, { timestamps: true });

// Indexes
foodItemSchema.index({ name: 'text', brand: 'text' });
foodItemSchema.index({ category: 1, isActive: 1 });
foodItemSchema.index({ businessId: 1, isCustom: 1 });
foodItemSchema.index({ barcode: 1 });

mealLogSchema.index({ user: 1, date: -1 });
mealLogSchema.index({ businessId: 1, date: -1 });
mealLogSchema.index({ user: 1, mealType: 1, date: -1 });

mealPlanSchema.index({ businessId: 1, isActive: 1 });
mealPlanSchema.index({ assignedTo: 1 });
mealPlanSchema.index({ createdBy: 1 });
mealPlanSchema.index({ goals: 1, dietaryRestrictions: 1 });

nutritionGoalSchema.index({ user: 1, isActive: 1 });
nutritionGoalSchema.index({ businessId: 1 });

waterIntakeSchema.index({ user: 1, date: -1 });

// Pre-save hooks to calculate nutrition totals
mealLogSchema.pre('save', function(next) {
  // Calculate total nutrition for the meal
  this.totalNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };
  
  this.foods.forEach(food => {
    if (food.calculatedNutrition) {
      this.totalNutrition.calories += food.calculatedNutrition.calories || 0;
      this.totalNutrition.protein += food.calculatedNutrition.protein || 0;
      this.totalNutrition.carbs += food.calculatedNutrition.carbs || 0;
      this.totalNutrition.fat += food.calculatedNutrition.fat || 0;
      this.totalNutrition.fiber += food.calculatedNutrition.fiber || 0;
      this.totalNutrition.sugar += food.calculatedNutrition.sugar || 0;
      this.totalNutrition.sodium += food.calculatedNutrition.sodium || 0;
    }
  });
  
  next();
});

waterIntakeSchema.pre('save', function(next) {
  // Calculate total water intake
  this.totalIntake = this.entries.reduce((total, entry) => total + entry.amount, 0);
  next();
});

module.exports = {
  FoodItem: mongoose.model('FoodItem', foodItemSchema),
  MealLog: mongoose.model('MealLog', mealLogSchema),
  MealPlan: mongoose.model('MealPlan', mealPlanSchema),
  NutritionGoal: mongoose.model('NutritionGoal', nutritionGoalSchema),
  WaterIntake: mongoose.model('WaterIntake', waterIntakeSchema)
};
