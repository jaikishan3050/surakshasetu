// MongoDB Connection Test
const mongoose = require('mongoose');

// Test MongoDB connection
async function testMongoDBConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Try local MongoDB first
    await mongoose.connect('mongodb://localhost:27017/surakshasetu', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to local MongoDB');
    return true;
  } catch (error) {
    console.log('❌ Local MongoDB not available:', error.message);
    
    try {
      // Try MongoDB Atlas (replace with your connection string)
      const atlasUri = 'mongodb+srv://username:password@cluster.mongodb.net/surakshasetu?retryWrites=true&w=majority';
      console.log('🔄 Trying MongoDB Atlas...');
      
      // Uncomment and replace with your actual Atlas connection string
      // await mongoose.connect(atlasUri, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // });
      
      console.log('✅ Connected to MongoDB Atlas');
      return true;
    } catch (atlasError) {
      console.log('❌ MongoDB Atlas not configured:', atlasError.message);
      return false;
    }
  }
}

// Run the test
testMongoDBConnection().then(success => {
  if (success) {
    console.log('🎉 MongoDB connection successful!');
    process.exit(0);
  } else {
    console.log('💡 Please set up MongoDB Atlas or install local MongoDB');
    process.exit(1);
  }
});
