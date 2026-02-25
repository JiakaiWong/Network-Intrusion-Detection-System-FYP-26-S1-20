import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";

import Register from "./pages/shared/Register";
import Visitor from "./pages/shared/Visitor";
import Login from "./pages/shared/Login";
import Dashboard from "./pages/analyst/Dashboard";
import Alerts from "./pages/analyst/Alerts";
import Reports from "./pages/analyst/Reports";
import Logout from "./pages/shared/Logout";
import Admin from "./pages/admin/AdminDashboard";   
import Usermanagement from "./pages/admin/UserManagement";
import Profile from "./pages/admin/Profile";
import Settings from "./pages/admin/Settings";
import About from "./pages/shared/About";
import Features from "./pages/shared/Features";
import Demo from "./pages/shared/Demo";
import AlertDetails from "./pages/analyst/AlertDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Visitor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/alert/:id" element={<AlertDetails />} />

        {/* AdminDashboard  */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />           
          <Route path="users" element={<Usermanagement />} />  
          <Route path="settings" element={<Settings />} />     
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
