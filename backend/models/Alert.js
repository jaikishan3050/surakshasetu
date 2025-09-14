const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['earthquake', 'flood', 'fire', 'storm', 'tsunami', 'landslide', 'general', 'cyclone', 'drought'],
    required: [true, 'Alert type is required']
  },
  title: {
    type: String,
    required: [true, 'Alert title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Alert message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true,
    maxlength: [100, 'Region cannot exceed 100 characters']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: [true, 'Severity level is required'],
    default: 'medium'
  },
  active: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Expiration date must be in the future'
    }
  },
  actionRequired: {
    type: String,
    trim: true,
    maxlength: [500, 'Action required cannot exceed 500 characters']
  },
  contactInfo: {
    emergencyNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: 'Invalid emergency number format'
      }
    },
    helplineNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: 'Invalid helpline number format'
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
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Invalid website URL'
      }
    }
  },
  source: {
    organization: {
      type: String,
      trim: true,
      maxlength: [100, 'Organization name cannot exceed 100 characters'],
      default: 'SurakshaSetu Admin'
    },
    authorityLevel: {
      type: String,
      enum: ['local', 'regional', 'state', 'national', 'international'],
      default: 'local'
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'unverified'],
      default: 'verified'
    }
  },
  affectedAreas: [{
    type: String,
    trim: true,
    maxlength: [100, 'Affected area name cannot exceed 100 characters']
  }],
  coordinates: {
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    },
    radius: {
      type: Number,
      min: [0, 'Radius cannot be negative'],
      default: null // in kilometers
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  priority: {
    type: Number,
    min: [1, 'Priority must be at least 1'],
    max: [10, 'Priority cannot exceed 10'],
    default: 5
  },
  acknowledgedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acknowledgedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Acknowledgment notes cannot exceed 200 characters']
    }
  }],
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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
  collection: 'alerts'
});

// Indexes for performance
alertSchema.index({ type: 1, active: 1 });
alertSchema.index({ region: 1, active: 1 });
alertSchema.index({ severity: -1, createdAt: -1 });
alertSchema.index({ active: 1, expiresAt: 1 });
alertSchema.index({ isArchived: 1 });
alertSchema.index({ priority: -1 });

// Compound indexes for common queries
alertSchema.index({ active: 1, severity: -1, region: 1 });
alertSchema.index({ type: 1, severity: -1, createdAt: -1 });

// Geospatial index for location-based queries
alertSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Pre-save middleware
alertSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  
  // Auto-deactivate if expired
  if (this.expiresAt && this.expiresAt <= new Date()) {
    this.active = false;
  }
  
  next();
});

// Virtual for checking if alert is expired
alertSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt <= new Date();
});

// Virtual for time remaining until expiration
alertSchema.virtual('timeToExpiry').get(function() {
  if (!this.expiresAt) return null;
  const now = new Date();
  const expiry = new Date(this.expiresAt);
  const diff = expiry - now;
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
});

// Virtual for severity color (for UI)
alertSchema.virtual('severityColor').get(function() {
  const colors = {
    low: '#10B981',      // Green
    medium: '#F59E0B',   // Yellow
    high: '#EF4444',     // Red
    critical: '#7C2D12'  // Dark Red
  };
  return colors[this.severity] || colors.medium;
});

// Instance method to extend expiration
alertSchema.methods.extendExpiration = function(hours = 24) {
  const newExpiry = new Date();
  newExpiry.setHours(newExpiry.getHours() + hours);
  this.expiresAt = newExpiry;
  this.active = true;
  return this.save();
};

// Instance method to deactivate alert
alertSchema.methods.deactivate = function(reason = null) {
  this.active = false;
  if (reason) {
    this.tags = this.tags || [];
    this.tags.push(`deactivated:${reason}`);
  }
  return this.save();
};

// Instance method to acknowledge alert
alertSchema.methods.acknowledge = function(userId, notes = '') {
  this.acknowledgedBy = this.acknowledgedBy || [];
  
  // Check if already acknowledged by this user
  const existingAck = this.acknowledgedBy.find(ack => 
    ack.userId && ack.userId.toString() === userId.toString()
  );
  
  if (!existingAck) {
    this.acknowledgedBy.push({
      userId,
      acknowledgedAt: new Date(),
      notes
    });
  }
  
  return this.save();
};

// Static method to get active alerts for region
alertSchema.statics.getActiveAlertsForRegion = function(region, limit = 10) {
  return this.find({
    active: true,
    expiresAt: { $gt: new Date() },
    $or: [
      { region: { $regex: region, $options: 'i' } },
      { affectedAreas: { $in: [new RegExp(region, 'i')] } }
    ],
    isArchived: false
  })
  .sort({ severity: -1, priority: -1, createdAt: -1 })
  .limit(limit);
};

// Static method to get alerts by coordinates
alertSchema.statics.getAlertsByLocation = function(latitude, longitude, radiusKm = 50) {
  return this.find({
    active: true,
    expiresAt: { $gt: new Date() },
    'coordinates.latitude': {
      $gte: latitude - (radiusKm / 111), // Rough conversion: 1 degree ≈ 111 km
      $lte: latitude + (radiusKm / 111)
    },
    'coordinates.longitude': {
      $gte: longitude - (radiusKm / (111 * Math.cos(latitude * Math.PI / 180))),
      $lte: longitude + (radiusKm / (111 * Math.cos(latitude * Math.PI / 180)))
    },
    isArchived: false
  })
  .sort({ severity: -1, priority: -1 });
};

// Static method to auto-expire old alerts
alertSchema.statics.expireOldAlerts = function() {
  return this.updateMany(
    {
      active: true,
      expiresAt: { $lte: new Date() }
    },
    {
      $set: { active: false, updatedAt: new Date() }
    }
  );
};

// Transform output to include virtual fields
alertSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Alert', alertSchema);