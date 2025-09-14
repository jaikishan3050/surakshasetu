const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;
const NODE_ENV = process.env.NODE_ENV || 'development';

// -------------------- Security Middleware --------------------
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting (only for API routes)
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
    : 15 * 60 * 1000, // default 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS
    ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
    : 100, // default 100 requests
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// -------------------- Body Parsing --------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// -------------------- MongoDB Connection --------------------
// Try multiple connection options
const MONGODB_OPTIONS = [
  // Option 1: Environment variable (recommended for production)
  process.env.MONGODB_URI,
  
  // Option 2: Local MongoDB (default for development)
  'mongodb://localhost:27017/surakshasetu',
  
  // Option 3: Fixed Atlas connection (replace with your actual cluster URL)
  'mongodb+srv://surakshasetu:surakshasetu123@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority',
  
  // Option 4: Demo connection (for testing - replace with actual credentials)
  'mongodb+srv://demo:demo123@demo-cluster.mongodb.net/surakshasetu?retryWrites=true&w=majority'
];

const MONGODB_URI = MONGODB_OPTIONS.find(uri => uri && uri !== 'mongodb+srv://surakshasetu:surakshasetu123@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority');

if (!MONGODB_URI) {
  console.error('❌ No valid MongoDB connection string found!');
  console.log('💡 Please set up MongoDB:');
  console.log('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
  console.log('   2. Or create MongoDB Atlas account: https://www.mongodb.com/atlas');
  console.log('   3. Set MONGODB_URI environment variable');
  console.log('⚠️  App will continue but database features will not work');
}

if (MONGODB_URI) {
  console.log('🔗 Attempting to connect to MongoDB...');
  console.log('📍 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

  mongoose
    .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 5, // Maintain a minimum of 5 socket connections
  })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📊 Database: surakshasetu');
    console.log('🌐 Connection type:', MONGODB_URI.includes('mongodb+srv://') ? 'Atlas (Cloud)' : 'Local');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 To fix this:');
    console.log('   1. Set up MongoDB Atlas: https://www.mongodb.com/atlas');
    console.log('   2. Create a cluster and get connection string');
    console.log('   3. Set MONGODB_URI environment variable');
    console.log('   4. Or install MongoDB locally and uncomment local connection');
    console.log('⚠️  App will continue but database features will not work');
    
    // Try to connect to local MongoDB as fallback
    if (MONGODB_URI.includes('mongodb+srv://')) {
      console.log('🔄 Attempting fallback to local MongoDB...');
      mongoose.connect('mongodb://localhost:27017/surakshasetu', {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
      })
      .then(() => {
        console.log('✅ Connected to local MongoDB successfully!');
      })
      .catch((localErr) => {
        console.error('❌ Local MongoDB also failed:', localErr.message);
        console.log('💡 Install MongoDB locally: https://www.mongodb.com/try/download/community');
      });
    }
  });
} else {
  console.log('⚠️  Skipping MongoDB connection - no valid URI found');
}

// -------------------- Routes --------------------
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SurakshaSetu Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/drills', require('./routes/drills'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/news', require('./routes/news'));
app.use('/api/emergency-reports', require('./routes/emergency-reports'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/community', require('./routes/community'));

// Data viewing endpoints (for development)
app.get('/api/data/emergency-reports', async (req, res) => {
  try {
    const EmergencyReport = require('./models/EmergencyReport');
    const reports = await EmergencyReport.find().sort({ reportedAt: -1 }).limit(10);
    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'MongoDB not connected',
      error: error.message
    });
  }
});

app.get('/api/data/subscriptions', async (req, res) => {
  try {
    const Subscription = require('./models/Subscription');
    const subscriptions = await Subscription.find().sort({ subscribedAt: -1 }).limit(10);
    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'MongoDB not connected',
      error: error.message
    });
  }
});

app.get('/api/data/community-members', async (req, res) => {
  try {
    const CommunityMember = require('./models/CommunityMember');
    const members = await CommunityMember.find().sort({ joinedAt: -1 }).limit(10);
    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'MongoDB not connected',
      error: error.message
    });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SurakshaSetu API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      students: '/api/students',
      drills: '/api/drills',
      alerts: '/api/alerts',
      news: '/api/news',
      emergencyReports: '/api/emergency-reports',
      subscriptions: '/api/subscriptions',
      community: '/api/community',
      // Data viewing endpoints
      viewEmergencyReports: '/api/data/emergency-reports',
      viewSubscriptions: '/api/data/subscriptions',
      viewCommunityMembers: '/api/data/community-members',
    },
  });
});

// -------------------- Error Handling --------------------
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: NODE_ENV === 'development' ? err.message : 'Internal Server Error',
  });
});

// -------------------- Server Start --------------------
app.listen(PORT, () => {
  console.log(`🚀 SurakshaSetu Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV}`);
});
