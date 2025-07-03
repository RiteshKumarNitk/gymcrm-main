const { WorkoutLog } = require('../models/workout');
const User = require('../models/user');

class AIRecommendationService {
  // Analyze member's workout patterns and suggest improvements
  static async generateWorkoutRecommendations(userId) {
    try {
      const user = await User.findById(userId).populate('memberInfo.membershipId');
      const workoutLogs = await WorkoutLog.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(30)
        .populate('workout');

      const recommendations = {
        workoutFrequency: this.analyzeWorkoutFrequency(workoutLogs),
        muscleGroupBalance: this.analyzeMuscleGroupBalance(workoutLogs),
        progressSuggestions: this.analyzeProgress(workoutLogs),
        personalizedWorkouts: await this.generatePersonalizedWorkouts(user, workoutLogs),
        restDayRecommendations: this.calculateOptimalRestDays(workoutLogs),
        injuryPreventionTips: this.generateInjuryPreventionTips(user, workoutLogs)
      };

      return recommendations;
    } catch (error) {
      throw new Error(`AI Recommendation Error: ${error.message}`);
    }
  }

  static analyzeWorkoutFrequency(workoutLogs) {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentWorkouts = workoutLogs.filter(log => log.createdAt >= lastWeek);
    
    const frequency = recentWorkouts.length;
    let recommendation = '';
    
    if (frequency < 2) {
      recommendation = 'Try to increase workout frequency to at least 2-3 times per week for better results.';
    } else if (frequency > 6) {
      recommendation = 'Consider taking more rest days to prevent overtraining and injury.';
    } else {
      recommendation = 'Great workout frequency! You\'re maintaining a good balance.';
    }

    return {
      currentFrequency: frequency,
      optimalRange: '3-5 times per week',
      recommendation
    };
  }

  static analyzeMuscleGroupBalance(workoutLogs) {
    const muscleGroupCount = {};
    
    workoutLogs.forEach(log => {
      log.exercises.forEach(exercise => {
        // Assuming we have muscle group data in exercise
        const muscleGroups = exercise.exercise?.muscleGroups || [];
        muscleGroups.forEach(group => {
          muscleGroupCount[group] = (muscleGroupCount[group] || 0) + 1;
        });
      });
    });

    const totalExercises = Object.values(muscleGroupCount).reduce((a, b) => a + b, 0);
    const balanceScore = this.calculateBalanceScore(muscleGroupCount);
    
    return {
      muscleGroupDistribution: muscleGroupCount,
      balanceScore,
      recommendations: this.generateBalanceRecommendations(muscleGroupCount)
    };
  }

  static calculateBalanceScore(muscleGroupCount) {
    const values = Object.values(muscleGroupCount);
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    
    // Lower variance means better balance (score out of 100)
    return Math.max(0, 100 - (variance / mean) * 20);
  }

  static generateBalanceRecommendations(muscleGroupCount) {
    const recommendations = [];
    const total = Object.values(muscleGroupCount).reduce((a, b) => a + b, 0);
    
    Object.entries(muscleGroupCount).forEach(([group, count]) => {
      const percentage = (count / total) * 100;
      if (percentage < 10) {
        recommendations.push(`Consider adding more ${group} exercises to your routine.`);
      } else if (percentage > 30) {
        recommendations.push(`You might be overworking ${group}. Consider balancing with other muscle groups.`);
      }
    });

    return recommendations;
  }

  static async generatePersonalizedWorkouts(user, workoutLogs) {
    const fitnessLevel = user.memberInfo?.fitnessLevel || 'beginner';
    const goals = user.memberInfo?.fitnessGoals || [];
    
    // AI logic to create personalized workouts based on:
    // - User's fitness level
    // - Goals
    // - Past workout performance
    // - Available time
    // - Equipment preferences
    
    const workoutTemplates = {
      beginner: {
        duration: 30,
        exercises: ['bodyweight squats', 'push-ups', 'planks', 'walking'],
        frequency: 3
      },
      intermediate: {
        duration: 45,
        exercises: ['weighted squats', 'bench press', 'deadlifts', 'rowing'],
        frequency: 4
      },
      advanced: {
        duration: 60,
        exercises: ['olympic lifts', 'advanced bodyweight', 'plyometrics'],
        frequency: 5
      }
    };

    return workoutTemplates[fitnessLevel] || workoutTemplates.beginner;
  }

