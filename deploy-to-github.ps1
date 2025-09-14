# SurakshaSetu GitHub Deployment Script
Write-Host "🚀 SurakshaSetu GitHub Deployment Script" -ForegroundColor Green
Write-Host ""

# Step 1: Check if Git is initialized
Write-Host "Step 1: Checking if Git is initialized..." -ForegroundColor Yellow
if (!(Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    git branch -M main
}
else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Step 2: Add files to Git
Write-Host ""
Write-Host "Step 2: Adding all files to Git..." -ForegroundColor Yellow
git add .

# Step 3: Create commit
Write-Host ""
Write-Host "Step 3: Creating commit..." -ForegroundColor Yellow
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Deploy SurakshaSetu to GitHub"
}

git commit -m $commitMessage

# Step 4: GitHub repository setup
Write-Host ""
Write-Host "Step 4: GitHub repository setup" -ForegroundColor Yellow
Write-Host "Please ensure you have:" -ForegroundColor White
Write-Host "1. Created a GitHub repository named 'surakshasetu'" -ForegroundColor White
Write-Host "2. Have the repository URL ready" -ForegroundColor White
Write-Host ""

$githubUrl = Read-Host "Enter your GitHub repository URL (https://github.com/username/surakshasetu.git)"

if ([string]::IsNullOrWhiteSpace($githubUrl)) {
    Write-Host "❌ GitHub URL is required. Please run the script again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 5: Add GitHub remote
Write-Host ""
Write-Host "Step 5: Adding GitHub remote..." -ForegroundColor Yellow
try {
    git remote remove origin 2>$null
}
catch {
    # Remote doesn't exist, that's fine
}
git remote add origin $githubUrl

# Step 6: Push to GitHub
Write-Host ""
Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "✅ Successfully deployed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Set up MongoDB Atlas (see DEPLOYMENT_GUIDE.md)" -ForegroundColor White
Write-Host "2. Deploy backend to Railway" -ForegroundColor White
Write-Host "3. Deploy frontend to Vercel" -ForegroundColor White
Write-Host "4. Configure environment variables" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to exit"
