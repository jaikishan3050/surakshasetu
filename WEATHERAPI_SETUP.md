# WeatherAPI Setup Guide

## 🌤️ How to Set Up WeatherAPI for More Accurate Weather Updates

### Step 1: Get WeatherAPI Key

1. **Visit WeatherAPI Website**
   - Go to: https://www.weatherapi.com/
   - Click "Sign Up" to create a free account

2. **Create Account**
   - Fill in your details
   - Verify your email address
   - Log in to your dashboard

3. **Get Your API Key**
   - After logging in, you'll see your API key on the dashboard
   - Copy the API key (it looks like: `1234567890abcdef1234567890abcdef`)

### Step 2: Configure the API Key

1. **Open the Configuration File**
   - Navigate to: `frontend/src/config/weatherapi.js`

2. **Replace the Placeholder**
   - Find this line:
     ```javascript
     API_KEY: 'YOUR_WEATHERAPI_KEY',
     ```
   - Replace `YOUR_WEATHERAPI_KEY` with your actual API key:
     ```javascript
     API_KEY: '1234567890abcdef1234567890abcdef',
     ```

3. **Save the File**
   - Save the configuration file

### Step 3: Test the Integration

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Check Weather Section**
   - Open: http://localhost:5173/
   - Look for the "Daily Weather Report" section
   - Click the "🔄 Update" button to test the API

3. **Verify Enhanced Data**
   - You should see more accurate weather data including:
     - Current temperature and "feels like" temperature
     - Cloud cover percentage
     - Precipitation data
     - Air quality index (PM2.5, PM10, CO, NO₂, O₃, SO₂)
     - Weather alerts and warnings
     - Enhanced 3-day forecast

### Step 4: API Limits (Free Tier)

**WeatherAPI Free Tier Limits:**
- **1,000,000 calls per month** (vs AccuWeather's 50/day)
- **10,000 calls per day**
- **Real-time weather data**
- **5-day forecast**
- **Air quality data**
- **Weather alerts**

**Optimization Tips:**
- Weather updates every 30 minutes (48 calls/day)
- News updates every 5 minutes (288 calls/day)
- Total: ~336 calls/day (well within limits)

### Step 5: WeatherAPI Advantages

**Why WeatherAPI is More Accurate:**

1. **🌍 Global Coverage**
   - Covers 200+ countries
   - More accurate for international locations
   - Better data for remote areas

2. **📊 Comprehensive Data**
   - Air quality index (AQI)
   - Real-time weather alerts
   - "Feels like" temperature
   - Cloud cover percentage
   - Precipitation data

3. **⚡ Better Performance**
   - Single API call for current + forecast
   - Faster response times
   - More reliable uptime

4. **🔬 Scientific Accuracy**
   - Uses multiple weather models
   - Real-time data updates
   - Professional-grade accuracy

### Step 6: Enhanced Features Available

**New Weather Data Points:**

1. **🌡️ Feels Like Temperature**
   - More accurate comfort level
   - Accounts for humidity and wind

2. **☁️ Cloud Cover**
   - Percentage of sky covered by clouds
   - Better weather prediction

3. **🌧️ Precipitation Data**
   - Current precipitation in mm
   - More detailed rain information

4. **🌬️ Air Quality Index**
   - PM2.5 and PM10 levels
   - CO, NO₂, O₃, SO₂ concentrations
   - EPA and DEFRA indices

5. **⚠️ Weather Alerts**
   - Real-time weather warnings
   - Severe weather notifications
   - Emergency alerts

6. **📈 Enhanced Forecast**
   - Maximum wind speed
   - Average humidity
   - UV index for each day

### Step 7: Troubleshooting

**Common Issues:**

1. **"WeatherAPI key not configured"**
   - Make sure you've replaced the placeholder API key
   - Check for typos in the API key

2. **"Weather API failed"**
   - Check your internet connection
   - Verify the API key is correct
   - Ensure you haven't exceeded daily limits

3. **"Location not found"**
   - Try different location formats
   - Use city, country format
   - Check spelling

4. **CORS Errors**
   - WeatherAPI supports CORS
   - If you see CORS errors, check your API key configuration

### Step 8: Production Considerations

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

### Step 9: Advanced Features

**Additional WeatherAPI Features Available:**

1. **Historical Weather**
   - Past weather conditions
   - Trend analysis
   - Climate data

2. **Future Weather**
   - Weather predictions beyond 5 days
   - Long-term forecasts

3. **Astronomy Data**
   - Sunrise/sunset times
   - Moon phases
   - Astronomical data

4. **Sports Weather**
   - Weather conditions for sports
   - Golf weather
   - Skiing conditions

### Step 10: Migration Benefits

**From AccuWeather to WeatherAPI:**

✅ **Higher Accuracy**: Better weather models and data sources
✅ **More Data**: Air quality, alerts, feels-like temperature
✅ **Better Limits**: 1M calls/month vs 50/day
✅ **Global Coverage**: Better international support
✅ **Real-time Alerts**: Weather warnings and emergency alerts
✅ **Single API Call**: Current + forecast in one request
✅ **Better Documentation**: Comprehensive API documentation

### Support

**Need Help?**
- WeatherAPI Documentation: https://www.weatherapi.com/docs/
- WeatherAPI Support: https://www.weatherapi.com/support
- SurakshaSetu Issues: Create an issue in the project repository

---

**Note:** WeatherAPI provides professional-grade weather data with higher accuracy and more comprehensive information for emergency response planning and safety advisories.
