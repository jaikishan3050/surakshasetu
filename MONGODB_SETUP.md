# MongoDB Atlas Setup Guide

## Quick Setup for SurakshaSetu

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Build a new app" → "I'm learning MongoDB"

### Step 2: Create a Cluster

1. Choose **FREE** tier (M0 Sandbox)
2. Select **AWS** as provider
3. Choose a region close to you
4. Name your cluster: `SurakshaSetu-Cluster`
5. Click "Create Cluster"

### Step 3: Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `surakshasetu`
5. Password: `surakshasetu123` (or generate a secure one)
6. Click "Add User"

### Step 4: Whitelist IP Address

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

### Step 6: Update Your Application

Replace the connection string in `backend/server.js`:

```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://surakshasetu:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority';
```

**Replace:**

- `YOUR_PASSWORD` with your actual password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### Step 7: Test Connection

1. Restart your backend server: `npm run dev`
2. Check the console for: `✅ Connected to MongoDB Atlas`
3. Test subscription functionality

## Alternative: Use Local MongoDB

If you prefer to use local MongoDB:

1. Install MongoDB locally
2. Start MongoDB service
3. In `backend/server.js`, uncomment the local connection:

```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/surakshasetu';
```

## Troubleshooting

### Connection Refused Error

- Check if MongoDB Atlas cluster is running
- Verify IP whitelist includes your IP
- Check username/password are correct

### Authentication Failed

- Ensure database user exists
- Check password is correct
- Verify user has read/write permissions

### Network Timeout

- Check your internet connection
- Try a different region for your cluster
- Increase timeout settings in connection options

## Security Notes

- Never commit real credentials to version control
- Use environment variables for production
- Regularly rotate database passwords
- Use IP whitelisting for production environments

## Need Help?

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Connection Guide](https://mongoosejs.com/docs/connections.html)
- [MongoDB University Free Courses](https://university.mongodb.com/)
