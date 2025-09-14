const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, number, array, etc.
    required: true
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number, // in seconds
    min: [0, 'Time spent cannot be negative']
  }
}, { _id: false });

const drillSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  drillType: {
    type: String,
    enum: ['fire', 'earthquake', 'flood', 'general_emergency', 'evacuation', 'storm', 'lockdown'],
    required: [true, 'Drill type is required']
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100'],
    default: null
  },
  status: {
    type: String,
    enum: ['completed', 'in_progress', 'failed', 'skipped', 'abandoned'],
    required: [true, 'Status is required'],
    default: 'in_progress'
  },
  duration: {
    type: Number, // in seconds
    min: [0, 'Duration cannot be negative'],
    default: null
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  responses: {
    type: [responseSchema],
    default: []
  },
  correctAnswers: {
    type: Number,
    min: [0, 'Correct answers cannot be negative'],
    default: 0
  },
  totalQuestions: {
    type: Number,
    min: [0, 'Total questions cannot be negative'],
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  environmentConditions: {
    weather: {
      type: String,
      trim: true,
      maxlength: [50, 'Weather description cannot exceed 50 characters']
    },
    time: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      default: null
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    }
  },
  supervisorNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Supervisor notes cannot exceed 1000 characters']
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'drills'
});

// Indexes for performance
drillSchema.index({ studentId: 1, completedAt: -1 });
drillSchema.index({ drillType: 1 });
drillSchema.index({ status: 1 });
drillSchema.index({ completedAt: -1 });
drillSchema.index({ score: -1 });
drillSchema.index({ isArchived: 1 });

// Compound index for analytics
drillSchema.index({ drillType: 1, status: 1, completedAt: -1 });

// Pre-save middleware
drillSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  
  // Auto-set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Calculate duration if both startedAt and completedAt are available
  if (this.startedAt && this.completedAt && !this.duration) {
    this.duration = Math.round((this.completedAt - this.startedAt) / 1000);
  }
  
  // Update correct answers count based on responses
  if (this.responses && this.responses.length > 0) {
    this.correctAnswers = this.responses.filter(response => response.isCorrect).length;
    this.totalQuestions = this.responses.length;
    
    // Calculate score if not manually set
    if (this.score === null && this.totalQuestions > 0) {
      this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100);
    }
  }
  
  next();
});

// Virtual for accuracy percentage
drillSchema.virtual('accuracy').get(function() {
  if (this.totalQuestions === 0) return null;
  return Math.round((this.correctAnswers / this.totalQuestions) * 10000) / 100;
});

// Virtual for drill performance rating
drillSchema.virtual('performanceRating').get(function() {
  if (this.score === null) return 'Not Rated';
  if (this.score >= 90) return 'Excellent';
  if (this.score >= 80) return 'Good';
  if (this.score >= 70) return 'Satisfactory';
  if (this.score >= 60) return 'Needs Improvement';
  return 'Poor';
});

// Instance method to mark drill as completed
drillSchema.methods.markCompleted = function(finalScore = null) {
  this.status = 'completed';
  this.completedAt = new Date();
  
  if (finalScore !== null) {
    this.score = finalScore;
  }
  
  return this.save();
};

// Instance method to add response
drillSchema.methods.addResponse = function(questionData, answer, correctAnswer, timeSpent = 0) {
  const isCorrect = this.checkAnswer(answer, correctAnswer);
  
  this.responses.push({
    questionId: questionData.id || new Date().getTime().toString(),
    question: questionData.question,
    answer: answer,
    correctAnswer: correctAnswer,
    isCorrect: isCorrect,
    timeSpent: timeSpent
  });
  
  return this.save();
};

// Instance method to check if answer is correct
drillSchema.methods.checkAnswer = function(answer, correctAnswer) {
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some(correct => 
      String(answer).toLowerCase() === String(correct).toLowerCase()
    );
  }
  return String(answer).toLowerCase() === String(correctAnswer).toLowerCase();
};

// Static method to get drill statistics by type
drillSchema.statics.getStatsByType = function(drillType, dateRange = {}) {
  const matchQuery = { 
    drillType,
    status: 'completed',
    isArchived: false 
  };
  
  if (dateRange.startDate) {
    matchQuery.completedAt = { $gte: new Date(dateRange.startDate) };
  }
  if (dateRange.endDate) {
    matchQuery.completedAt = { ...matchQuery.completedAt, $lte: new Date(dateRange.endDate) };
  }
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalDrills: { $sum: 1 },
        averageScore: { $avg: '$score' },
        maxScore: { $max: '$score' },
        minScore: { $min: '$score' },
        averageDuration: { $avg: '$duration' }
      }
    }
  ]);
};

// Static method to get student progress
drillSchema.statics.getStudentProgress = function(studentId, limit = 10) {
  return this.find({ 
    studentId,
    status: 'completed',
    isArchived: false 
  })
  .sort({ completedAt: -1 })
  .limit(limit)
  .populate('studentId', 'name class rollNo');
};

// Transform output to include virtual fields
drillSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Drill', drillSchema);