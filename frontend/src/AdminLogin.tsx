import { useState } from "react";
import { Link } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.tsx";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        if (username === "admin" && password === "password") {
            setIsLoggedIn(true);
            setError("");
        } else {
            setError("❌ Invalid credentials. Try admin / password");
        }
    };

    if (isLoggedIn) return <AdminDashboard />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50">
            <Link 
                to="/" 
                className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                ← Back to Main UI
            </Link>
            
            <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
                    🖥️ Admin Login
                </h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {error && <p className="text-red-600 mb-3">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
