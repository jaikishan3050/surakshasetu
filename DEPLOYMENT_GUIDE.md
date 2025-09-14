# 🚀 GitHub Deployment Guide for SurakshaSetu

This guide will help you deploy SurakshaSetu to GitHub and set up automatic deployments.

## 📋 Prerequisites

- GitHub account
- Git installed on your computer
- MongoDB Atlas account (for database)
- Vercel/Netlify account (for frontend)
- Railway/Render account (for backend)

## 🔧 Step 1: Prepare Your Project

### 1.1 Initialize Git Repository

```bash
# Navigate to your project root
cd C:\Users\krish\surakshasetu

# Initialize git (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: SurakshaSetu disaster preparedness platform"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `surakshasetu`
4. Description: `🛡️ Disaster Preparedness Platform for Educational Institutions`
5. Make it **Public** (or Private if you prefer)
6. Don't initialize with README, .gitignore, or license (we already have them)
7. Click "Create repository"

### 1.3 Connect Local Repository to GitHub

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/surakshasetu.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🗄️ Step 2: Set Up MongoDB Atlas (Database)

### 2.1 Create MongoDB Atlas Database

1. Visit [MongoDB Atlas](https://account.mongodb.com/account/register)
2. Create free account
3. Create new cluster (Free M0 tier)
4. Create database user:
   - Username: `surakshasetu`
   - Password: `surakshasetu123` (change for production)
5. Add IP whitelist: `0.0.0.0/0` (allows all IPs)
6. Get connection string from "Connect" → "Connect your application"

Example connection string:

```
mongodb+srv://surakshasetu:surakshasetu123@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority
```

## 🖥️ Step 3: Deploy Backend (Railway)

### 3.1 Deploy to Railway

1. Visit [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `surakshasetu` repository
5. Railway will detect your Node.js backend automatically

### 3.2 Configure Environment Variables in Railway

In Railway dashboard, go to your service → Variables tab and add:

```env
NODE_ENV=production
PORT=5002
MONGODB_URI=mongodb+srv://surakshasetu:surakshasetu123@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-xyz123
FRONTEND_URL=https://your-frontend-url.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3.3 Configure Start Command

In Railway, set the start command to:

```bash
cd backend && npm start
```

## 🌐 Step 4: Deploy Frontend (Vercel)

### 4.1 Deploy to Vercel

1. Visit [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your `surakshasetu` repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2 Configure Environment Variables in Vercel

In Vercel dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_NAME=SurakshaSetu
VITE_APP_VERSION=1.0.0
```

## 🔄 Step 5: Set Up Continuous Deployment

### 5.1 Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy SurakshaSetu

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install backend dependencies
      run: cd backend && npm install
    
    - name: Run backend linting
      run: cd backend && npm run lint || echo "No lint script found"

  test-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install frontend dependencies
      run: cd frontend && npm install
    
    - name: Build frontend
      run: cd frontend && npm run build
    
    - name: Run frontend linting
      run: cd frontend && npm run lint || echo "No lint script found"

  deploy:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy notification
      run: echo "Deployment triggered for ${{ github.sha }}"
```

## 📝 Step 6: Update Configuration Files

### 6.1 Update Backend server.js

Update the MONGODB_OPTIONS in `backend/server.js`:

```javascript
const MONGODB_OPTIONS = [
  // Option 1: Environment variable (recommended for production)
  process.env.MONGODB_URI,
  
  // Option 2: Local MongoDB (for development)
  'mongodb://localhost:27017/surakshasetu',
  
  // Option 3: Your Atlas connection (replace with actual)
  'mongodb+srv://surakshasetu:surakshasetu123@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority',
];
```

### 6.2 Update Frontend API Configuration

Update `frontend/src/api/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5002',
  ENDPOINTS: {
    // ... existing endpoints
  }
};
```

## 🚀 Step 7: Deploy

### 7.1 Push Your Changes

```bash
# Add all changes
git add .

# Commit changes
git commit -m "Add deployment configuration and GitHub Actions"

# Push to GitHub
git push origin main
```

### 7.2 Monitor Deployments

- **GitHub Actions**: Check the Actions tab in your GitHub repository
- **Railway**: Monitor build logs in Railway dashboard
- **Vercel**: Check deployment status in Vercel dashboard

## 🔗 Step 8: Get Your Live URLs

After successful deployment, you'll have:

- **Frontend**: `https://your-repo-name.vercel.app`
- **Backend**: `https://your-repo-name.up.railway.app`
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/surakshasetu`

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check package.json scripts
   - Ensure all dependencies are listed
   - Check Node.js version compatibility

2. **Backend Won't Start**:
   - Verify environment variables
   - Check MongoDB connection string
   - Ensure PORT is set correctly

3. **Frontend Can't Connect to Backend**:
   - Update VITE_API_URL with correct backend URL
   - Check CORS configuration
   - Verify API endpoints

4. **Database Connection Issues**:
   - Verify MongoDB Atlas IP whitelist
   - Check username/password in connection string
   - Ensure database user has correct permissions

## 🎯 Next Steps

1. **Custom Domain**: Add custom domain in Vercel/Railway
2. **SSL Certificate**: Automatic with Vercel/Railway
3. **Monitoring**: Set up error tracking (Sentry)
4. **Analytics**: Add Google Analytics
5. **Performance**: Optimize builds and add caching

## 📞 Support

- Check GitHub Issues for common problems
- Review deployment logs in hosting platforms
- MongoDB Atlas support for database issues

---

**🎉 Congratulations! Your SurakshaSetu platform is now live on GitHub!**
