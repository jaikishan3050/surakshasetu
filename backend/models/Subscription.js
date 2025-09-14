const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    default: 'Anonymous',
    trim: true,
    maxlength: 100
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200
  },
  alertTypes: [{
    type: String,
    enum: ['fire', 'flood', 'earthquake', 'medical', 'security', 'weather', 'general']
  }],
  preferences: {
    emailAlerts: {
      type: Boolean,
      default: true
    },
    smsAlerts: {
      type: Boolean,
      default: false
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    frequency: {
      type: String,
      enum: ['immediate', 'hourly', 'daily'],
      default: 'immediate'
    }
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance (email index is already created by unique: true)
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ subscribedAt: -1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
