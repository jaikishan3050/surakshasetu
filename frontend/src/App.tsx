import { Routes, Route } from "react-router-dom";
import SurakshaSetuUI from "./SurakshaSetuUI.tsx";
import AdminLogin from "./AdminLogin.tsx";
import AdminDashboard from "./AdminDashboard.tsx";
import UserLogin from "./UserLogin.tsx";
import UserDashboard from "./UserDashboard.tsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SurakshaSetuUI />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/user" element={<UserLogin />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
    </Routes>
  );
}