  static calculateOptimalRestDays(workoutLogs) {
    // Analyze workout intensity and suggest optimal rest periods
    const intensityLevels = workoutLogs.map(log => {
      // Calculate intensity based on duration, exercises completed, etc.
      return log.totalDuration && log.exercises.length > 0 ? 
        (log.totalDuration * log.exercises.length) / 100 : 0;
    });

    const avgIntensity = intensityLevels.reduce((a, b) => a + b, 0) / intensityLevels.length;
    
    let restDayRecommendation = 1;
    if (avgIntensity > 80) restDayRecommendation = 2;
    if (avgIntensity > 120) restDayRecommendation = 3;

    return {
      recommendedRestDays: restDayRecommendation,
      reason: `Based on your workout intensity (${Math.round(avgIntensity)}), you should take ${restDayRecommendation} rest day(s) between intense sessions.`
    };
  }

  static generateInjuryPreventionTips(user, workoutLogs) {
    const tips = [];
    
    // Check for potential overuse patterns
    const recentWorkouts = workoutLogs.slice(0, 7);
    const exerciseFrequency = {};
    
    recentWorkouts.forEach(log => {
      log.exercises.forEach(exercise => {
        const exerciseName = exercise.exercise?.name || 'unknown';
        exerciseFrequency[exerciseName] = (exerciseFrequency[exerciseName] || 0) + 1;
      });
    });

    Object.entries(exerciseFrequency).forEach(([exercise, frequency]) => {
      if (frequency > 5) {
        tips.push(`Consider varying your routine - you've done ${exercise} ${frequency} times this week.`);
      }
    });

    // Age-based recommendations
    const age = user.profile?.dateOfBirth ? 
      Math.floor((Date.now() - user.profile.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000)) : null;
    
    if (age && age > 40) {
      tips.push('Include more mobility and flexibility work in your routine.');
      tips.push('Consider longer warm-up periods before intense exercises.');
    }

    return tips;
  }

  // Predict optimal workout times based on past performance
  static async predictOptimalWorkoutTimes(userId) {
    const workoutLogs = await WorkoutLog.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const timePerformanceMap = {};
    
    workoutLogs.forEach(log => {
      const hour = new Date(log.startTime).getHours();
      const performance = this.calculateWorkoutPerformance(log);
      
      if (!timePerformanceMap[hour]) {
        timePerformanceMap[hour] = [];
      }
      timePerformanceMap[hour].push(performance);
    });

    const averagePerformanceByHour = {};
    Object.entries(timePerformanceMap).forEach(([hour, performances]) => {
      averagePerformanceByHour[hour] = performances.reduce((a, b) => a + b, 0) / performances.length;
    });

    const optimalHours = Object.entries(averagePerformanceByHour)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    return {
      optimalWorkoutHours: optimalHours,
      performanceData: averagePerformanceByHour,
      recommendation: `Your best performance times are around ${optimalHours.join(', ')} o'clock.`
    };
  }

  static calculateWorkoutPerformance(workoutLog) {
    // Simple performance calculation based on:
    // - Completion rate
    // - Duration vs planned duration
    // - User rating
    
    const completionRate = workoutLog.exercises.filter(ex => ex.completed).length / workoutLog.exercises.length;
    const rating = workoutLog.rating || 3;
    const durationScore = workoutLog.totalDuration > 0 ? Math.min(workoutLog.totalDuration / 60, 1) : 0.5;
    
    return (completionRate * 0.4 + (rating / 5) * 0.4 + durationScore * 0.2) * 100;
  }
}

module.exports = AIRecommendationService;
