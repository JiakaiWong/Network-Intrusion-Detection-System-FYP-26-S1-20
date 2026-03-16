import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/shared/Login";
import About from "./pages/shared/About";
import Features from "./pages/shared/Features";
import Demo from "./pages/shared/Demo";
import Register from "./pages/shared/Register";
import Visitor from "./pages/shared/Visitor";
import ForgetPassword from "./pages/shared/ForgotPassword";
import Logout from "./pages/shared/Logout";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/Profile";
import Settings from "./pages/admin/Settings";
import Usermanagement from "./pages/admin/UserManagement";
import Admin from "./pages/admin/AdminDashboard";
import Alerts from "./pages/analyst/Alerts";
import Reports from "./pages/analyst/Reports";
import AlertDetails from "./pages/analyst/AlertDetails";
import Profile from "./pages/analyst/Profile";
														  
										 
											   
									   
import NetworkTraffic from "./pages/analyst/NetworkTraffic";
import Notifications from "./pages/analyst/Notifications";
											  
														



// Shared logs state lives here so Settings and AdminDashboard stay in sync
const INITIAL_LOGS = [
  {
    id: 1,
    name: "Suricata Rules",
    type: "File based",
    logType: "JSON",
    status: "Active",
    lastUpdated: "28-Feb-2026 12:34",   
  },
  {
    id: 2,
    name: "Snort Office 360",
    type: "Syslog",
    logType: "TCP",
    status: "Active",
    lastUpdated: "28-Feb-2026 10:22",
  },
];

function App() {
  const [logs, setLogs] = useState(INITIAL_LOGS);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Visitor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/forgotpassword" element={<ForgetPassword />} />

        {/* Analyst Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
		<Route path="/reports" element={<Reports />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin" element={<Admin />} />											   										   
        <Route path="/network-traffic" element={<NetworkTraffic />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/analyst/profile" element={<AnalystProfile />} />															 
        <Route path="/alert/:id" element={<AlertDetails />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/logout" element={<Logout />} />
		
  

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard logs={logs} />} />
          <Route path="users" element={<Usermanagement />} />
          <Route path="settings" element={<Settings logs={logs} setLogs={setLogs} />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
