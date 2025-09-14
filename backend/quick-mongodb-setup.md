# Quick MongoDB Setup for SurakshaSetu

## Option 1: MongoDB Atlas (Recommended - 2 minutes)

### Step 1: Get Free MongoDB Atlas Database

1. Visit: <https://account.mongodb.com/account/register>
2. Sign up with email (or use Google/GitHub)
3. Choose "Build a database" → "FREE" (M0)
4. Keep default settings and click "Create"

### Step 2: Create Database User

1. In "Database Access", click "Add New Database User"
2. Username: `surakshasetu`
3. Password: `surakshasetu123`
4. Built-in Role: `Read and write to any database`
5. Click "Add User"

### Step 3: Allow Network Access

1. In "Network Access", click "Add IP Address"
2. Click "Allow Access from Anywhere" (0.0.0.0/0)
3. Click "Confirm"

### Step 4: Get Connection String

1. Go back to "Clusters"
2. Click "Connect" → "Connect your application"
3. Copy the connection string
4. Replace `<password>` with `surakshasetu123`

### Step 5: Update Backend

Edit `backend/server.js` line 45:

```javascript
'mongodb://localhost:27017/surakshasetu',
```

Replace with your Atlas connection string:

```javascript
'mongodb+srv://surakshasetu:surakshasetu123@cluster0.xxxxx.mongodb.net/surakshasetu?retryWrites=true&w=majority',
```

## Option 2: Local MongoDB Installation

### Windows (Using Chocolatey)

```powershell
# Run as Administrator
choco install mongodb -y
net start mongodb
```

### Windows (Manual)

1. Download: <https://www.mongodb.com/try/download/community>
2. Run installer with default settings
3. MongoDB will start automatically

### Verify Installation

```bash
mongod --version
```

## Test Your Setup

1. Restart backend: `npm run dev`
2. Look for: `✅ Connected to MongoDB successfully!`
3. Test subscription feature in the app

## Troubleshooting

### "Authentication failed"

- Check username/password in connection string
- Ensure database user has correct permissions

### "Network timeout"

- Check if your IP is whitelisted
- Try "Allow Access from Anywhere" temporarily

### "MongoServerError"

- Wait 2-3 minutes after creating cluster
- Atlas needs time to initialize

## Security Note

For production, use environment variables:

```bash
MONGODB_URI=your_connection_string_here
```
