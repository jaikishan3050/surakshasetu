const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  skills: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: ['weekdays', 'weekends', 'anytime', 'emergency_only'],
    default: 'anytime'
  },
  volunteerType: {
    type: String,
    enum: ['first_aid', 'rescue', 'communication', 'logistics', 'general'],
    default: 'general'
  },
  experience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending_verification', 'verified', 'active', 'inactive', 'suspended'],
    default: 'pending_verification'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance (email index is already created by unique: true)
communityMemberSchema.index({ status: 1 });
communityMemberSchema.index({ volunteerType: 1 });
communityMemberSchema.index({ joinedAt: -1 });

module.exports = mongoose.model('CommunityMember', communityMemberSchema);

