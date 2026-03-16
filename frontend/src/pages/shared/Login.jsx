import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Security Analyst");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
 
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
 
      const userRole = data.user?.role || role;
      if (userRole === "Administrator") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // If backend is offline, fall back to role-based demo navigation
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        console.warn("Backend offline – using demo navigation");
        if (role === "Administrator") navigate("/admin");
        else navigate("/dashboard");
      } else {
        setError(err.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
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
          <span style={styles.navActive} onClick={() => navigate("/login")}>Login</span>
        </div>
      </nav>

      {/* Login Form */}
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Sign in</h2>
          <p style={styles.subtitle}>Access the Intrusion Detection Dashboard</p>


          {error && <div style={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleLogin}>
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

            <div style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...styles.input, marginBottom: 0 }}
                  required
                />
                <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              
              <p style={styles.forgotPassword} onClick={() => navigate("/forgotpassword")}>
                Forgot password?
              </p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>ROLE</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.select}
              >
                <option>Security Analyst</option>
                <option>Administrator</option>
              </select>
            </div>

           
           <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          <hr style={styles.divider} />

          <p style={styles.registerText}>
            Don't have an account?{" "}
            <span style={styles.registerLink} onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </div>
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
  navActive: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#f1f5f9",
    fontWeight: "bold",
    fontSize: "0.95rem",
    borderBottom: "2px solid #3b82f6",   
    paddingBottom: "2px",
  },
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "normal",
    marginBottom: "0.5rem",
    color: "#f1f5f9",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    marginBottom: "2rem",
  },
   errorBanner: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171",
    borderRadius: "8px",
    padding: "0.65rem 1rem",
    marginBottom: "1rem",
    fontSize: "0.875rem",
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: "1.25rem",
    textAlign: "left",
  },
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
    fontSize: "0.95rem",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1rem",
  },
  forgotPassword: {
    textAlign: "right",
    fontSize: "0.8rem",
    color: "#60a5fa",
    cursor: "pointer",
    marginTop: "0.4rem",
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
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  divider: {
    borderColor: "#334155",
    margin: "1.5rem 0",
  },
  registerText: {
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  registerLink: {
    color: "#f1f5f9",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
  footer: {
    textAlign: "right",
    padding: "1rem 2rem",
    color: "#475569",
    fontSize: "0.8rem",
    borderTop: "1px solid #1e293b",
  },
};

export default Login;
