const express = require('express');
const { body, validationResult } = require('express-validator');
const EmergencyReport = require('../models/EmergencyReport');

const router = express.Router();

// @route   POST /api/emergency-reports
// @desc    Submit emergency report
// @access  Public
router.post('/', [
  body('type').isIn(['fire', 'flood', 'earthquake', 'medical', 'security', 'other'])
    .withMessage('Invalid emergency type'),
  body('location').trim().isLength({ min: 2, max: 200 }).withMessage('Location must be between 2 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('reporterName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Reporter name must be between 2 and 100 characters'),
  body('reporterPhone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number'),
  body('severity').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid severity level')
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
      location, 
      description, 
      reporterName, 
      reporterPhone, 
      severity = 'medium',
      coordinates 
    } = req.body;

    // Create new emergency report
    const emergencyReport = new EmergencyReport({
      type,
      location,
      description,
      reporterName: reporterName || 'Anonymous',
      reporterPhone,
      severity,
      coordinates,
      status: 'pending',
      reportedAt: new Date()
    });

    await emergencyReport.save();

    res.status(201).json({
      success: true,
      message: 'Emergency report submitted successfully',
      data: {
        id: emergencyReport._id,
        type: emergencyReport.type,
        location: emergencyReport.location,
        status: emergencyReport.status,
        reportedAt: emergencyReport.reportedAt
      }
    });

  } catch (error) {
    console.error('Submit emergency report error:', error.message);
    
    // Check if it's a MongoDB connection error
    if (error.message.includes('connection') || error.message.includes('ECONNREFUSED') || error.name === 'MongooseError') {
      res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again later.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    }
  }
});

// @route   GET /api/emergency-reports
// @desc    Get emergency reports (Admin only)
// @access  Protected
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      type, 
      severity 
    } = req.query;
    
    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (severity) {
      query.severity = severity;
    }

    // Execute query with pagination
    const reports = await EmergencyReport.find(query)
      .sort({ reportedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await EmergencyReport.countDocuments(query);

    res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get emergency reports error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/emergency-reports/:id
// @desc    Update emergency report
// @access  Protected (Admin only)
router.put('/:id', [
  body('status').optional().isIn(['pending', 'verified', 'investigating', 'resolved', 'false_alarm'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status, verifiedAt, verifiedBy, adminNotes } = req.body;

    const updateData = {
      updatedAt: new Date()
    };

    if (status) updateData.status = status;
    if (verifiedAt) updateData.verifiedAt = verifiedAt;
    if (verifiedBy) updateData.verifiedBy = verifiedBy;
    if (adminNotes) updateData.adminNotes = adminNotes;

    const report = await EmergencyReport.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Emergency report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: report
    });

  } catch (error) {
    console.error('Update report status error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/emergency-reports/stats
// @desc    Get emergency report statistics
// @access  Protected (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const totalReports = await EmergencyReport.countDocuments();
    const pendingReports = await EmergencyReport.countDocuments({ status: 'pending' });
    const verifiedReports = await EmergencyReport.countDocuments({ status: 'verified' });
    const resolvedReports = await EmergencyReport.countDocuments({ status: 'resolved' });

    const reportsByType = await EmergencyReport.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const reportsBySeverity = await EmergencyReport.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalReports,
        pendingReports,
        verifiedReports,
        resolvedReports,
        reportsByType,
        reportsBySeverity
      }
    });

  } catch (error) {
    console.error('Get emergency report stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/data/emergency-reports
// @desc    Get emergency reports for admin dashboard
// @access  Protected (Admin only)
router.get('/data', async (req, res) => {
  try {
    const reports = await EmergencyReport.find({})
      .sort({ reportedAt: -1 })
      .exec();

    res.json({
      success: true,
      data: reports
    });

  } catch (error) {
    console.error('Get emergency reports data error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
