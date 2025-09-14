// WeatherAPI Test Component
// This component can be used to test the WeatherAPI integration

import { WEATHER_API_CONFIG } from './config/weatherapi.js';

export const testWeatherAPI = async (location = 'London') => {
    try {
        console.log('Testing WeatherAPI with location:', location);
        
        const response = await fetch(
            `${WEATHER_API_CONFIG.ENDPOINTS.CURRENT_WEATHER}?key=${WEATHER_API_CONFIG.API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('✅ WeatherAPI Test Successful!');
        console.log('Location:', data.location.name, data.location.country);
        console.log('Temperature:', data.current.temp_c + '°C');
        console.log('Condition:', data.current.condition.text);
        console.log('Feels Like:', data.current.feelslike_c + '°C');
        console.log('Humidity:', data.current.humidity + '%');
        console.log('Wind Speed:', data.current.wind_kph + ' km/h');
        console.log('Air Quality PM2.5:', data.current.air_quality?.pm2_5 + ' μg/m³');
        
        return {
            success: true,
            data: data,
            message: `Weather data for ${data.location.name} loaded successfully!`
        };
        
    } catch (error) {
        console.error('❌ WeatherAPI Test Failed:', error.message);
        return {
            success: false,
            error: error.message,
            message: `Failed to load weather data: ${error.message}`
        };
    }
};

// Test function that can be called from browser console
window.testWeather = testWeatherAPI;
