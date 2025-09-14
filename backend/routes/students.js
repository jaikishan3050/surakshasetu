const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');

const router = express.Router();

// @route   GET /api/students
// @desc    Get list of enrolled students
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, class: studentClass, search } = req.query;
    
    // Build query
    let query = {};
    if (studentClass) {
      query.class = studentClass;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const students = await Student.find(query)
      .sort({ class: 1, rollNo: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      data: students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get students error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Public (should be protected in production)
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Get student error:', error.message);
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

// @route   POST /api/students
// @desc    Add new student
// @access  Protected (Admin only)
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('class').trim().notEmpty().withMessage('Class is required'),
  body('rollNo').trim().notEmpty().withMessage('Roll number is required'),
  body('emergencyContact.name').optional().trim().isLength({ min: 2 }).withMessage('Emergency contact name must be at least 2 characters'),
  body('emergencyContact.phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid emergency contact phone number')
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

    const { name, class: studentClass, rollNo, emergencyContact } = req.body;

    // Check if student with same roll number in same class exists
    const existingStudent = await Student.findOne({ 
      class: studentClass, 
      rollNo: rollNo 
    });
    
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number already exists in this class'
      });
    }

    // Create new student
    const student = new Student({
      name,
      class: studentClass,
      rollNo,
      emergencyContact: emergencyContact || {}
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: student
    });

  } catch (error) {
    console.error('Add student error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Protected (Admin only)
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('class').optional().trim().notEmpty().withMessage('Class cannot be empty'),
  body('rollNo').optional().trim().notEmpty().withMessage('Roll number cannot be empty'),
  body('emergencyContact.name').optional().trim().isLength({ min: 2 }).withMessage('Emergency contact name must be at least 2 characters'),
  body('emergencyContact.phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Invalid emergency contact phone number')
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

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Update student error:', error.message);
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

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Protected (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error.message);
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

// @route   GET /api/students/stats/overview
// @desc    Get student statistics
// @access  Protected (Admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const studentsByClass = await Student.aggregate([
      {
        $group: {
          _id: '$class',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        studentsByClass
      }
    });

  } catch (error) {
    console.error('Get student stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;