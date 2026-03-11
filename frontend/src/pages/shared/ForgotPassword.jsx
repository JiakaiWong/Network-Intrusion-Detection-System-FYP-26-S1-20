import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";  // 
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    navigate("/login");  
  };

  return (
    <div className="auth-page">
      {/* Navbar - fixed with CSS override */}
      <nav className="navbar">
        <div className="nav-logo">Intrusion Detection</div>  
        <ul className="nav-menu">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-active" : "nav-link"}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={({ isActive }) => isActive ? "nav-active" : "nav-link"}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/features" 
              className={({ isActive }) => isActive ? "nav-active" : "nav-link"}
            >
              Features
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/demo" 
              className={({ isActive }) => isActive ? "nav-active" : "nav-link"}
            >
              Demo
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? "nav-active" : "nav-link"}
            >
              Login
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Your content - unchanged */}
      <div className="main-content">
        <div className="auth-card">
          <h1>Forgot your password?</h1>
          <p className="subtitle">
            Enter your registered email address and we'll send you a password reset link.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>EMAIL</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">
              REQUEST PASSWORD RESET LINK
            </button>
          </form>
        </div>
      </div>

      <footer className="footer">
        2026 Intrusion Detection Dashboard
      </footer>
    </div>
  );
};

export default ForgotPassword;
