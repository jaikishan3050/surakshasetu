const express = require('express');
const { body, validationResult } = require('express-validator');
const Alert = require('../models/Alert');

const router = express.Router();

// @route   GET /api/alerts
// @desc    Get regional disaster alerts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type, 
      region, 
      severity, 
      active = 'true' 
    } = req.query;
    
    // Build query
    let query = {};
    if (type) {
      query.type = type;
    }
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }
    if (severity) {
      query.severity = severity;
    }
    if (active === 'true') {
      query.active = true;
      query.expiresAt = { $gt: new Date() };
    }

    // Execute query with pagination
    const alerts = await Alert.find(query)
      .sort({ severity: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Alert.countDocuments(query);

    res.json({
      success: true,
      data: alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get alerts error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/alerts/active
// @desc    Get only active alerts
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const { region } = req.query;
    
    // Build query for active alerts
    let query = {
      active: true,
      expiresAt: { $gt: new Date() }
    };
    
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }

    const alerts = await Alert.find(query)
      .sort({ severity: -1, createdAt: -1 })
      .limit(10)
      .exec();

    res.json({
      success: true,
      data: alerts,
      count: alerts.length
    });

  } catch (error) {
    console.error('Get active alerts error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/alerts/:id
// @desc    Get alert by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: alert
    });

  } catch (error) {
    console.error('Get alert error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid alert ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/alerts
// @desc    Admin creates new alert
// @access  Protected (Admin only)
router.post('/', [
  body('type').isIn(['earthquake', 'flood', 'fire', 'storm', 'tsunami', 'landslide', 'general'])
    .withMessage('Invalid alert type'),
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('region').trim().isLength({ min: 2, max: 100 }).withMessage('Region must be between 2 and 100 characters'),
  body('severity').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiration date')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      type, 
      title, 
      message, 
      region, 
      severity, 
      expiresAt, 
      actionRequired, 
      contactInfo 
    } = req.body;

    // Set default expiration to 24 hours if not provided
    const alertExpiresAt = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create new alert
    const alert = new Alert({
      type,
      title,
      message,
      region,
      severity,
      expiresAt: alertExpiresAt,
      actionRequired,
      contactInfo,
      active: true
    });

    await alert.save();

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });

  } catch (error) {
    console.error('Create alert error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/alerts/:id
// @desc    Update alert
// @access  Protected (Admin only)
router.put('/:id', [
  body('type').optional().isIn(['earthquake', 'flood', 'fire', 'storm', 'tsunami', 'landslide', 'general'])
    .withMessage('Invalid alert type'),
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('message').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('region').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Region must be between 2 and 100 characters'),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiration date'),
  body('active').optional().isBoolean().withMessage('Active must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          ...req.body,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert updated successfully',
      data: alert
    });

  } catch (error) {
    console.error('Update alert error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid alert ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete alert
// @access  Protected (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });

  } catch (error) {
    console.error('Delete alert error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid alert ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PATCH /api/alerts/:id/deactivate
// @desc    Deactivate alert
// @access  Protected (Admin only)
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          active: false,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Alert deactivated successfully',
      data: alert
    });

  } catch (error) {
    console.error('Deactivate alert error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid alert ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/alerts/stats/overview
// @desc    Get alert statistics
// @access  Protected (Admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // Total alerts
    const totalAlerts = await Alert.countDocuments(dateFilter);
    const activeAlerts = await Alert.countDocuments({
      ...dateFilter,
      active: true,
      expiresAt: { $gt: new Date() }
    });

    // Alerts by type
    const alertsByType = await Alert.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Alerts by severity
    const alertsBySeverity = await Alert.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    // Alerts by region
    const alertsByRegion = await Alert.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalAlerts,
        activeAlerts,
        alertsByType,
        alertsBySeverity,
        alertsByRegion
      }
    });

  } catch (error) {
    console.error('Get alert stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;