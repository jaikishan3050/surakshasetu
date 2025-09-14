const mongoose = require('mongoose');

const emergencyReportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['fire', 'flood', 'earthquake', 'medical', 'security', 'other']
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  reporterName: {
    type: String,
    default: 'Anonymous',
    trim: true,
    maxlength: 100
  },
  reporterPhone: {
    type: String,
    trim: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'investigating', 'resolved', 'false_alarm'],
    default: 'pending'
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
emergencyReportSchema.index({ reportedAt: -1 });
emergencyReportSchema.index({ status: 1 });
emergencyReportSchema.index({ type: 1 });
emergencyReportSchema.index({ severity: 1 });

module.exports = mongoose.model('EmergencyReport', emergencyReportSchema);

