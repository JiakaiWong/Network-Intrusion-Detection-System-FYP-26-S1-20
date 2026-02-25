import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("If this email is registered, you will receive a reset link.");
  };

  return (
    <div className="auth-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo">Intrusion Detection</div>
        <ul className="nav-menu">
          <li><NavLink to="/login">Login</NavLink></li>
          <li><NavLink to="/register">Register</NavLink></li>
        </ul>
      </nav>

      {/* Center Content */}
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

      {/* Footer */}
      <footer className="footer">
        2026 Intrusion Detection Dashboard
      </footer>
    </div>
  );
};

export default ForgotPassword;