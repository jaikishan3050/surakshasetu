// TypeScript declaration for weatherapi.js

export interface WeatherApiEndpoints {
    CURRENT_WEATHER: string;
    FORECAST: string;
    SEARCH: string;
    HISTORY: string;
    FUTURE: string;
}

export interface WeatherApiLimits {
    MONTHLY_CALLS: number;
    DAILY_CALLS: number;
}

export interface WeatherApiConfig {
    API_KEY: string;
    ENDPOINTS: WeatherApiEndpoints;
    LIMITS: WeatherApiLimits;
}

export declare const WEATHER_API_CONFIG: WeatherApiConfig;
