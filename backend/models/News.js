const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'News description is required'],
    trim: true,
    minlength: [50, 'Description must be at least 50 characters long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  source: {
    type: String,
    required: [true, 'News source is required'],
    trim: true,
    maxlength: [100, 'Source cannot exceed 100 characters']
  },
  sourceUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid source URL format'
    }
  },
  category: {
    type: String,
    enum: [
      'earthquake', 'flood', 'fire', 'storm', 'tsunami', 'landslide', 
      'general', 'preparedness', 'recovery', 'cyclone', 'drought',
      'emergency_response', 'infrastructure', 'weather_alert'
    ],
    required: [true, 'News category is required'],
    default: 'general'
  },
  region: {
    type: String,
    trim: true,
    maxlength: [100, 'Region cannot exceed 100 characters']
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  publishedAt: {
    type: Date,
    required: [true, 'Publication date is required'],
    validate: {
      validator: function(v) {
        return v <= new Date();
      },
      message: 'Publication date cannot be in the future'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: null
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  shares: {
    type: Number,
    default: 0,
    min: [0, 'Shares cannot be negative']
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  content: {
    summary: {
      type: String,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    fullText: {
      type: String,
      trim: true,
      maxlength: [10000, 'Full text cannot exceed 10000 characters']
    },
    keyPoints: [{
      type: String,
      trim: true,
      maxlength: [200, 'Key point cannot exceed 200 characters']
    }],
    actionItems: [{
      type: String,
      trim: true,
      maxlength: [200, 'Action item cannot exceed 200 characters']
    }]
  },
  location: {
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
      }
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    }
  },
  relatedAlerts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert'
  }],
  author: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [100, 'Organization cannot exceed 100 characters']
    },
    contact: {
      type: String,
      trim: true,
      maxlength: [100, 'Contact cannot exceed 100 characters']
    }
  },
  metadata: {
    scrapedFrom: {
      type: String,
      trim: true
    },
    lastScrapedAt: {
      type: Date
    },
    externalId: {
      type: String,
      trim: true,
      index: true
    },
    priority: {
      type: Number,
      min: [1, 'Priority must be at least 1'],
      max: [10, 'Priority cannot exceed 10'],
      default: 5
    }
  },
  engagement: {
    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    ratings: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
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
  collection: 'news'
});

// Indexes for performance
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ category: 1, publishedAt: -1 });
newsSchema.index({ region: 1, publishedAt: -1 });
newsSchema.index({ isVerified: 1, isArchived: 1 });
newsSchema.index({ isFeatured: -1, publishedAt: -1 });
newsSchema.index({ views: -1 });
newsSchema.index({ tags: 1 });

// Text index for search functionality
newsSchema.index({ 
  title: 'text', 
  description: 'text', 
  'content.summary': 'text',
  tags: 'text'
});

// Compound indexes for common queries
newsSchema.index({ category: 1, isVerified: 1, publishedAt: -1 });
newsSchema.index({ region: 1, category: 1, publishedAt: -1 });

// Geospatial index for location-based queries
newsSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });

// Pre-save middleware
newsSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  
  // Auto-generate summary if not provided
  if (!this.content.summary && this.description) {
    this.content.summary = this.description.substring(0, 300) + 
      (this.description.length > 300 ? '...' : '');
  }
  
  next();
});

// Virtual for reading time estimation (words per minute: 200)
newsSchema.virtual('readingTime').get(function() {
  const content = (this.description || '') + (this.content.fullText || '');
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
});

// Virtual for age of news (how old is this news)
newsSchema.virtual('newsAge').get(function() {
  const now = new Date();
  const published = new Date(this.publishedAt);
  const diffTime = Math.abs(now - published);
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
});

// Virtual for engagement score
newsSchema.virtual('engagementScore').get(function() {
  const viewWeight = 1;
  const likeWeight = 3;
  const shareWeight = 5;
  const commentWeight = 2;
  
  const comments = this.engagement.comments ? this.engagement.comments.length : 0;
  
  return (this.views * viewWeight) + 
         (this.likes * likeWeight) + 
         (this.shares * shareWeight) + 
         (comments * commentWeight);
});

// Virtual for average rating
newsSchema.virtual('averageRating').get(function() {
  if (!this.engagement.ratings || this.engagement.ratings.length === 0) {
    return null;
  }
  
  const totalRating = this.engagement.ratings.reduce((sum, rating) => sum + rating.rating, 0);
  return Math.round((totalRating / this.engagement.ratings.length) * 10) / 10;
});

// Instance method to increment views
newsSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to add like
newsSchema.methods.addLike = function() {
  this.likes += 1;
  return this.save();
};

// Instance method to add share
newsSchema.methods.addShare = function() {
  this.shares += 1;
  return this.save();
};

// Instance method to add comment
newsSchema.methods.addComment = function(userId, comment) {
  this.engagement.comments = this.engagement.comments || [];
  this.engagement.comments.push({
    userId,
    comment,
    createdAt: new Date()
  });
  return this.save();
};

// Instance method to add rating
newsSchema.methods.addRating = function(userId, rating) {
  this.engagement.ratings = this.engagement.ratings || [];
  
  // Check if user already rated
  const existingRatingIndex = this.engagement.ratings.findIndex(r => 
    r.userId.toString() === userId.toString()
  );
  
  if (existingRatingIndex !== -1) {
    // Update existing rating
    this.engagement.ratings[existingRatingIndex].rating = rating;
  } else {
    // Add new rating
    this.engagement.ratings.push({
      userId,
      rating,
      createdAt: new Date()
    });
  }
  
  return this.save();
};

// Static method to get trending news
newsSchema.statics.getTrending = function(limit = 10, timeframe = 7) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - timeframe);
  
  return this.find({
    publishedAt: { $gte: dateThreshold },
    isVerified: true,
    isArchived: false
  })
  .sort({ views: -1, likes: -1, publishedAt: -1 })
  .limit(limit);
};

// Static method to get news by category with filters
newsSchema.statics.getByCategoryAndRegion = function(category, region, limit = 20) {
  const query = {
    isVerified: true,
    isArchived: false
  };
  
  if (category) query.category = category;
  if (region) query.region = { $regex: region, $options: 'i' };
  
  return this.find(query)
    .sort({ isFeatured: -1, publishedAt: -1 })
    .limit(limit);
};

// Static method to search news
newsSchema.statics.searchNews = function(searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm },
    isVerified: true,
    isArchived: false,
    ...filters
  };
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, publishedAt: -1 });
};

// Transform output to include virtual fields
newsSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('News', newsSchema);