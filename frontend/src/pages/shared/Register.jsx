import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "./Register.styles";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Security Analyst");
  const [agreed, setAgreed] = useState(true);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreed) {
      alert("Please agree to the Terms & Privacy Policy.");
      return;
    }
    alert("Registration submitted! Awaiting admin approval.");
    navigate("/login");
  };

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
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>CONFIRM PASSWORD</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
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

          <button type="submit" style={styles.button}>Register</button>
        </form>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>© 2026 Intrusion Detection Dashboard</footer>
    </div>
  );
}

export default Register;
