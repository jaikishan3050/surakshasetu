# AccuWeather API Setup Guide

## 🌤️ How to Set Up AccuWeather API for Weather Updates

### Step 1: Get AccuWeather API Key

1. **Visit AccuWeather Developer Portal**
   - Go to: <https://developer.accuweather.com/>
   - Click "Sign Up" to create a free account

2. **Create a New App**
   - Log in to your account
   - Click "My Apps" in the dashboard
   - Click "Create a New App"
   - Fill in the required information:
     - App Name: `SurakshaSetu Weather`
     - App Description: `Weather service for emergency response system`
     - App Category: `Weather`
   - Accept the terms and conditions
   - Click "Create App"

3. **Get Your API Key**
   - After creating the app, you'll see your API key
   - Copy the API key (it looks like: `AbCdEfGhIjKlMnOpQrStUvWxYz123456`)

### Step 2: Configure the API Key

1. **Open the Configuration File**
   - Navigate to: `frontend/src/config/accuweather.js`

2. **Replace the Placeholder**
   - Find this line:

     ```javascript
     API_KEY: 'YOUR_ACCUWEATHER_API_KEY',
     ```

   - Replace `YOUR_ACCUWEATHER_API_KEY` with your actual API key:

     ```javascript
     API_KEY: 'AbCdEfGhIjKlMnOpQrStUvWxYz123456',
     ```

3. **Save the File**
   - Save the configuration file

### Step 3: Test the Integration

1. **Start the Application**

   ```bash
   npm run dev
   ```

2. **Check Weather Section**
   - Open: <http://localhost:5173/>
   - Look for the "Daily Weather Report" section
   - Click the "🔄 Update" button to test the API

3. **Verify Data**
   - You should see real weather data including:
     - Current temperature
     - Weather conditions
     - Humidity, wind speed, pressure
     - UV index
     - 3-day forecast

### Step 4: API Limits (Free Tier)

**AccuWeather Free Tier Limits:**

- **50 calls per day** for current conditions
- **50 calls per day** for forecasts
- **1,000 calls per hour** total

**Optimization Tips:**

- Weather updates every 30 minutes (48 calls/day)
- News updates every 5 minutes (288 calls/day)
- Total: ~336 calls/day (within limits)

### Step 5: Troubleshooting

**Common Issues:**

1. **"AccuWeather API key not configured"**
   - Make sure you've replaced the placeholder API key
   - Check for typos in the API key

2. **"Location API failed"**
   - Check your internet connection
   - Verify the API key is correct
   - Ensure you haven't exceeded daily limits

3. **"Weather data unavailable"**
   - Check browser console for errors
   - Verify API key permissions
   - Check AccuWeather service status

4. **CORS Errors**
   - AccuWeather APIs support CORS
   - If you see CORS errors, check your API key configuration

### Step 6: Production Considerations

**For Production Deployment:**

1. **Environment Variables**
   - Move API key to environment variables
   - Never commit API keys to version control

2. **Rate Limiting**
   - Implement client-side rate limiting
   - Consider caching weather data

3. **Error Handling**
   - Implement proper fallback mechanisms
   - Add retry logic for failed requests

4. **Monitoring**
   - Monitor API usage
   - Set up alerts for quota limits

### Step 7: Advanced Features

**Additional AccuWeather APIs Available:**

1. **Hourly Forecasts**
   - 12-hour detailed forecasts
   - Perfect for emergency planning

2. **Weather Alerts**
   - Severe weather warnings
   - Emergency notifications

3. **Historical Data**
   - Past weather conditions
   - Trend analysis

4. **Indices**
   - Air quality index
   - Pollen count
   - UV index

### Support

**Need Help?**

- AccuWeather Developer Documentation: <https://developer.accuweather.com/accuweather-web-apis/apis>
- AccuWeather Support: <https://developer.accuweather.com/support>
- SurakshaSetu Issues: Create an issue in the project repository

---

**Note:** This integration provides professional-grade weather data for emergency response planning and safety advisories.
