import { useState } from "react";
import { Link } from "react-router-dom";
import UserDashboard from "./UserDashboard.tsx";

export default function UserLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("user");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        if (username === "user" && password === "password" && userType === "user") {
            setIsLoggedIn(true);
            setError("");
        } else if (username === "admin" && password === "password" && userType === "admin") {
            // Redirect to admin dashboard
            window.location.href = "/dashboard";
        } else {
            setError("❌ Invalid credentials. Try user/password or admin/password");
        }
    };

    if (isLoggedIn) return <UserDashboard />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">🛡️</span>
                    </div>
                    <h1 className="text-3xl font-bold text-purple-700 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to continue</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
                    
                    {/* User Type Selection */}
                    <div className="mb-6">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setUserType("user")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                                    userType === "user"
                                        ? "bg-white text-purple-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                User
                            </button>
                            <button
                                onClick={() => setUserType("admin")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                                    userType === "admin"
                                        ? "bg-white text-purple-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}
                        
                        <button
                            onClick={handleLogin}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
                        >
                            Login as {userType === "user" ? "User" : "Admin"}
                        </button>
                    </div>
                    
                    <div className="mt-6 text-center">
                        <Link to="/" className="text-purple-600 hover:text-purple-700 text-sm">
                            ← Back to Main UI
                        </Link>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Demo: <span className="font-mono bg-gray-100 px-2 py-1 rounded">user/password</span> or <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin/password</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
