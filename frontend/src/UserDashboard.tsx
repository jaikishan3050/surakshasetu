import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VirtualDrillGameLauncher from "./components/VirtualDrillGameLauncher";
import QuizLauncher from "./components/QuizLauncher";
import SafetyTipsModal from "./components/SafetyTipsModal";
import EmergencyContactsModal from "./components/EmergencyContactsModal";

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [showVirtualDrillModal, setShowVirtualDrillModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showSafetyTipsModal, setShowSafetyTipsModal] = useState(false);
    const [showEmergencyContactsModal, setShowEmergencyContactsModal] = useState(false);
    const [emergencyType, setEmergencyType] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
    const [recentAlerts, setRecentAlerts] = useState<Array<{
        id: string;
        type: string;
        location: string;
        time: string;
        status: string;
    }>>([]);

    const API_BASE = 'http://localhost:5002/api';

    // Get user's current location
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setMessage('📍 Location updated successfully!');
                },
                (error) => {
                    // Handle different geolocation errors gracefully
                    let errorMessage = '';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable. Please check your network connection and GPS settings.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out. Please try again.';
                            break;
                        default:
                            errorMessage = 'Unable to get location. Please try again or enter location manually.';
                            break;
                    }
                    setMessage('⚠️ ' + errorMessage);
                },
                {
                    timeout: 10000, // 10 second timeout
                    enableHighAccuracy: false, // Don't require GPS for faster response
                    maximumAge: 300000 // Accept 5-minute old location
                }
            );
        } else {
            setMessage('❌ Geolocation not supported by this browser. Please enter your location manually.');
        }
    };

    // Submit emergency report to backend
    const handleEmergencyReport = async () => {
        if (!emergencyType || !location || !description) {
            setMessage('❌ Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/emergency-reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: emergencyType,
                    location: location,
                    description: description,
                    reporterName: 'User',
                    severity: 'medium',
                    coordinates: userLocation
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                setMessage('✅ Emergency report submitted successfully!');
                setEmergencyType('');
                setLocation('');
                setDescription('');
            } else {
                const errorMessage = data.message || data.errors?.[0]?.msg || 'Unknown error occurred';
                setMessage('❌ Failed to submit report: ' + errorMessage);
            }
        } catch (error) {
            console.error('Report submission error:', error);
            setMessage('❌ Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get user's alerts
    const handleMyAlerts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/alerts`);
            const data = await response.json();
            
            if (data.success) {
                setRecentAlerts(data.data || []);
                setMessage('📱 Alerts loaded successfully!');
            } else {
                setMessage('❌ Failed to load alerts: ' + data.message);
            }
        } catch (error) {
            setMessage('❌ Error loading alerts: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };


    // Load safety tips
    const handleSafetyTips = () => {
        setShowSafetyTipsModal(true);
        setMessage('📚 Opening safety tips...');
    };

    // Load emergency contacts
    const handleEmergencyContacts = () => {
        setShowEmergencyContactsModal(true);
        setMessage('📞 Opening emergency contacts...');
    };

    // Load campus map
    const handleCampusMap = async () => {
        setLoading(true);
        try {
            // This would typically fetch from a maps API
            setMessage('🗺️ Campus map loaded! Emergency exits marked in red, assembly points in green.');
        } catch (error) {
            setMessage('❌ Error loading campus map: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };


    // Load initial data
    useEffect(() => {
        handleMyAlerts();
    }, []);

    const emergencyTypes = [
        { value: 'fire', label: '🔥 Fire', color: 'bg-red-100 text-red-700' },
        { value: 'flood', label: '🌊 Flood', color: 'bg-blue-100 text-blue-700' },
        { value: 'earthquake', label: '🌍 Earthquake', color: 'bg-yellow-100 text-yellow-700' },
        { value: 'medical', label: '🏥 Medical Emergency', color: 'bg-green-100 text-green-700' },
        { value: 'security', label: '🚨 Security Threat', color: 'bg-purple-100 text-purple-700' },
        { value: 'other', label: '⚠️ Other', color: 'bg-gray-100 text-gray-700' }
    ];


    const defaultAlerts = [
        {
            id: '1',
            type: 'Fire Drill',
            location: 'Main Building',
            time: '2 hours ago',
            status: 'completed'
        },
        {
            id: '2',
            type: 'Weather Alert',
            location: 'Campus Wide',
            time: '1 day ago',
            status: 'active'
        }
    ];

    const displayAlerts = recentAlerts.length > 0 ? recentAlerts : defaultAlerts;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Message Display */}
            {message && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 mx-6 mt-4 rounded-lg">
                    {message}
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link 
                            to="/" 
                            className="p-2 hover:bg-white/20 rounded-lg transition"
                        >
                            ←
                        </Link>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            👤
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">User Portal</h1>
                            <p className="text-white/80 text-sm">Emergency Response & Safety</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button 
                            onClick={handleMyAlerts}
                            disabled={loading}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? '⏳' : '📱'} My Alerts
                        </button>
                        <button 
                            onClick={getCurrentLocation}
                            disabled={loading}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? '⏳' : '📍'} My Location
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
                        {['overview', 'report', 'alerts', 'drill', 'quiz', 'safety'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-2 rounded-md transition text-sm font-medium ${
                                    activeTab === tab
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            <button 
                                onClick={() => setActiveTab('report')}
                                className="bg-red-50 border border-red-200 p-4 rounded-lg hover:bg-red-100 transition cursor-pointer transform hover:scale-105 active:scale-95"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-700">Emergency Report</p>
                                        <p className="text-xs text-red-600 mt-1">Report immediately</p>
                                    </div>
                                    <div className="text-2xl">🚨</div>
                                </div>
                            </button>
                            
                            <button 
                                onClick={handleSafetyTips}
                                disabled={loading}
                                className="bg-blue-50 border border-blue-200 p-4 rounded-lg hover:bg-blue-100 transition cursor-pointer disabled:opacity-50 transform hover:scale-105 active:scale-95 disabled:transform-none"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">Safety Tips</p>
                                        <p className="text-xs text-blue-600 mt-1">Learn safety</p>
                                    </div>
                                    <div className="text-2xl">📚</div>
                                </div>
                            </button>
                            
                            <button 
                                onClick={handleEmergencyContacts}
                                disabled={loading}
                                className="bg-green-50 border border-green-200 p-4 rounded-lg hover:bg-green-100 transition cursor-pointer disabled:opacity-50 transform hover:scale-105 active:scale-95 disabled:transform-none"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-700">Emergency Contacts</p>
                                        <p className="text-xs text-green-600 mt-1">Quick access</p>
                                    </div>
                                    <div className="text-2xl">📞</div>
                                </div>
                            </button>
                            
                            <button 
                                onClick={handleCampusMap}
                                disabled={loading}
                                className="bg-purple-50 border border-purple-200 p-4 rounded-lg hover:bg-purple-100 transition cursor-pointer disabled:opacity-50 transform hover:scale-105 active:scale-95 disabled:transform-none"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-700">Campus Map</p>
                                        <p className="text-xs text-purple-600 mt-1">Find exits</p>
                                    </div>
                                    <div className="text-2xl">🗺️</div>
                                </div>
                            </button>

                            <button 
                                onClick={() => setActiveTab('drill')}
                                className="bg-orange-50 border border-orange-200 p-4 rounded-lg hover:bg-orange-100 transition cursor-pointer transform hover:scale-105 active:scale-95"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-700">Virtual Drill</p>
                                        <p className="text-xs text-orange-600 mt-1">Practice safety</p>
                                    </div>
                                    <div className="text-2xl">🎯</div>
                                </div>
                            </button>

                            <button 
                                onClick={() => setShowQuizModal(true)}
                                className="bg-purple-50 border border-purple-200 p-4 rounded-lg hover:bg-purple-100 transition cursor-pointer transform hover:scale-105 active:scale-95"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-700">Safety Quiz</p>
                                        <p className="text-xs text-purple-600 mt-1">Test knowledge</p>
                                    </div>
                                    <div className="text-2xl">🧠</div>
                                </div>
                            </button>
                        </div>

                        {/* Recent Alerts */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">Recent Campus Alerts</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {displayAlerts.map((alert) => (
                                    <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{alert.type}</span>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    alert.status === 'active' ? 'bg-red-100 text-red-700' :
                                                    alert.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {alert.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">{alert.location} • {alert.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Tab */}
                {activeTab === 'report' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">Report Emergency</h3>
                                <p className="text-sm text-gray-600 mt-1">Fill out the form below to report an emergency</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Emergency Type
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {emergencyTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                onClick={() => setEmergencyType(type.value)}
                                                className={`p-3 rounded-lg border text-sm font-medium transition ${
                                                    emergencyType === type.value
                                                        ? `${type.color} border-current`
                                                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Main Building, Room 101"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Describe the emergency situation..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                                
                                <button
                                    onClick={handleEmergencyReport}
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition"
                                >
                                    🚨 Submit Emergency Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alerts Tab */}
                {activeTab === 'alerts' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">My Alert Settings</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium">Push Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive emergency alerts on your device</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium">SMS Alerts</h4>
                                        <p className="text-sm text-gray-600">Get emergency alerts via text message</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium">Email Notifications</h4>
                                        <p className="text-sm text-gray-600">Receive detailed alerts via email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Drill Tab */}
                {activeTab === 'drill' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">🎮 Virtual Emergency Drill Games</h3>
                                <p className="text-sm text-gray-600 mt-1">Practice emergency procedures through interactive 2D games</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🔥</div>
                                            <h4 className="font-semibold text-lg mb-2 text-red-800">Fire Emergency</h4>
                                            <p className="text-sm text-red-600 mb-4">Learn fire safety procedures and evacuation protocols</p>
                                            <button
                                                onClick={() => setShowVirtualDrillModal(true)}
                                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold transform hover:scale-105 active:scale-95"
                                            >
                                                Start Game
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🌍</div>
                                            <h4 className="font-semibold text-lg mb-2 text-yellow-800">Earthquake</h4>
                                            <p className="text-sm text-yellow-600 mb-4">Practice earthquake safety and building evacuation</p>
                                            <button
                                                onClick={() => setShowVirtualDrillModal(true)}
                                                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold transform hover:scale-105 active:scale-95"
                                            >
                                                Start Game
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🌊</div>
                                            <h4 className="font-semibold text-lg mb-2 text-blue-800">Flood Emergency</h4>
                                            <p className="text-sm text-blue-600 mb-4">Learn flood safety and evacuation procedures</p>
                                            <button
                                                onClick={() => setShowVirtualDrillModal(true)}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold transform hover:scale-105 active:scale-95"
                                            >
                                                Start Game
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🚨</div>
                                            <h4 className="font-semibold text-lg mb-2 text-purple-800">General Emergency</h4>
                                            <p className="text-sm text-purple-600 mb-4">Practice general emergency response procedures</p>
                                            <button
                                                onClick={() => setShowVirtualDrillModal(true)}
                                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold transform hover:scale-105 active:scale-95"
                                            >
                                                Start Game
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Game Features */}
                                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">🎮 Game Features</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-2xl">🎯</span>
                                            </div>
                                            <h5 className="font-semibold mb-2">Interactive Learning</h5>
                                            <p className="text-sm text-gray-600">Learn emergency procedures through hands-on gameplay</p>
                                        </div>
                                        
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-2xl">📊</span>
                                            </div>
                                            <h5 className="font-semibold mb-2">Progress Tracking</h5>
                                            <p className="text-sm text-gray-600">Track your performance and improvement over time</p>
                                        </div>
                                        
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <span className="text-2xl">🏆</span>
                                            </div>
                                            <h5 className="font-semibold mb-2">Achievement System</h5>
                                            <p className="text-sm text-gray-600">Earn points and badges for completing drills</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-800 mb-2">📋 How to Play</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Select a drill type to start the game</li>
                                        <li>• Use keyboard controls to navigate and interact</li>
                                        <li>• Follow on-screen instructions for each emergency scenario</li>
                                        <li>• Complete all objectives within the time limit</li>
                                        <li>• Your performance will be automatically saved</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quiz Tab */}
                {activeTab === 'quiz' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">🧠 Emergency Preparedness Quiz</h3>
                                <p className="text-sm text-gray-600 mt-1">Test your knowledge and improve your safety awareness</p>
                            </div>
                            <div className="p-6">
                                <div className="text-center mb-8">
                                    <div className="text-6xl mb-4">🎓</div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Ready to Test Your Knowledge?</h4>
                                    <p className="text-gray-600 max-w-2xl mx-auto">
                                        Challenge yourself with interactive quizzes covering fire safety, earthquake preparedness, 
                                        flood safety, medical emergencies, and general safety procedures. Learn through detailed explanations.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🎯</div>
                                            <h5 className="font-semibold text-lg mb-2 text-purple-800">Complete Quiz</h5>
                                            <p className="text-sm text-purple-600 mb-4">Test all emergency scenarios</p>
                                            <div className="text-xs text-purple-500 mb-4">15 Questions • Mixed Difficulty</div>
                                            <button
                                                onClick={() => setShowQuizModal(true)}
                                                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
                                            >
                                                Start Complete Quiz
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🔥</div>
                                            <h5 className="font-semibold text-lg mb-2 text-red-800">Fire Safety</h5>
                                            <p className="text-sm text-red-600 mb-4">Fire prevention and evacuation</p>
                                            <div className="text-xs text-red-500 mb-4">3 Questions • Easy to Hard</div>
                                            <button
                                                onClick={() => setShowQuizModal(true)}
                                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                                            >
                                                Start Fire Quiz
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🌍</div>
                                            <h5 className="font-semibold text-lg mb-2 text-yellow-800">Earthquake Safety</h5>
                                            <p className="text-sm text-yellow-600 mb-4">Earthquake preparedness</p>
                                            <div className="text-xs text-yellow-500 mb-4">3 Questions • Easy to Medium</div>
                                            <button
                                                onClick={() => setShowQuizModal(true)}
                                                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
                                            >
                                                Start Earthquake Quiz
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                    <h4 className="text-lg font-semibold text-blue-800 mb-4">📚 Learning Features</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Interactive multiple choice questions
                                            </div>
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Detailed explanations for each answer
                                            </div>
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Timer-based challenges
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Progress tracking and scoring
                                            </div>
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Category-specific quizzes
                                            </div>
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Automatic result saving
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => setShowQuizModal(true)}
                                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition font-semibold text-lg transform hover:scale-105"
                                    >
                                        🚀 Start Learning Quiz
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Safety Tips Tab */}
                {activeTab === 'safety' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">📚 Safety Tips & Guidelines</h3>
                                <p className="text-sm text-gray-600 mt-1">Essential safety information for emergency preparedness</p>
                            </div>
                            <div className="p-6">
                                <div className="text-center mb-8">
                                    <div className="text-6xl mb-4">🛡️</div>
                                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Your Safety Knowledge Hub</h4>
                                    <p className="text-gray-600 max-w-2xl mx-auto">
                                        Access comprehensive safety tips covering fire safety, earthquake preparedness, 
                                        flood safety, medical emergencies, security awareness, and general safety procedures.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🔥</div>
                                            <h5 className="font-semibold text-lg mb-2 text-red-800">Fire Safety</h5>
                                            <p className="text-sm text-red-600 mb-4">Prevention, evacuation, and fire extinguisher use</p>
                                            <div className="text-xs text-red-500 mb-4">3 Comprehensive Guides</div>
                                            <button
                                                onClick={() => setShowSafetyTipsModal(true)}
                                                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                                            >
                                                View Fire Safety Tips
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🌍</div>
                                            <h5 className="font-semibold text-lg mb-2 text-yellow-800">Earthquake Safety</h5>
                                            <p className="text-sm text-yellow-600 mb-4">Drop, cover, hold and post-earthquake procedures</p>
                                            <div className="text-xs text-yellow-500 mb-4">3 Detailed Guides</div>
                                            <button
                                                onClick={() => setShowSafetyTipsModal(true)}
                                                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
                                            >
                                                View Earthquake Tips
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🌊</div>
                                            <h5 className="font-semibold text-lg mb-2 text-blue-800">Flood Safety</h5>
                                            <p className="text-sm text-blue-600 mb-4">Preparedness, response, and recovery procedures</p>
                                            <div className="text-xs text-blue-500 mb-4">3 Essential Guides</div>
                                            <button
                                                onClick={() => setShowSafetyTipsModal(true)}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                                            >
                                                View Flood Safety Tips
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🏥</div>
                                            <h5 className="font-semibold text-lg mb-2 text-pink-800">Medical Emergency</h5>
                                            <p className="text-sm text-pink-600 mb-4">CPR, first aid, and emergency medical kit</p>
                                            <div className="text-xs text-pink-500 mb-4">3 Life-Saving Guides</div>
                                            <button
                                                onClick={() => setShowSafetyTipsModal(true)}
                                                className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-semibold"
                                            >
                                                View Medical Tips
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🛡️</div>
                                            <h5 className="font-semibold text-lg mb-2 text-gray-800">Security Awareness</h5>
                                            <p className="text-sm text-gray-600 mb-4">Personal security and active shooter response</p>
                                            <div className="text-xs text-gray-500 mb-4">2 Security Guides</div>
                                            <button
                                                onClick={() => setShowSafetyTipsModal(true)}
                                                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
                                            >
                                                View Security Tips
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">🛡️</div>
                                            <h5 className="font-semibold text-lg mb-2 text-green-800">General Safety</h5>
                                            <p className="text-sm text-green-600 mb-4">Emergency kits, family plans, and staying informed</p>
                                            <div className="text-xs text-green-500 mb-4">3 Preparedness Guides</div>
                                            <button
                                                onClick={() => setShowSafetyTipsModal(true)}
                                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                                            >
                                                View General Tips
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                    <h4 className="text-lg font-semibold text-blue-800 mb-4">📚 Safety Tips Features</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Comprehensive safety guidelines
                                            </div>
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Step-by-step procedures
                                            </div>
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Category-based organization
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Search and filter functionality
                                            </div>
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Priority-based tips
                                            </div>
                                            <div className="flex items-center text-sm text-blue-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                Easy-to-follow instructions
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => setShowSafetyTipsModal(true)}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg transform hover:scale-105"
                                    >
                                        📚 Browse All Safety Tips
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Virtual Drill Game Launcher Modal */}
            {showVirtualDrillModal && (
                <VirtualDrillGameLauncher
                    onClose={() => setShowVirtualDrillModal(false)}
                    studentId="user-demo"
                />
            )}

            {/* Quiz Launcher Modal */}
            {showQuizModal && (
                <QuizLauncher
                    onClose={() => setShowQuizModal(false)}
                    studentId="user-demo"
                />
            )}

            {/* Safety Tips Modal */}
            {showSafetyTipsModal && (
                <SafetyTipsModal
                    onClose={() => setShowSafetyTipsModal(false)}
                />
            )}

            {/* Emergency Contacts Modal */}
            {showEmergencyContactsModal && (
                <EmergencyContactsModal
                    onClose={() => setShowEmergencyContactsModal(false)}
                />
            )}
        </div>
    );
}
