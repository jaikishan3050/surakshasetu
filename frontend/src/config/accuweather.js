// AccuWeather API Configuration
// Get your free API key from: https://developer.accuweather.com/

export const ACCUWEATHER_CONFIG = {
    // Replace with your actual AccuWeather API key
    API_KEY: 'YOUR_ACCUWEATHER_API_KEY',
    
    // AccuWeather API endpoints
    ENDPOINTS: {
        LOCATION_SEARCH: 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search',
        CURRENT_CONDITIONS: 'https://dataservice.accuweather.com/currentconditions/v1',
        DAILY_FORECAST: 'https://dataservice.accuweather.com/forecasts/v1/daily/5day',
        HOURLY_FORECAST: 'https://dataservice.accuweather.com/forecasts/v1/hourly/12hour'
    },
    
    // API limits (free tier)
    LIMITS: {
        DAILY_CALLS: 50,
        HOURLY_CALLS: 1000
    }
};

// Instructions for getting AccuWeather API key:
// 1. Visit https://developer.accuweather.com/
// 2. Sign up for a free account
// 3. Create a new app
// 4. Copy your API key
// 5. Replace 'YOUR_ACCUWEATHER_API_KEY' with your actual key
