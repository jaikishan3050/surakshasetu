// WeatherAPI Configuration
// Get your free API key from: https://www.weatherapi.com/

export const WEATHER_API_CONFIG = {
    // Replace with your actual WeatherAPI key
    API_KEY: '63d3febbdc0645c99a372928251309',
    
    // WeatherAPI endpoints
    ENDPOINTS: {
        CURRENT_WEATHER: 'https://api.weatherapi.com/v1/current.json',
        FORECAST: 'https://api.weatherapi.com/v1/forecast.json',
        SEARCH: 'https://api.weatherapi.com/v1/search.json',
        HISTORY: 'https://api.weatherapi.com/v1/history.json',
        FUTURE: 'https://api.weatherapi.com/v1/future.json'
    },
    
    // API limits (free tier)
    LIMITS: {
        MONTHLY_CALLS: 1000000,
        DAILY_CALLS: 10000
    }
};

// Instructions for getting WeatherAPI key:
// 1. Visit https://www.weatherapi.com/
// 2. Sign up for a free account
// 3. Go to your dashboard
// 4. Copy your API key
// 5. Replace 'YOUR_WEATHERAPI_KEY' with your actual key

// WeatherAPI Advantages:
// - More accurate weather data
// - Better global coverage
// - Real-time updates
// - Comprehensive weather information
// - Higher API limits
// - Better documentation
