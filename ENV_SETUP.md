# 🔧 Environment Variables Setup

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/surakshasetu

# Server Configuration
PORT=5002
NODE_ENV=development

# JWT Secret (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Backend Environment

```env
NODE_ENV=production
PORT=5002
MONGODB_URI=mongodb+srv://surakshasetu:your-password@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-production-jwt-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with:

```env
# API Configuration
VITE_API_URL=http://localhost:5002

# App Configuration
VITE_APP_NAME=SurakshaSetu
VITE_APP_VERSION=1.0.0
```

### Production Frontend Environment

```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_NAME=SurakshaSetu
VITE_APP_VERSION=1.0.0
```

## Deployment Platform Environment Variables

### Railway (Backend)

Set these in Railway dashboard → Variables:

- `NODE_ENV=production`
- `MONGODB_URI=your_atlas_connection_string`
- `JWT_SECRET=your_production_secret`
- `FRONTEND_URL=https://your-vercel-url.vercel.app`

### Vercel (Frontend)

Set these in Vercel dashboard → Environment Variables:

- `VITE_API_URL=https://your-railway-url.railway.app`
- `VITE_APP_NAME=SurakshaSetu`
- `VITE_APP_VERSION=1.0.0`
