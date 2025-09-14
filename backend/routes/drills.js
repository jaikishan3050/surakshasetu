const express = require('express');
const { body, validationResult } = require('express-validator');
const Drill = require('../models/Drill');
const Student = require('../models/Student');

const router = express.Router();

// @route   GET /api/drills
// @desc    Fetch drill results
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      studentId, 
      drillType, 
      status, 
      startDate, 
      endDate 
    } = req.query;
    
    // Build query
    let query = {};
    if (studentId) {
      query.studentId = studentId;
    }
    if (drillType) {
      query.drillType = drillType;
    }
    if (status) {
      query.status = status;
    }
    if (startDate || endDate) {
      query.completedAt = {};
      if (startDate) {
        query.completedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.completedAt.$lte = new Date(endDate);
      }
    }

    // Execute query with pagination and populate student info
    const drills = await Drill.find(query)
      .populate('studentId', 'name class rollNo')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Drill.countDocuments(query);

    res.json({
      success: true,
      data: drills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get drills error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/drills/:id
// @desc    Get drill by ID
// @access  Public (should be protected in production)
router.get('/:id', async (req, res) => {
  try {
    const drill = await Drill.findById(req.params.id)
      .populate('studentId', 'name class rollNo');
    
    if (!drill) {
      return res.status(404).json({
        success: false,
        message: 'Drill not found'
      });
    }

    res.json({
      success: true,
      data: drill
    });

  } catch (error) {
    console.error('Get drill error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid drill ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/drills
// @desc    Save new drill completion
// @access  Public (should be protected in production)
router.post('/', [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('drillType').isIn(['fire', 'earthquake', 'flood', 'general_emergency', 'evacuation'])
    .withMessage('Invalid drill type'),
  body('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('status').isIn(['completed', 'in_progress', 'failed', 'skipped'])
    .withMessage('Invalid status'),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
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

    const { studentId, drillType, score, status, duration, notes, responses } = req.body;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Create new drill record
    const drill = new Drill({
      studentId,
      drillType,
      score,
      status,
      duration,
      notes,
      responses,
      completedAt: new Date()
    });

    await drill.save();

    // Populate student info for response
    await drill.populate('studentId', 'name class rollNo');

    res.status(201).json({
      success: true,
      message: 'Drill completed successfully',
      data: drill
    });

  } catch (error) {
    console.error('Save drill error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/drills/:id
// @desc    Update drill record
// @access  Protected (Admin only)
router.put('/:id', [
  body('drillType').optional().isIn(['fire', 'earthquake', 'flood', 'general_emergency', 'evacuation'])
    .withMessage('Invalid drill type'),
  body('score').optional().isFloat({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('status').optional().isIn(['completed', 'in_progress', 'failed', 'skipped'])
    .withMessage('Invalid status'),
  body('duration').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
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

    const drill = await Drill.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('studentId', 'name class rollNo');

    if (!drill) {
      return res.status(404).json({
        success: false,
        message: 'Drill not found'
      });
    }

    res.json({
      success: true,
      message: 'Drill updated successfully',
      data: drill
    });

  } catch (error) {
    console.error('Update drill error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid drill ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/drills/:id
// @desc    Delete drill record
// @access  Protected (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const drill = await Drill.findByIdAndDelete(req.params.id);

    if (!drill) {
      return res.status(404).json({
        success: false,
        message: 'Drill not found'
      });
    }

    res.json({
      success: true,
      message: 'Drill deleted successfully'
    });

  } catch (error) {
    console.error('Delete drill error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid drill ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/drills/stats/overview
// @desc    Get drill statistics and analytics
// @access  Protected (Admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.completedAt = {};
      if (startDate) {
        dateFilter.completedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.completedAt.$lte = new Date(endDate);
      }
    }

    // Total drills
    const totalDrills = await Drill.countDocuments(dateFilter);

    // Drills by type
    const drillsByType = await Drill.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$drillType',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    // Drills by status
    const drillsByStatus = await Drill.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Average scores by drill type
    const avgScores = await Drill.aggregate([
      { 
        $match: { 
          ...dateFilter, 
          score: { $ne: null },
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: '$drillType',
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' }
        }
      }
    ]);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = await Drill.aggregate([
      {
        $match: {
          completedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' },
            day: { $dayOfMonth: '$completedAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalDrills,
        drillsByType,
        drillsByStatus,
        avgScores,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Get drill stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/drills/student/:studentId
// @desc    Get drills for a specific student
// @access  Public (should be protected in production)
router.get('/student/:studentId', async (req, res) => {
  try {
    const { page = 1, limit = 20, drillType } = req.query;
    
    // Build query
    let query = { studentId: req.params.studentId };
    if (drillType) {
      query.drillType = drillType;
    }

    const drills = await Drill.find(query)
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Drill.countDocuments(query);

    res.json({
      success: true,
      data: drills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get student drills error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;