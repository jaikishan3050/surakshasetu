const express = require('express');
const { body, validationResult } = require('express-validator');
const News = require('../models/News');

const router = express.Router();

// @route   GET /api/news
// @desc    Fetch latest disaster news (scraped or dummy)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      region, 
      search 
    } = req.query;
    
    // Build query
    let query = {};
    if (category) {
      query.category = category;
    }
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const news = await News.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      data: news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get news error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/news/latest
// @desc    Get latest news (top 10)
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const { category, region } = req.query;
    
    // Build query
    let query = {};
    if (category) {
      query.category = category;
    }
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }

    const news = await News.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(10)
      .exec();

    res.json({
      success: true,
      data: news,
      count: news.length
    });

  } catch (error) {
    console.error('Get latest news error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/news/:id
// @desc    Get news by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    // Increment view count
    await News.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: news
    });

  } catch (error) {
    console.error('Get news error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/news
// @desc    Create new news article (Admin only)
// @access  Protected (Admin only)
router.post('/', [
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  body('description').trim().isLength({ min: 50, max: 2000 }).withMessage('Description must be between 50 and 2000 characters'),
  body('source').trim().isLength({ min: 2, max: 100 }).withMessage('Source must be between 2 and 100 characters'),
  body('category').isIn(['earthquake', 'flood', 'fire', 'storm', 'tsunami', 'landslide', 'general', 'preparedness', 'recovery'])
    .withMessage('Invalid news category'),
  body('region').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Region must be between 2 and 100 characters'),
  body('sourceUrl').optional().isURL().withMessage('Invalid source URL'),
  body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
  body('publishedAt').optional().isISO8601().withMessage('Invalid publication date')
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
      title, 
      description, 
      source, 
      category, 
      region, 
      sourceUrl, 
      imageUrl, 
      publishedAt,
      tags
    } = req.body;

    // Create new news article
    const news = new News({
      title,
      description,
      source,
      category,
      region,
      sourceUrl,
      imageUrl,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      tags: tags || [],
      views: 0
    });

    await news.save();

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: news
    });

  } catch (error) {
    console.error('Create news error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/news/:id
// @desc    Update news article
// @access  Protected (Admin only)
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  body('description').optional().trim().isLength({ min: 50, max: 2000 }).withMessage('Description must be between 50 and 2000 characters'),
  body('source').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Source must be between 2 and 100 characters'),
  body('category').optional().isIn(['earthquake', 'flood', 'fire', 'storm', 'tsunami', 'landslide', 'general', 'preparedness', 'recovery'])
    .withMessage('Invalid news category'),
  body('region').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Region must be between 2 and 100 characters'),
  body('sourceUrl').optional().isURL().withMessage('Invalid source URL'),
  body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
  body('publishedAt').optional().isISO8601().withMessage('Invalid publication date')
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

    const news = await News.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          ...req.body,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.json({
      success: true,
      message: 'News article updated successfully',
      data: news
    });

  } catch (error) {
    console.error('Update news error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete news article
// @access  Protected (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }

    res.json({
      success: true,
      message: 'News article deleted successfully'
    });

  } catch (error) {
    console.error('Delete news error:', error.message);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid news ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/news/categories/list
// @desc    Get available news categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await News.distinct('category');
    
    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/news/stats/overview
// @desc    Get news statistics
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

    // Total news articles
    const totalNews = await News.countDocuments(dateFilter);

    // News by category
    const newsByCategory = await News.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    // Top viewed articles
    const topViewed = await News.find(dateFilter)
      .sort({ views: -1 })
      .limit(10)
      .select('title views publishedAt category')
      .exec();

    // Recent articles (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentNews = await News.countDocuments({
      ...dateFilter,
      createdAt: { $gte: sevenDaysAgo }
    });

    // News by source
    const newsBySource = await News.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalNews,
        recentNews,
        newsByCategory,
        newsBySource,
        topViewed
      }
    });

  } catch (error) {
    console.error('Get news stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/news/scrape
// @desc    Trigger news scraping (placeholder for future implementation)
// @access  Protected (Admin only)
router.post('/scrape', async (req, res) => {
  try {
    // This is a placeholder for news scraping functionality
    // You can integrate with news APIs or web scraping services here
    
    res.json({
      success: true,
      message: 'News scraping feature is not implemented yet',
      note: 'You can integrate with news APIs like NewsAPI, RSS feeds, or implement web scraping'
    });

  } catch (error) {
    console.error('News scraping error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;