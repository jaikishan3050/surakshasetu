
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { WEATHER_API_CONFIG } from "./config/weatherapi";

// TypeScript Interfaces
interface NewsItem {
    id: number;
    title: string;
    summary: string;
    category: string;
    publishedAt: string;
    source: string;
}

interface AirQuality {
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
    so2: number;
    usEpaIndex: number;
    gbDefraIndex: number;
}

interface WeatherAlert {
    headline: string;
    desc: string;
    effective: string;
    expires: string;
}

interface ForecastDay {
    date: string;
    condition: string;
    high: number;
    low: number;
    precipitation: number;
}

interface WeatherData {
    temperature: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: number;
    uvIndex: number;
    location: string;
    country: string;
    state: string;
    lastUpdated: string;
    forecast: ForecastDay[];
    feelsLike?: number;
    cloudCover?: number;
    precipitation?: number;
    windChill?: number;
    heatIndex?: number;
    dewPoint?: number;
    gustSpeed?: number;
    airQuality?: AirQuality | null;
    alerts: WeatherAlert[];
}

interface ReportForm {
    type: string;
    location: string;
    description: string;
    reporterName: string;
    reporterPhone: string;
}

interface SubscribeForm {
    email: string;
    name: string;
    phone: string;
    location: string;
    alertTypes: string[];
}

interface CommunityForm {
    name: string;
    email: string;
    phone: string;
    location: string;
    skills: string[];
    availability: string;
    volunteerType: string;
    experience: string;
}

