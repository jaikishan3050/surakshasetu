@echo off
echo 🚀 SurakshaSetu GitHub Deployment Script
echo.

echo Step 1: Checking if Git is initialized...
if not exist .git (
    echo Initializing Git repository...
    git init
    git branch -M main
) else (
    echo ✅ Git repository already initialized
)

echo.
echo Step 2: Adding all files to Git...
git add .

echo.
echo Step 3: Creating commit...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Deploy SurakshaSetu to GitHub

git commit -m "%commit_message%"

echo.
echo Step 4: GitHub repository setup
echo Please ensure you have:
echo 1. Created a GitHub repository named 'surakshasetu'
echo 2. Have the repository URL ready
echo.

set /p github_url="Enter your GitHub repository URL (https://github.com/username/surakshasetu.git): "

if "%github_url%"=="" (
    echo ❌ GitHub URL is required. Please run the script again.
    pause
    exit /b 1
)

echo.
echo Step 5: Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin %github_url%

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Successfully deployed to GitHub!
echo.
echo Next Steps:
echo 1. Set up MongoDB Atlas (see DEPLOYMENT_GUIDE.md)
echo 2. Deploy backend to Railway
echo 3. Deploy frontend to Vercel
echo 4. Configure environment variables
echo.
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
echo.

pause
