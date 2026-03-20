import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";
import { styles } from "./Register.styles";

// ── Password strength checker ─────────────────────────────────────────────────
function getPasswordStrength(password) {
  if (!password) return null;
  const checks = {
    "8+ characters":     password.length >= 8,
    "Uppercase":         /[A-Z]/.test(password),
    "Lowercase":         /[a-z]/.test(password),
    "Number":            /[0-9]/.test(password),
    "Special character": /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  if (score <= 2) return { label: "Weak",   color: "#ef4444", width: "20%",  checks };
  if (score === 3) return { label: "Fair",   color: "#f97316", width: "50%",  checks };
  if (score === 4) return { label: "Good",   color: "#eab308", width: "75%",  checks };
  return             { label: "Strong", color: "#10b981", width: "100%", checks };
}

function PasswordStrength({ password }) {
  const strength = getPasswordStrength(password);
  if (!strength) return null;
  return (
    <div style={{ marginTop: "8px" }}>
      {/* Bar */}
      <div style={{ height: "4px", backgroundColor: "#1e293b", borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
        <div style={{
          height: "100%", width: strength.width,
          backgroundColor: strength.color, borderRadius: "2px",
          transition: "width 0.3s ease, background-color 0.3s ease",
        }} />
      </div>
      {/* Label */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", marginBottom: "6px" }}>
        <span style={{ color: "#64748b" }}>Password strength</span>
        <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
      </div>
      {/* Requirement chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {Object.entries(strength.checks).map(([label, ok]) => (
          <span key={label} style={{
            fontSize: "0.7rem", padding: "2px 7px", borderRadius: "9999px",
            backgroundColor: ok ? "rgba(16,185,129,0.1)" : "rgba(100,116,139,0.1)",
            color: ok ? "#10b981" : "#64748b",
            border: `1px solid ${ok ? "rgba(16,185,129,0.25)" : "rgba(100,116,139,0.15)"}`,
          }}>
            {ok ? "✓" : "○"} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
function Register() {
  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]     = useState(false);
  const [role, setRole]                     = useState("Security Analyst");
  const [agreed, setAgreed]                 = useState(true);
  const [error, setError]                   = useState("");
  const [success, setSuccess]               = useState(false);
  const [loading, setLoading]               = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms & Privacy Policy.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      // Normalise email to lowercase before storing
      await registerUser(email.trim().toLowerCase(), password, name, role);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Registration Submitted</h2>
          <p style={styles.successText}>
            Your account has been created and is{" "}
            <strong>pending administrator approval</strong>. You'll be able to
            log in once an admin approves your account.
          </p>
          <button style={styles.button} onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>Intrusion Detection</h2>
        <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
          <span style={styles.navLink} onClick={() => navigate("/about")}>About</span>
          <span style={styles.navLink} onClick={() => navigate("/features")}>Features</span>
          <span style={styles.navLink} onClick={() => navigate("/demo")}>Demo</span>
          <span style={styles.navLink} onClick={() => navigate("/login")}>Login</span>
        </div>
      </nav>

      {/* Form */}
      <div style={styles.container}>
        <h2 style={styles.title}>Register your account</h2>
        <p style={styles.subtitle}>Request access to the intrusion detection dashboard</p>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleRegister} style={styles.form}>

          {/* Row 1: Name + Email */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>NAME</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>EMAIL</label>
              <input
                type="email"
                placeholder="analyst@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* Row 2: Password + Confirm Password */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </span>
              </div>
              {/* Password strength — shown below the password field */}
              <PasswordStrength password={password} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>CONFIRM PASSWORD</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </span>
              </div>
              {/* Match indicator — shown once user starts typing confirm password */}
              {confirmPassword && (
                <div style={{ marginTop: "8px", fontSize: "0.72rem", display: "flex", alignItems: "center", gap: "5px" }}>
                  {password === confirmPassword ? (
                    <span style={{ color: "#10b981" }}>✓ Passwords match</span>
                  ) : (
                    <span style={{ color: "#ef4444" }}>✕ Passwords do not match</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Role */}
          <div style={{ ...styles.inputGroup, maxWidth: "310px" }}>
            <label style={styles.label}>ROLE</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ ...styles.select, color: "#ffffff" }}
              disabled
            >
              <option>Security Analyst</option>
            </select>
          </div>

          <hr style={styles.divider} />

          <p style={styles.notice}>
            ***All accounts require administrator approval before access.***
          </p>

          <div style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            <span style={styles.checkboxLabel}>
              By creating an account, you agree to the{" "}
              <span style={styles.link}>Terms & Privacy Policy</span>
            </span>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Submitting…" : "Register"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>© 2026 Intrusion Detection Dashboard</footer>
    </div>
  );
}

export default Register;