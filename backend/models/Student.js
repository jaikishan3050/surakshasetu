const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
  },
  relationship: {
    type: String,
    trim: true,
    maxlength: [50, 'Relationship cannot exceed 50 characters'],
    default: 'Parent/Guardian'
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
      },
      message: 'Invalid phone number format'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true,
    maxlength: [20, 'Class cannot exceed 20 characters']
  },
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true,
    maxlength: [20, 'Roll number cannot exceed 20 characters']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v < new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
    lowercase: true
  },
  emergencyContact: {
    type: emergencyContactSchema,
    default: {}
  },
  medicalInfo: {
    allergies: [{
      type: String,
      trim: true,
      maxlength: [100, 'Allergy description cannot exceed 100 characters']
    }],
    medications: [{
      type: String,
      trim: true,
      maxlength: [100, 'Medication description cannot exceed 100 characters']
    }],
    conditions: [{
      type: String,
      trim: true,
      maxlength: [100, 'Medical condition cannot exceed 100 characters']
    }],
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Medical notes cannot exceed 500 characters']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  lastDrillDate: {
    type: Date,
    default: null
  },
  totalDrills: {
    type: Number,
    default: 0,
    min: [0, 'Total drills cannot be negative']
  },
  averageScore: {
    type: Number,
    default: null,
    min: [0, 'Average score cannot be negative'],
    max: [100, 'Average score cannot exceed 100']
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
  collection: 'students'
});

// Compound index for unique roll number per class
studentSchema.index({ class: 1, rollNo: 1 }, { unique: true });

// Other indexes for performance
studentSchema.index({ name: 1 });
studentSchema.index({ class: 1 });
studentSchema.index({ isActive: 1 });
studentSchema.index({ enrollmentDate: -1 });

// Pre-save middleware to update updatedAt
studentSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Virtual for full name with class and roll number
studentSchema.virtual('displayName').get(function() {
  return `${this.name} (${this.class} - ${this.rollNo})`;
});

// Instance method to get age
studentSchema.methods.getAge = function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Instance method to update drill statistics
studentSchema.methods.updateDrillStats = function(newScore) {
  this.totalDrills += 1;
  this.lastDrillDate = new Date();
  
  if (newScore !== null && newScore !== undefined) {
    if (this.averageScore === null) {
      this.averageScore = newScore;
    } else {
      // Calculate new average
      const totalScore = (this.averageScore * (this.totalDrills - 1)) + newScore;
      this.averageScore = Math.round((totalScore / this.totalDrills) * 100) / 100;
    }
  }
  
  return this.save();
};

// Static method to find students by class
studentSchema.statics.findByClass = function(className) {
  return this.find({ class: className, isActive: true }).sort({ rollNo: 1 });
};

// Static method to search students
studentSchema.statics.searchStudents = function(query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { rollNo: { $regex: query, $options: 'i' } },
      { class: { $regex: query, $options: 'i' } }
    ],
    isActive: true
  }).sort({ class: 1, rollNo: 1 });
};

// Transform output to include virtual fields
studentSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Student', studentSchema);