export default function SurakshaSetuUI() {
    const [showReportModal, setShowReportModal] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [showCommunityModal, setShowCommunityModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [news, setNews] = useState<NewsItem[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [newsLoading, setNewsLoading] = useState(false);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [manualLocation, setManualLocation] = useState('');
    const [useManualLocation, setUseManualLocation] = useState(false);

    // Emergency Report Form
    const [reportForm, setReportForm] = useState<ReportForm>({
        type: '',
        location: '',
        description: '',
        reporterName: '',
        reporterPhone: ''
    });

    // Subscription Form
    const [subscribeForm, setSubscribeForm] = useState<SubscribeForm>({
        email: '',
        name: '',
        phone: '',
        location: '',
        alertTypes: ['general']
    });

    // Community Form
    const [communityForm, setCommunityForm] = useState<CommunityForm>({
        name: '',
        email: '',
        phone: '',
        location: '',
        skills: [],
        availability: 'anytime',
        volunteerType: 'general',
        experience: 'Beginner'
    });

    const API_BASE = 'http://localhost:5002/api';

    // Fetch real-time news
    const fetchNews = async () => {
        setNewsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/news`);
            const data = await response.json();
            
            if (data.success) {
                setNews(data.data || []);
            } else {
                // Fallback to mock news if API fails
                setNews([
                    {
                        id: 1,
                        title: "Emergency Preparedness Tips for Monsoon Season",
                        summary: "Learn essential safety measures for the upcoming monsoon season",
                        category: "Safety",
                        publishedAt: new Date().toISOString(),
                        source: "SurakshaSetu News"
                    } as any,
                    {
                        id: 2,
                        title: "New Emergency Response Protocol Implemented",
                        summary: "Campus introduces updated emergency response procedures",
                        category: "Policy",
                        publishedAt: new Date(Date.now() - 3600000).toISOString(),
                        source: "Campus Security"
                    },
                    {
                        id: 3,
                        title: "Community Emergency Drill Scheduled",
                        summary: "Monthly emergency drill will be conducted next week",
                        category: "Events",
                        publishedAt: new Date(Date.now() - 7200000).toISOString(),
                        source: "Emergency Services"
                    }
                ]);
            }
        } catch (error) {
            // Fallback to mock news
            setNews([
                {
                    id: 1,
                    title: "Emergency Preparedness Tips for Monsoon Season",
                    summary: "Learn essential safety measures for the upcoming monsoon season",
                    category: "Safety",
                    publishedAt: new Date().toISOString(),
                    source: "SurakshaSetu News"
                },
                {
                    id: 2,
                    title: "New Emergency Response Protocol Implemented",
                    summary: "Campus introduces updated emergency response procedures",
                    category: "Policy",
                    publishedAt: new Date(Date.now() - 3600000).toISOString(),
                    source: "Campus Security"
                },
                {
                    id: 3,
                    title: "Community Emergency Drill Scheduled",
                    summary: "Monthly emergency drill will be conducted next week",
                    category: "Events",
                    publishedAt: new Date(Date.now() - 7200000).toISOString(),
                    source: "Emergency Services"
                }
            ]);
        }
        setNewsLoading(false);
    };

    // Fetch weather data using WeatherAPI
    const fetchWeather = async () => {
        setWeatherLoading(true);
        try {
            // Check if API key is configured
            if (WEATHER_API_CONFIG.API_KEY === 'YOUR_WEATHERAPI_KEY') {
                throw new Error('WeatherAPI key not configured');
            }

            let location = '';

            if (useManualLocation && manualLocation.trim()) {
                // Use manual location input
                location = manualLocation.trim();
            } else {
                // Try to get user's current location
                if (navigator.geolocation) {
                    try {
                        await new Promise<void>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(
                                async (position) => {
                                    try {
                                        // Use coordinates for more accurate location
                                        location = `${position.coords.latitude},${position.coords.longitude}`;
                                        resolve();
                                    } catch (error) {
                                        reject(error);
                                    }
                                }, 
                                (error) => {
                                    // Handle different geolocation errors gracefully
                                    switch(error.code) {
                                        case error.PERMISSION_DENIED:
                                            reject(new Error('Location access denied. Please enable location permissions or enter your location manually.'));
                                            break;
                                        case error.POSITION_UNAVAILABLE:
                                            reject(new Error('Location information unavailable. Please enter your location manually.'));
                                            break;
                                        case error.TIMEOUT:
                                            reject(new Error('Location request timed out. Please try again or enter your location manually.'));
                                            break;
                                        default:
                                            reject(new Error('Unable to get location. Please enter your location manually.'));
                                            break;
                                    }
                                },
                                {
                                    timeout: 10000, // 10 second timeout
                                    enableHighAccuracy: false, // Don't require GPS for faster response
                                    maximumAge: 300000 // Accept 5-minute old location
                                }
                            );
                        });
                    } catch (error) {
                        // If geolocation fails, automatically switch to manual mode
                        console.warn('Geolocation failed:', (error as Error).message);
                        setUseManualLocation(true);
                        setMessage(`⚠️ ${(error as Error).message}`);
                        // Use default location if manual location is empty
                        location = manualLocation.trim() || 'New Delhi, India';
                    }
                } else {
                    // Browser doesn't support geolocation
                    setUseManualLocation(true);
                    setMessage('⚠️ Geolocation not supported. Please enter your location manually.');
                    location = manualLocation.trim() || 'New Delhi, India';
                }
            }

            if (!location) {
                throw new Error('Unable to get location');
            }

            // Get current weather with air quality data
            const response = await fetch(
                `${WEATHER_API_CONFIG.ENDPOINTS.CURRENT_WEATHER}?key=${WEATHER_API_CONFIG.API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Weather API failed');
            }
            
            const data = await response.json();
            
            // Process WeatherAPI data based on actual API response structure
            setWeather({
                temperature: Math.round(data.current.temp_c),
                condition: data.current.condition.text,
                description: data.current.condition.text,
                humidity: data.current.humidity,
                windSpeed: Math.round(data.current.wind_kph),
                windDirection: data.current.wind_dir,
                pressure: data.current.pressure_mb,
                visibility: data.current.vis_km,
                uvIndex: data.current.uv,
                location: data.location.name,
                country: data.location.country,
                state: data.location.region,
                lastUpdated: data.current.last_updated,
                forecast: [], // Will be populated separately if needed
                // Additional WeatherAPI data from current response
                feelsLike: Math.round(data.current.feelslike_c),
                cloudCover: data.current.cloud,
                precipitation: data.current.precip_mm,
                windChill: data.current.windchill_c,
                heatIndex: data.current.heatindex_c,
                dewPoint: data.current.dewpoint_c,
                gustSpeed: Math.round(data.current.gust_kph),
                airQuality: data.current.air_quality ? {
                    pm25: data.current.air_quality.pm2_5,
                    pm10: data.current.air_quality.pm10,
                    co: data.current.air_quality.co,
                    no2: data.current.air_quality.no2,
                    o3: data.current.air_quality.o3,
                    so2: data.current.air_quality.so2,
                    usEpaIndex: data.current.air_quality['us-epa-index'],
                    gbDefraIndex: data.current.air_quality['gb-defra-index']
                } : null,
                alerts: [] // Will be populated separately if needed
            });
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            // Show error message to user
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setMessage(`Weather Error: ${errorMessage}`);
            
            // Fallback weather data
            setWeather({
                temperature: 28,
                condition: "Clear",
                description: "clear sky",
                humidity: 65,
                windSpeed: 12,
                windDirection: "NW",
                pressure: 1013,
                visibility: 10,
                uvIndex: 5,
                location: useManualLocation ? manualLocation || "Unknown Location" : "Campus Area",
                country: "India",
                state: "Delhi",
                lastUpdated: new Date().toISOString(),
                forecast: [],
                feelsLike: 30,
                cloudCover: 0,
                precipitation: 0,
                airQuality: null,
                alerts: []
            });
        }
        setWeatherLoading(false);
    };

    // Load data on component mount
    useEffect(() => {
        fetchNews();
        fetchWeather();
        
        // Refresh news every 5 minutes
        const newsInterval = setInterval(fetchNews, 300000);
        // Refresh weather every 30 minutes
        const weatherInterval = setInterval(fetchWeather, 1800000 );
        
        return () => {
            clearInterval(newsInterval);
            clearInterval(weatherInterval);
        };
    }, []);

    const handleEmergencyReport = async () => {
        if (!reportForm.type || !reportForm.location || !reportForm.description) {
            setMessage("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/emergency-reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportForm)
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                setMessage("🚨 Emergency report submitted successfully! Help is on the way.");
                setReportForm({ type: '', location: '', description: '', reporterName: '', reporterPhone: '' });
                setShowReportModal(false);
            } else {
                const errorMessage = data.message || data.errors?.[0]?.msg || 'Report submission failed';
                setMessage(`❌ ${errorMessage}`);
            }
        } catch (error) {
            console.error('Emergency report error:', error);
            setMessage("❌ Network error. Please check your connection and try again.");
        }
        setLoading(false);
    };

    const handleSubscribe = async () => {
        if (!subscribeForm.email) {
            setMessage("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscribeForm)
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                setMessage("✅ Successfully subscribed to emergency alerts!");
                setSubscribeForm({ email: '', name: '', phone: '', location: '', alertTypes: ['general'] });
                setShowSubscribeModal(false);
            } else {
                // Handle specific error messages from backend
                const errorMessage = data.message || data.errors?.[0]?.msg || 'Subscription failed';
                setMessage(`❌ ${errorMessage}`);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            setMessage("❌ Network error. Please check your connection and try again.");
        }
        setLoading(false);
    };

    const handleJoinCommunity = async () => {
        if (!communityForm.name || !communityForm.email || !communityForm.phone || !communityForm.location) {
            setMessage("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/community/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(communityForm)
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                setMessage("🤝 Successfully joined the community! We'll verify your details and contact you soon.");
                setCommunityForm({ name: '', email: '', phone: '', location: '', skills: [], availability: 'anytime', volunteerType: 'general', experience: 'Beginner' });
                setShowCommunityModal(false);
            } else {
                const errorMessage = data.message || data.errors?.[0]?.msg || 'Community join failed';
                setMessage(`❌ ${errorMessage}`);
            }
        } catch (error) {
            console.error('Community join error:', error);
            setMessage("❌ Network error. Please check your connection and try again.");
        }
        setLoading(false);
    };

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl">🛡️</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">SurakshaSetu</h1>
                                <p className="text-sm text-gray-600">Emergency Response System</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link 
                                to="/user" 
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition"
                            >
                                User Login
                            </Link>
                            <Link 
                                to="/admin" 
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
                            >
                                Admin Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Display */}
            {message && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className={`p-4 rounded-lg ${
                        message.includes('Error') ? 'bg-red-50 border border-red-200 text-red-700' : 
                        'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                        <p className="text-center">{message}</p>
                        <button 
                            onClick={() => setMessage("")}
                            className="float-right text-sm underline"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Stay Safe, Stay Connected
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        SurakshaSetu provides real-time emergency alerts, community support, and rapid response coordination to keep you and your community safe.
                    </p>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                            <div className="text-4xl mb-4">🚨</div>
                            <h3 className="text-lg font-semibold mb-2">Report Emergency</h3>
                            <p className="text-gray-600 text-sm mb-4">Quickly report emergencies and get immediate help</p>
                            <button 
                                onClick={() => setShowReportModal(true)}
                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold transform hover:scale-105 active:scale-95"
                            >
                                Report Now
                            </button>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                            <div className="text-4xl mb-4">📱</div>
                            <h3 className="text-lg font-semibold mb-2">Get Alerts</h3>
                            <p className="text-gray-600 text-sm mb-4">Receive real-time emergency notifications</p>
                            <button 
                                onClick={() => setShowSubscribeModal(true)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold transform hover:scale-105 active:scale-95"
                            >
                                Subscribe
                            </button>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                            <div className="text-4xl mb-4">👥</div>
                            <h3 className="text-lg font-semibold mb-2">Community</h3>
                            <p className="text-gray-600 text-sm mb-4">Connect with local volunteers and helpers</p>
                            <button 
                                onClick={() => setShowCommunityModal(true)}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold transform hover:scale-105 active:scale-95"
                            >
                                Join Community
                            </button>
                        </div>
                    </div>
                </div>

                {/* News and Weather Section */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Real-time News Section */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <span className="text-2xl mr-2">📰</span>
                                Real-time News
                            </h3>
                            <button 
                                onClick={fetchNews}
                                disabled={newsLoading}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition disabled:opacity-50 text-sm"
                            >
                                {newsLoading ? '⏳' : '🔄'} Refresh
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {newsLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-2">Loading news...</p>
                                </div>
                            ) : news.length > 0 ? (
                                news.slice(0, 3).map((article) => (
                                    <div key={article.id} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                                                    {article.title}
                                                </h4>
                                                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                                                    {article.summary}
                                                </p>
                                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                        {article.category}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{article.source}</span>
                                                    <span>•</span>
                                                    <span>{new Date(article.publishedAt).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="text-4xl mb-2 block">📰</span>
                                    <p>No news available at the moment</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-500 text-center">
                                Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    {/* Weather Report Section */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <span className="text-2xl mr-2">🌤️</span>
                                Daily Weather Report
                            </h3>
                            <button 
                                onClick={() => fetchWeather()}
                                disabled={weatherLoading}
                                className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition disabled:opacity-50 text-sm"
                            >
                                {weatherLoading ? '⏳' : '🔄'} Update
                            </button>
                        </div>

                        {/* Location Input Section */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-gray-800">📍 Location Settings</h4>
                                <div className="flex items-center space-x-2">
                                    <label className="flex items-center text-sm">
                                        <input
                                            type="radio"
                                            name="locationMode"
                                            checked={!useManualLocation}
                                            onChange={() => setUseManualLocation(false)}
                                            className="mr-2"
                                        />
                                        Current Location
                                    </label>
                                    <label className="flex items-center text-sm">
                                        <input
                                            type="radio"
                                            name="locationMode"
                                            checked={useManualLocation}
                                            onChange={() => setUseManualLocation(true)}
                                            className="mr-2"
                                        />
                                        Enter Location
                                    </label>
                                </div>
                            </div>
                            
                            {useManualLocation && (
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Enter city name (e.g., New York, London, Mumbai)"
                                        value={manualLocation}
                                        onChange={(e) => setManualLocation(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && manualLocation.trim()) {
                                                fetchWeather();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => fetchWeather()}
                                        disabled={weatherLoading || !manualLocation.trim()}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {weatherLoading ? '⏳' : '🔍'} Search
                                    </button>
                                </div>
                            )}
                            
                            {!useManualLocation && (
                                <div className="text-sm text-gray-600">
                                    🌍 Using your current location for weather data
                                </div>
                            )}
                            
                            {/* Popular Locations */}
                            <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-2">Popular locations:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['New York', 'London', 'Mumbai', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore'].map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => {
                                                setManualLocation(city);
                                                setUseManualLocation(true);
                                                setTimeout(() => fetchWeather(), 100);
                                            }}
                                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {weatherLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Loading weather...</p>
                            </div>
                        ) : weather ? (
                            <div className="space-y-4">
                                {/* Main Weather Info */}
                                <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                                    <div className="text-4xl mb-2">
                                        {weather.condition?.toLowerCase().includes('sunny') || weather.condition?.toLowerCase().includes('clear') ? '☀️' :
                                         weather.condition?.toLowerCase().includes('cloud') ? '☁️' :
                                         weather.condition?.toLowerCase().includes('rain') ? '🌧️' :
                                         weather.condition?.toLowerCase().includes('thunder') ? '⛈️' :
                                         weather.condition?.toLowerCase().includes('snow') ? '❄️' :
                                         weather.condition?.toLowerCase().includes('fog') ? '🌫️' : '🌤️'}
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">
                                        {weather.temperature}°C
                                    </div>
                                    <div className="text-lg text-gray-600 capitalize mb-2">
                                        {weather.description}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        📍 {weather.location}{weather.state ? `, ${weather.state}` : ''}{weather.country ? `, ${weather.country}` : ''}
                                    </div>
                                </div>
                                
                                {/* Weather Details Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {weather.humidity}%
                                        </div>
                                        <div className="text-xs text-gray-600">💧 Humidity</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {weather.windSpeed} km/h
                                        </div>
                                        <div className="text-xs text-gray-600">💨 Wind Speed</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {weather.pressure} mb
                                        </div>
                                        <div className="text-xs text-gray-600">📊 Pressure</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <div className="text-lg font-semibold text-gray-900">
                                            {weather.visibility} km
                                        </div>
                                        <div className="text-xs text-gray-600">👁️ Visibility</div>
                                    </div>
                                </div>

                                {/* Additional WeatherAPI Data */}
                                <div className="grid grid-cols-2 gap-3">
                                    {weather.feelsLike && (
                                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                                            <div className="text-lg font-semibold text-blue-900">
                                                {weather.feelsLike}°C
                                            </div>
                                            <div className="text-xs text-blue-700">🌡️ Feels Like</div>
                                        </div>
                                    )}
                                    {weather.cloudCover !== undefined && (
                                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                                            <div className="text-lg font-semibold text-gray-900">
                                                {weather.cloudCover}%
                                            </div>
                                            <div className="text-xs text-gray-600">☁️ Cloud Cover</div>
                                        </div>
                                    )}
                                    {weather.precipitation !== undefined && (
                                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                                            <div className="text-lg font-semibold text-blue-900">
                                                {weather.precipitation} mm
                                            </div>
                                            <div className="text-xs text-blue-700">🌧️ Precipitation</div>
                                        </div>
                                    )}
                                    {weather.gustSpeed && (
                                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                                            <div className="text-lg font-semibold text-orange-900">
                                                {weather.gustSpeed} km/h
                                            </div>
                                            <div className="text-xs text-orange-700">💨 Wind Gust</div>
                                        </div>
                                    )}
                                    {weather.dewPoint !== undefined && (
                                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                                            <div className="text-lg font-semibold text-purple-900">
                                                {Math.round(weather.dewPoint)}°C
                                            </div>
                                            <div className="text-xs text-purple-700">💧 Dew Point</div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Weather Metrics */}
                                {(weather.heatIndex !== undefined || weather.windChill !== undefined) && (
                                    <div className="grid grid-cols-2 gap-3">
                                        {weather.heatIndex !== undefined && (
                                            <div className="bg-red-50 rounded-lg p-3 text-center">
                                                <div className="text-lg font-semibold text-red-900">
                                                    {Math.round(weather.heatIndex)}°C
                                                </div>
                                                <div className="text-xs text-red-700">🔥 Heat Index</div>
                                            </div>
                                        )}
                                        {weather.windChill !== undefined && (
                                            <div className="bg-cyan-50 rounded-lg p-3 text-center">
                                                <div className="text-lg font-semibold text-cyan-900">
                                                    {Math.round(weather.windChill)}°C
                                                </div>
                                                <div className="text-xs text-cyan-700">❄️ Wind Chill</div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Wind Direction */}
                                {weather.windDirection && (
                                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                                        <div className="text-sm font-semibold text-blue-800">
                                            Wind Direction: {weather.windDirection}
                                        </div>
                                    </div>
                                )}

                                {/* UV Index */}
                                {weather.uvIndex !== undefined && (
                                    <div className={`rounded-lg p-3 text-center ${
                                        weather.uvIndex <= 2 ? 'bg-green-50' :
                                        weather.uvIndex <= 5 ? 'bg-yellow-50' :
                                        weather.uvIndex <= 7 ? 'bg-orange-50' :
                                        weather.uvIndex <= 10 ? 'bg-red-50' : 'bg-purple-50'
                                    }`}>
                                        <div className={`text-lg font-semibold ${
                                            weather.uvIndex <= 2 ? 'text-green-800' :
                                            weather.uvIndex <= 5 ? 'text-yellow-800' :
                                            weather.uvIndex <= 7 ? 'text-orange-800' :
                                            weather.uvIndex <= 10 ? 'text-red-800' : 'text-purple-800'
                                        }`}>
                                            UV Index: {weather.uvIndex}
                                        </div>
                                        <div className={`text-xs ${
                                            weather.uvIndex <= 2 ? 'text-green-700' :
                                            weather.uvIndex <= 5 ? 'text-yellow-700' :
                                            weather.uvIndex <= 7 ? 'text-orange-700' :
                                            weather.uvIndex <= 10 ? 'text-red-700' : 'text-purple-700'
                                        }`}>
                                            {weather.uvIndex <= 2 ? 'Low' :
                                             weather.uvIndex <= 5 ? 'Moderate' :
                                             weather.uvIndex <= 7 ? 'High' :
                                             weather.uvIndex <= 10 ? 'Very High' : 'Extreme'}
                                        </div>
                                    </div>
                                )}

                                {/* 3-Day Forecast */}
                                {weather.forecast && weather.forecast.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-sm font-semibold text-gray-800 mb-2">3-Day Forecast</div>
                                        <div className="space-y-2">
                                            {weather.forecast.map((day: ForecastDay, index: number) => (
                                                <div key={index} className="flex items-center justify-between text-xs">
                                                    <span className="font-medium">
                                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                    </span>
                                                    <span className="text-gray-600">{day.condition}</span>
                                                    <span className="font-semibold">
                                                        {day.high}°/{day.low}°
                                                    </span>
                                                    <span className="text-blue-600">
                                                        {day.precipitation}% 🌧️
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Air Quality Index */}
                                {weather.airQuality && (
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <div className="text-sm font-semibold text-green-800 mb-2">🌬️ Air Quality</div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex justify-between">
                                                <span>PM2.5:</span>
                                                <span className="font-semibold">{weather.airQuality.pm25} μg/m³</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>PM10:</span>
                                                <span className="font-semibold">{weather.airQuality.pm10} μg/m³</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>CO:</span>
                                                <span className="font-semibold">{weather.airQuality.co} μg/m³</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>NO₂:</span>
                                                <span className="font-semibold">{weather.airQuality.no2} μg/m³</span>
                                            </div>
                                        </div>
                                        {weather.airQuality.usEpaIndex && (
                                            <div className="mt-2 text-xs text-green-700">
                                                EPA Index: {weather.airQuality.usEpaIndex}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Weather Alerts */}
                                {weather.alerts && weather.alerts.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="text-sm font-semibold text-red-800 mb-2">⚠️ Weather Alerts</div>
                                        <div className="space-y-2">
                                            {weather.alerts.map((alert: WeatherAlert, index: number) => (
                                                <div key={index} className="text-xs text-red-700">
                                                    <div className="font-semibold">{alert.headline}</div>
                                                    <div className="mt-1">{alert.desc}</div>
                                                    <div className="text-red-600 mt-1">
                                                        Valid: {new Date(alert.effective).toLocaleString()} - {new Date(alert.expires).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Weather Alert */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-center">
                                        <span className="text-yellow-600 text-lg mr-2">⚠️</span>
                                        <div>
                                            <div className="text-sm font-semibold text-yellow-800">
                                                Weather Advisory
                                            </div>
                                            <div className="text-xs text-yellow-700">
                                                {weather.condition?.toLowerCase().includes('rain') || weather.condition?.toLowerCase().includes('thunder') 
                                                    ? 'Stay indoors during severe weather. Avoid outdoor activities.'
                                                    : weather.condition?.toLowerCase().includes('clear') || weather.condition?.toLowerCase().includes('sunny')
                                                    ? 'Perfect weather for outdoor activities. Stay hydrated and use sunscreen.'
                                                    : weather.uvIndex > 7
                                                    ? 'High UV index detected. Use sunscreen and limit sun exposure.'
                                                    : 'Monitor weather conditions for any changes.'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <span className="text-4xl mb-2 block">🌤️</span>
                                <p>Weather data unavailable</p>
                            </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-500 text-center">
                                Last updated: {new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Emergency Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">🚨 Report Emergency</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Emergency Type *</label>
                                <select 
                                    value={reportForm.type}
                                    onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    aria-label="Emergency Type"
                                >
                                    <option value="">Select type</option>
                                    <option value="fire">🔥 Fire</option>
                                    <option value="flood">🌊 Flood</option>
                                    <option value="earthquake">🌍 Earthquake</option>
                                    <option value="medical">🏥 Medical</option>
                                    <option value="security">🚨 Security</option>
                                    <option value="other">⚠️ Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location *</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter location"
                                    value={reportForm.location}
                                    onChange={(e) => setReportForm({...reportForm, location: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description *</label>
                                <textarea 
                                    placeholder="Describe the emergency"
                                    value={reportForm.description}
                                    onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                                    rows={3}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Name (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="Your name"
                                    value={reportForm.reporterName}
                                    onChange={(e) => setReportForm({...reportForm, reporterName: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
                                <input 
                                    type="tel" 
                                    placeholder="Your phone number"
                                    value={reportForm.reporterPhone}
                                    onChange={(e) => setReportForm({...reportForm, reporterPhone: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button 
                                onClick={handleEmergencyReport}
                                disabled={loading}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </button>
                            <button 
                                onClick={() => setShowReportModal(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscribe Modal */}
            {showSubscribeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">📱 Subscribe to Alerts</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input 
                                    type="email" 
                                    placeholder="your@email.com"
                                    value={subscribeForm.email}
                                    onChange={(e) => setSubscribeForm({...subscribeForm, email: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Name (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="Your name"
                                    value={subscribeForm.name}
                                    onChange={(e) => setSubscribeForm({...subscribeForm, name: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
                                <input 
                                    type="tel" 
                                    placeholder="Your phone number"
                                    value={subscribeForm.phone}
                                    onChange={(e) => setSubscribeForm({...subscribeForm, phone: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location (Optional)</label>
                                <input 
                                    type="text" 
                                    placeholder="Your location"
                                    value={subscribeForm.location}
                                    onChange={(e) => setSubscribeForm({...subscribeForm, location: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button 
                                onClick={handleSubscribe}
                                disabled={loading}
                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                            <button 
                                onClick={() => setShowSubscribeModal(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Community Modal */}
            {showCommunityModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">👥 Join Community</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name *</label>
                                <input 
                                    type="text" 
                                    placeholder="Your full name"
                                    value={communityForm.name}
                                    onChange={(e) => setCommunityForm({...communityForm, name: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input 
                                    type="email" 
                                    placeholder="your@email.com"
                                    value={communityForm.email}
                                    onChange={(e) => setCommunityForm({...communityForm, email: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone *</label>
                                <input 
                                    type="tel" 
                                    placeholder="Your phone number"
                                    value={communityForm.phone}
                                    onChange={(e) => setCommunityForm({...communityForm, phone: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location *</label>
                                <input 
                                    type="text" 
                                    placeholder="Your location"
                                    value={communityForm.location}
                                    onChange={(e) => setCommunityForm({...communityForm, location: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Volunteer Type</label>
                                <select 
                                    value={communityForm.volunteerType}
                                    onChange={(e) => setCommunityForm({...communityForm, volunteerType: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    aria-label="Volunteer Type"
                                >
                                    <option value="general">General Helper</option>
                                    <option value="first_aid">First Aid</option>
                                    <option value="rescue">Rescue Operations</option>
                                    <option value="communication">Communication</option>
                                    <option value="logistics">Logistics</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Availability</label>
                                <select 
                                    value={communityForm.availability}
                                    onChange={(e) => setCommunityForm({...communityForm, availability: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    aria-label="Availability"
                                >
                                    <option value="anytime">Anytime</option>
                                    <option value="weekdays">Weekdays</option>
                                    <option value="weekends">Weekends</option>
                                    <option value="emergency_only">Emergency Only</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button 
                                onClick={handleJoinCommunity}
                                disabled={loading}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading ? 'Joining...' : 'Join Community'}
                            </button>
                            <button 
                                onClick={() => setShowCommunityModal(false)}
                                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Key Features Section - Moved to Bottom */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h4 className="font-semibold mb-2">Rapid Response</h4>
                        <p className="text-sm text-gray-600">Instant emergency alerts and quick response coordination</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📍</span>
                        </div>
                        <h4 className="font-semibold mb-2">Location Tracking</h4>
                        <p className="text-sm text-gray-600">Precise location services for accurate emergency response</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔔</span>
                        </div>
                        <h4 className="font-semibold mb-2">Smart Notifications</h4>
                        <p className="text-sm text-gray-600">Intelligent alert system with priority-based messaging</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🤝</span>
                        </div>
                        <h4 className="font-semibold mb-2">Community Support</h4>
                        <p className="text-sm text-gray-600">Connect with local volunteers and emergency services</p>
                    </div>
                </div>
            </div>

    </div>
  );
}
