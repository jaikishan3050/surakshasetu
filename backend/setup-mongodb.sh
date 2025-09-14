#!/bin/bash

# MongoDB Setup Script for SurakshaSetu
echo "🚀 Setting up MongoDB for SurakshaSetu..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority

# Server Configuration
PORT=5002
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
EOF
    echo "✅ .env file created!"
    echo "💡 Please edit .env file with your actual MongoDB connection string"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔧 MongoDB Setup Options:"
echo ""
echo "Option 1: MongoDB Atlas (Recommended)"
echo "1. Go to: https://www.mongodb.com/atlas"
echo "2. Create free account and cluster"
echo "3. Get connection string"
echo "4. Update MONGODB_URI in .env file"
echo ""
echo "Option 2: Local MongoDB"
echo "1. Install MongoDB: https://www.mongodb.com/try/download/community"
echo "2. Start MongoDB service"
echo "3. Set MONGODB_URI=mongodb://localhost:27017/surakshasetu in .env"
echo ""
echo "Option 3: Use Demo Database"
echo "Contact developer for demo connection string"
echo ""
echo "🚀 After setup, restart server with: npm run dev"
