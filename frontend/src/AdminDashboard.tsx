import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Types for Admin Dashboard
interface EmergencyReport {
    _id: string;
    type: string;
    location: string;
    description: string;
    reporterName: string;
    reporterPhone: string;
    severity: string;
    status: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    reportedAt: string;
    verifiedAt?: string;
    verifiedBy?: string;
    notes?: string;
}

interface DashboardStats {
    totalReports: number;
    pendingReports: number;
    verifiedReports: number;
    criticalReports: number;
    todayReports: number;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [reports, setReports] = useState<EmergencyReport[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalReports: 0,
        pendingReports: 0,
        verifiedReports: 0,
        criticalReports: 0,
        todayReports: 0
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);

    const API_BASE = 'http://localhost:5002/api';

    // Fetch emergency reports from backend
    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/data/emergency-reports`);
            const data = await response.json();
            
            if (data.success) {
                setReports(data.data || []);
                updateStats(data.data || []);
                setMessage('📊 Reports loaded successfully!');
            } else {
                setMessage('❌ Failed to load reports: ' + data.message);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            setMessage('❌ Error loading reports: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    // Update dashboard statistics
    const updateStats = (reportsData: EmergencyReport[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayReports = reportsData.filter(report => 
            new Date(report.reportedAt) >= today
        ).length;

        const pendingReports = reportsData.filter(report => 
            report.status === 'pending' || report.status === 'new'
        ).length;

        const verifiedReports = reportsData.filter(report => 
            report.status === 'verified' || report.status === 'resolved'
        ).length;

        const criticalReports = reportsData.filter(report => 
            report.severity === 'critical' || report.severity === 'high'
        ).length;

        setStats({
            totalReports: reportsData.length,
            pendingReports,
            verifiedReports,
            criticalReports,
            todayReports
        });
    };

    // Verify a report
    const verifyReport = async (reportId: string) => {
        try {
            const response = await fetch(`${API_BASE}/emergency-reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'verified',
                    verifiedAt: new Date().toISOString(),
                    verifiedBy: 'Admin'
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage('✅ Report verified successfully!');
                fetchReports(); // Refresh reports
            } else {
                setMessage('❌ Failed to verify report: ' + data.message);
            }
        } catch (error) {
            setMessage('❌ Error verifying report: ' + (error as Error).message);
        }
    };

    // View report details
    const viewReportDetails = (report: EmergencyReport) => {
        setSelectedReport(report);
        setShowReportModal(true);
    };

    // View report on map
    const viewReportOnMap = (report: EmergencyReport) => {
        if (report.coordinates) {
            const { latitude, longitude } = report.coordinates;
            const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(mapUrl, '_blank');
            setMessage(`📍 Opening map for ${report.location}...`);
        } else {
            setMessage('❌ No coordinates available for this report');
        }
    };

    // Load reports on component mount
    useEffect(() => {
        fetchReports();
        
        // Refresh reports every 30 seconds
        const interval = setInterval(fetchReports, 30000);
        return () => clearInterval(interval);
    }, []);

    const statsCards = [
        {
            title: 'Total Reports',
            value: stats.totalReports.toString(),
            change: `${stats.todayReports} today`,
            icon: '📊',
            color: 'bg-blue-50 border-blue-200 text-blue-700'
        },
        {
            title: 'Pending Reports',
            value: stats.pendingReports.toString(),
            change: 'Needs attention',
            icon: '⏳',
            color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
        },
        {
            title: 'Critical Reports',
            value: stats.criticalReports.toString(),
            change: 'High priority',
            icon: '🚨',
            color: 'bg-red-50 border-red-200 text-red-700'
        },
        {
            title: 'Verified Reports',
            value: stats.verifiedReports.toString(),
            change: 'Resolved',
            icon: '✅',
            color: 'bg-green-50 border-green-200 text-green-700'
        }
    ];


  return (
        <div className="min-h-screen bg-gray-50">
            {/* Message Display */}
            {message && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 mx-6 mt-4 rounded-lg">
                    {message}
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link 
                            to="/" 
                            className="p-2 hover:bg-white/20 rounded-lg transition"
                        >
                            ←
                        </Link>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            🛡️
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">SurakshaSetu Admin</h1>
                            <p className="text-white/80 text-sm">Emergency Management Center</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button 
                            onClick={fetchReports}
                            disabled={loading}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? '⏳' : '🔄'} Refresh Reports
                        </button>
                        <button 
                            onClick={() => setActiveTab('alerts')}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
                        >
                            📢 Post Alert
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-200 rounded-lg p-1">
                        {['overview', 'reports', 'alerts', 'analytics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-2 rounded-md transition text-sm font-medium ${
                                    activeTab === tab
                                        ? 'bg-white text-blue-600 shadow-sm'
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
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {statsCards.map((stat, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${stat.color}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium opacity-75">{stat.title}</p>
                                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                            <p className="text-xs opacity-75 mt-1">{stat.change}</p>
                                        </div>
                                        <div className="text-2xl">
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Reports */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">Recent Reports</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-gray-500 mt-2">Loading reports...</p>
                                    </div>
                                ) : reports.length > 0 ? (
                                    reports.slice(0, 5).map((report) => (
                                        <div key={report._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                             onClick={() => viewReportDetails(report)}>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                    <span className="font-medium capitalize">{report.type}</span>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                        report.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                                        report.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                    {report.severity}
                                                </span>
                                            </div>
                                                <p className="text-sm text-gray-600">{report.location} • {new Date(report.reportedAt).toLocaleString()}</p>
                                                {report.reporterName && (
                                                    <p className="text-xs text-gray-500">Reported by: {report.reporterName}</p>
                                                )}
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            report.status === 'verified' ? 'bg-green-100 text-green-700' :
                                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                report.status === 'resolved' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                            {report.status}
                                        </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <span className="text-4xl mb-2 block">📊</span>
                                        <p>No reports available</p>
                                        <p className="text-sm">Reports will appear here when users submit them</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">All Emergency Reports</h3>
                                    <button 
                                        onClick={fetchReports}
                                        disabled={loading}
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition disabled:opacity-50"
                                    >
                                        {loading ? '⏳' : '🔄'} Refresh
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="text-gray-500 mt-2">Loading reports...</p>
                                    </div>
                                ) : reports.length > 0 ? (
                                    reports.map((report) => (
                                        <div key={report._id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition">
                                        <div className="flex items-center justify-between">
                                                <h4 className="font-medium capitalize">{report.type} Incident</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                report.status === 'verified' ? 'bg-green-100 text-green-700' :
                                                report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    report.status === 'resolved' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                                {report.status}
                                            </span>
                                        </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <p><strong>Location:</strong> {report.location}</p>
                                                <p><strong>Severity:</strong> 
                                                    <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                                                        report.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                                        report.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                        {report.severity}
                                                    </span>
                                                </p>
                                                <p><strong>Reported:</strong> {new Date(report.reportedAt).toLocaleString()}</p>
                                                {report.reporterName && (
                                                    <p><strong>Reporter:</strong> {report.reporterName}</p>
                                                )}
                                            </div>
                                            {report.description && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-700"><strong>Description:</strong> {report.description}</p>
                                                </div>
                                            )}
                                        <div className="flex space-x-2 mt-3">
                                                <button 
                                                    onClick={() => viewReportDetails(report)}
                                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                                                >
                                                    📋 View Details
                                                </button>
                                                {report.status === 'pending' && (
                                                    <button 
                                                        onClick={() => verifyReport(report._id)}
                                                        className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 transition"
                                                    >
                                                        ✅ Verify
                                                    </button>
                                                )}
                                                {report.coordinates && (
                                                    <button 
                                                        onClick={() => viewReportOnMap(report)}
                                                        className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition"
                                                    >
                                                        📍 View Map
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <span className="text-4xl mb-2 block">📊</span>
                                        <p>No reports available</p>
                                        <p className="text-sm">Emergency reports will appear here when users submit them</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Alerts Tab */}
                {activeTab === 'alerts' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">📢 Post Emergency Alert</h3>
                                <p className="text-sm text-gray-600 mt-1">Send alerts to all users and community members</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                                            <select 
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                aria-label="Alert Type"
                                            >
                                                <option value="">Select alert type</option>
                                                <option value="fire">🔥 Fire Emergency</option>
                                                <option value="flood">🌊 Flood Warning</option>
                                                <option value="earthquake">🌍 Earthquake Alert</option>
                                                <option value="weather">🌤️ Weather Warning</option>
                                                <option value="security">🚨 Security Alert</option>
                                                <option value="general">📢 General Announcement</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                                            <select 
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                aria-label="Severity Level"
                                            >
                                                <option value="low">🟢 Low</option>
                                                <option value="medium">🟡 Medium</option>
                                                <option value="high">🟠 High</option>
                                                <option value="critical">🔴 Critical</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Affected Areas</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g., Downtown, Campus, Residential Area"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Message</label>
                                            <textarea 
                                                placeholder="Enter the emergency alert message..."
                                                rows={6}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
                                                🚨 Send Alert
                                            </button>
                                            <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                                                Preview
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Alerts */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">Recent Alerts</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">Fire Emergency</span>
                                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Critical</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Downtown Area • 2 hours ago</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Sent</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium">Weather Warning</span>
                                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Medium</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Campus Wide • 1 day ago</p>
                                    </div>
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Sent</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">System Analytics</h3>
                            </div>
                            <div className="p-8 text-center">
                                <div className="text-6xl mb-4">📊</div>
                                <p className="text-gray-600">Analytics dashboard coming soon</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Report Details Modal */}
            {showReportModal && selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Emergency Report Details</h3>
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Close
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Type</label>
                                    <p className="p-2 bg-gray-50 rounded-lg capitalize">{selectedReport.type}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                                        selectedReport.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                        selectedReport.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                        selectedReport.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {selectedReport.severity}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <p className="p-2 bg-gray-50 rounded-lg">{selectedReport.location}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                                        selectedReport.status === 'verified' ? 'bg-green-100 text-green-700' :
                                        selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        selectedReport.status === 'resolved' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {selectedReport.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <p className="p-3 bg-gray-50 rounded-lg min-h-[100px]">{selectedReport.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Name</label>
                                    <p className="p-2 bg-gray-50 rounded-lg">{selectedReport.reporterName || 'Anonymous'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reporter Phone</label>
                                    <p className="p-2 bg-gray-50 rounded-lg">{selectedReport.reporterPhone || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reported At</label>
                                    <p className="p-2 bg-gray-50 rounded-lg">{new Date(selectedReport.reportedAt).toLocaleString()}</p>
                                </div>
                                {selectedReport.verifiedAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Verified At</label>
                                        <p className="p-2 bg-gray-50 rounded-lg">{new Date(selectedReport.verifiedAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            {selectedReport.coordinates && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                                    <p className="p-2 bg-gray-50 rounded-lg">
                                        Lat: {selectedReport.coordinates.latitude}, Lng: {selectedReport.coordinates.longitude}
                                    </p>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4 border-t">
                                {selectedReport.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            verifyReport(selectedReport._id);
                                            setShowReportModal(false);
                                        }}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                        ✅ Verify Report
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </div>
  );
}
