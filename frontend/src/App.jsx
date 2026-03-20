import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

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

// Analyst Pages
import Dashboard from "./pages/analyst/Dashboard";
import Alerts from "./pages/analyst/Alerts";
import Reports from "./pages/analyst/Reports";
import AnalystProfile from "./pages/analyst/Profile";
import AlertDetails from "./pages/analyst/AlertDetails";
import NetworkTraffic from "./pages/analyst/NetworkTraffic";
import Notifications from "./pages/analyst/Notifications";

function App() {
  const [logs, setLogs] = useState([]);

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
        {/* Everything inside this Route element requires a token to be seen */}
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
            <Route index                 element={<AdminDashboard logs={logs} />} />
            <Route path="users"          element={<Usermanagement />} />
            <Route path="settings"       element={<Settings logs={logs} setLogs={setLogs} />} />
            <Route path="profile"        element={<AdminProfile />} />
            <Route path="logout"         element={<Logout />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;