# Quick MongoDB Atlas Setup for SurakshaSetu

## 🚀 Fast Setup (5 minutes)

### Step 1: Create Free Account

1. Go to: <https://www.mongodb.com/atlas>
2. Click "Try Free"
3. Sign up with Google/GitHub or email

### Step 2: Create Cluster

1. Choose **FREE** tier (M0 Sandbox)
2. Select **AWS** provider
3. Choose region: **N. Virginia (us-east-1)** or closest to you
4. Cluster name: `SurakshaSetu-Cluster`
5. Click **"Create Cluster"**

### Step 3: Database Access

1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `surakshasetu`
5. Password: `surakshasetu123` (or generate secure one)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **"Clusters"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **4.1 or later**
5. Copy the connection string

### Step 6: Update Application

Replace the connection string in `backend/server.js`:

```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://surakshasetu:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority';
```

**Replace:**

- `YOUR_PASSWORD` with your actual password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL

### Step 7: Test Connection

1. Restart server: `npm run dev`
2. Look for: `✅ Connected to MongoDB Atlas`
3. Test subscription form

## 🔧 Alternative: Use Demo Database

If you want to test immediately without setup, I can provide a demo connection string that should work for testing purposes.

## 📱 Quick Test

Once connected, test the subscription:

1. Open: <http://localhost:5174/>
2. Click "Subscribe" button
3. Enter email: `test@example.com`
4. Click "Subscribe"
5. Should see: "✅ Successfully subscribed to emergency alerts!"

## 🆘 Need Help?

- **Atlas Dashboard**: <https://cloud.mongodb.com/>
- **Documentation**: <https://docs.atlas.mongodb.com/>
- **Free Support**: MongoDB Community Forums

---

**Note**: The free tier includes 512MB storage and is perfect for development and testing!
