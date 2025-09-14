const express = require('express');
const { body, validationResult } = require('express-validator');
const CommunityMember = require('../models/CommunityMember');

const router = express.Router();

// @route   POST /api/community/join
// @desc    Join community as volunteer/helper
// @access  Public
router.post('/join', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Valid phone number is required'),
  body('location').trim().isLength({ min: 2, max: 200 }).withMessage('Location must be between 2 and 200 characters'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('availability').optional().isIn(['weekdays', 'weekends', 'anytime', 'emergency_only'])
    .withMessage('Invalid availability option'),
  body('volunteerType').optional().isIn(['first_aid', 'rescue', 'communication', 'logistics', 'general'])
    .withMessage('Invalid volunteer type')
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
      name, 
      email, 
      phone, 
      location, 
      skills = [], 
      availability = 'anytime',
      volunteerType = 'general',
      experience,
      notes
    } = req.body;

    // Check if email already exists
    const existingMember = await CommunityMember.findOne({ email });
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered in community'
      });
    }

    // Create new community member
    const communityMember = new CommunityMember({
      name,
      email,
      phone,
      location,
      skills,
      availability,
      volunteerType,
      experience: experience || 'Beginner',
      notes,
      joinedAt: new Date(),
      isActive: true,
      status: 'pending_verification'
    });

    await communityMember.save();

    res.status(201).json({
      success: true,
      message: 'Successfully joined the community! We will verify your details and contact you soon.',
      data: {
        id: communityMember._id,
        name: communityMember.name,
        volunteerType: communityMember.volunteerType,
        status: communityMember.status,
        joinedAt: communityMember.joinedAt
      }
    });

  } catch (error) {
    console.error('Join community error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/community/members
// @desc    Get community members (Admin only)
// @access  Protected
router.get('/members', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      status, 
      volunteerType, 
      location 
    } = req.query;
    
    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (volunteerType) {
      query.volunteerType = volunteerType;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Execute query with pagination
    const members = await CommunityMember.find(query)
      .sort({ joinedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await CommunityMember.countDocuments(query);

    res.json({
      success: true,
      data: members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get community members error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/community/members/:id/status
// @desc    Update member status (Admin only)
// @access  Protected
router.put('/members/:id/status', [
  body('status').isIn(['pending_verification', 'verified', 'active', 'inactive', 'suspended'])
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

    const { status, adminNotes } = req.body;

    const member = await CommunityMember.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          status,
          adminNotes,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Community member not found'
      });
    }

    res.json({
      success: true,
      message: 'Member status updated successfully',
      data: member
    });

  } catch (error) {
    console.error('Update member status error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid member ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/community/stats
// @desc    Get community statistics
// @access  Protected (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const totalMembers = await CommunityMember.countDocuments();
    const activeMembers = await CommunityMember.countDocuments({ status: 'active' });
    const pendingMembers = await CommunityMember.countDocuments({ status: 'pending_verification' });

    const membersByType = await CommunityMember.aggregate([
      {
        $group: {
          _id: '$volunteerType',
          count: { $sum: 1 }
        }
      }
    ]);

    const membersByLocation = await CommunityMember.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const membersByAvailability = await CommunityMember.aggregate([
      {
        $group: {
          _id: '$availability',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        pendingMembers,
        membersByType,
        membersByLocation,
        membersByAvailability
      }
    });

  } catch (error) {
    console.error('Get community stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
