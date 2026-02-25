import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <h2 style={styles.logo}>26-S1-20</h2>
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
                placeholder="John Chan"
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

const styles = {
  page: {
    backgroundColor: "#0f172a",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
    color: "#f1f5f9",
  },
  navbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    padding: "1rem 2rem",
  },
  logo: {
    color: "#38bdf8",
    fontSize: "1.2rem",
    margin: 0,
  },
  navLinks: {
    display: "flex",
    flexDirection: "row",
    gap: "0.5rem",
    margin: 0,
  },
  navLink: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#94a3b8",
    fontSize: "0.95rem",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 2rem",
  },
  title: { fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" },
  subtitle: { color: "#94a3b8", fontSize: "0.9rem", marginBottom: "2rem" },
  form: { width: "100%", maxWidth: "660px" },
  row: { display: "flex", gap: "1.5rem", marginBottom: "1.25rem" },
  inputGroup: { flex: 1 },
  label: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    letterSpacing: "0.1em",
    display: "block",
    marginBottom: "0.4rem",
  },
  input: {
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: "4px",
    border: "1px solid #334155",
    backgroundColor: "#f1f5f9",
    color: "#0f172a",
    fontSize: "0.9rem",
    boxSizing: "border-box",
  },
  passwordWrapper: { position: "relative" },
  eyeIcon: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1rem",
  },
  select: {
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: "4px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    fontSize: "0.9rem",
    boxSizing: "border-box",
  },
  divider: { borderColor: "#334155", margin: "1.5rem 0" },
  notice: { color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1rem" },
  checkboxRow: { display: "flex", alignItems: "center", marginBottom: "1.5rem" },
  checkboxLabel: { color: "#94a3b8", fontSize: "0.85rem" },
  link: { color: "#f1f5f9", textDecoration: "underline", cursor: "pointer" },
  button: {
    display: "block",
    margin: "0 auto",
    padding: "0.75rem 2.5rem",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  footer: {
    textAlign: "right",
    padding: "1rem 2rem",
    color: "#475569",
    fontSize: "0.8rem",
    borderTop: "1px solid #1e293b",
  },
};

export default Register;
