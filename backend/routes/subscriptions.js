const express = require('express');
const { body, validationResult } = require('express-validator');
const Subscription = require('../models/Subscription');

const router = express.Router();

// @route   POST /api/subscriptions
// @desc    Subscribe to emergency alerts
// @access  Public
router.post('/', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('location').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Location must be between 2 and 200 characters'),
  body('alertTypes').optional().isArray().withMessage('Alert types must be an array'),
  body('alertTypes.*').optional().isIn(['fire', 'flood', 'earthquake', 'medical', 'security', 'weather', 'general'])
    .withMessage('Invalid alert type')
], async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again later.',
        error: 'MongoDB not connected'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      email, 
      phone, 
      name, 
      location, 
      alertTypes = ['general'],
      preferences = {}
    } = req.body;

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email });
    
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed to alerts'
      });
    }

    // Create new subscription
    const subscription = new Subscription({
      email,
      phone,
      name: name || 'Anonymous',
      location,
      alertTypes,
      preferences: {
        emailAlerts: preferences.emailAlerts !== false,
        smsAlerts: preferences.smsAlerts || false,
        pushNotifications: preferences.pushNotifications !== false,
        ...preferences
      },
      subscribedAt: new Date(),
      isActive: true
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to emergency alerts',
      data: {
        id: subscription._id,
        email: subscription.email,
        alertTypes: subscription.alertTypes,
        subscribedAt: subscription.subscribedAt
      }
    });

  } catch (error) {
    console.error('Subscribe error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/subscriptions
// @desc    Get all subscriptions (Admin only)
// @access  Protected
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      isActive, 
      location 
    } = req.query;
    
    // Build query
    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Execute query with pagination
    const subscriptions = await Subscription.find(query)
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Subscription.countDocuments(query);

    res.json({
      success: true,
      data: subscriptions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get subscriptions error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/subscriptions/:id
// @desc    Unsubscribe from alerts
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          isActive: false,
          unsubscribedAt: new Date()
        }
      },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from alerts'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/subscriptions/stats
// @desc    Get subscription statistics
// @access  Protected (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const totalSubscriptions = await Subscription.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ isActive: true });
    const subscriptionsByLocation = await Subscription.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const subscriptionsByAlertType = await Subscription.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$alertTypes' },
      {
        $group: {
          _id: '$alertTypes',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalSubscriptions,
        activeSubscriptions,
        subscriptionsByLocation,
        subscriptionsByAlertType
      }
    });

  } catch (error) {
    console.error('Get subscription stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
