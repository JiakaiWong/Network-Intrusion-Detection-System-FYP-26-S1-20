import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Import the gatekeeper
import ProtectedRoute from "./components/ProtectedRoute";

// Shared Pages
import Login from "./pages/shared/Login";
import About from "./pages/shared/About";
import Features from "./pages/shared/Features";
import Demo from "./pages/shared/Demo";
import Register from "./pages/shared/Register";
import Visitor from "./pages/shared/Visitor";
import ForgetPassword from "./pages/shared/ForgotPassword";
import Logout from "./pages/shared/Logout";
import ForcePasswordChange from "./pages/shared/ForcePasswordChange";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/Profile";
import Settings from "./pages/admin/Settings";
import Usermanagement from "./pages/admin/UserManagement";
import AdminSidebar from "./pages/admin/AdminSidebar";
import DatabaseMaintenance from "./pages/admin/DatabaseMaintenance";

// Analyst Pages
import Dashboard from "./pages/analyst/Dashboard";
import Alerts from "./pages/analyst/Alerts";
import Reports from "./pages/analyst/Reports";
import AnalystProfile from "./pages/analyst/Profile";
import AlertDetails from "./pages/analyst/AlertDetails";
import NetworkTraffic from "./pages/analyst/NetworkTraffic";
import Notifications from "./pages/analyst/Notifications";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

function App() {
  const [logs, setLogs] = useState([]);

  // ── Fetch logs at the App level so all child routes share the same data ──
  const fetchLogs = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // not logged in yet, skip
    try {
      const res = await axios.get(`${API_BASE}/api/logs`, getAuthHeader());
      setLogs(res.data.items ?? res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch log sources:", err);
    }
  }, []);

  // Run once on mount (covers the case where the user is already logged in
  // e.g. refreshing the page while a session is active)
  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/"                element={<Visitor />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/about"           element={<About />} />
        <Route path="/features"        element={<Features />} />
        <Route path="/demo"            element={<Demo />} />
        <Route path="/forgotpassword"  element={<ForgetPassword />} />
        <Route path="/logout"          element={<Logout />} />
        <Route path="/force-password-change" element={<ForcePasswordChange />} />

        {/* --- PROTECTED ZONE --- */}
        <Route element={<ProtectedRoute />}>

          {/* Analyst Routes */}
          <Route path="/dashboard"       element={<Dashboard />} />
          <Route path="/alerts"          element={<Alerts />} />
          <Route path="/alert/:id"       element={<AlertDetails />} />
          <Route path="/reports"         element={<Reports />} />
          <Route path="/network-traffic" element={<NetworkTraffic />} />
          <Route path="/notifications"   element={<Notifications />} />
          <Route path="/analyst/profile" element={<AnalystProfile />} />
          <Route path="/profile"         element={<AnalystProfile />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminSidebar />}>
            <Route
              index
              element={
                // Pass onRefreshLogs so the Dashboard can also trigger a
                // re-fetch (e.g. after the user adds a new log source in
                // Settings and immediately navigates back to the dashboard)
                <AdminDashboard logs={logs} onRefreshLogs={fetchLogs} />
              }
            />
            <Route path="users"       element={<Usermanagement />} />
            <Route
              path="settings"
              element={
                // Settings still receives setLogs so it can update the
                // shared state when the user adds / removes a log source
                <Settings logs={logs} setLogs={setLogs} onRefreshLogs={fetchLogs} />
              }
            />
            <Route path="profile"     element={<AdminProfile />} />
            <Route path="maintenance" element={<DatabaseMaintenance />} />
            <Route path="logout"      element={<Logout />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;