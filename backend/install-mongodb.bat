@echo off
echo Installing MongoDB Community Server for SurakshaSetu...
echo.

echo Step 1: Download MongoDB Community Server
echo Please visit: https://www.mongodb.com/try/download/community
echo Select Windows and MSI package
echo Download and run the installer
echo.

echo Step 2: During installation:
echo - Choose "Complete" setup type
echo - Check "Install MongoDB as a Service"
echo - Check "Run service as Network Service user"
echo - Check "Install MongoDB Compass" (optional GUI)
echo.

echo Step 3: After installation, MongoDB will start automatically
echo You can verify by running: mongod --version
echo.

echo Step 4: Start your SurakshaSetu backend
echo cd backend
echo npm run dev
echo.

echo Alternative: Use MongoDB Atlas (Cloud)
echo 1. Visit: https://www.mongodb.com/atlas
echo 2. Create free account
echo 3. Create cluster
echo 4. Get connection string
echo 5. Set MONGODB_URI environment variable
echo.

pause
