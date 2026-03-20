import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import { styles } from "./Login.styles";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Security Analyst");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await loginUser(email, password);
    
    if (data.user?.status === "suspended") {
      throw new Error("Your account has been suspended. Please contact an administrator.");
    }
    if (data.user?.status === "pending") {
      throw new Error("Your account is awaiting approval.");
    }
    if (data.user?.status === "rejected") {
      throw new Error("Your account registration was rejected. Please contact an administrator.");
    }

    const serverRole = data.user?.role?.toLowerCase() || "";
    const isServerAdmin = serverRole.includes("admin");
    const selectedAdmin = role === "Administrator";

    if (isServerAdmin !== selectedAdmin) {
      throw new Error("Role mismatch. Please select the correct role for your account.");
    }

    localStorage.setItem("token", data.access_token || data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (isServerAdmin) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
      console.error("Login failed:", err.message);
      const friendlyError = err.response?.data?.detail || err.message || "Login failed.";
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => showPassword ? (
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
  );

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <h2 style={styles.logo} onClick={() => navigate("/")}>
          Intrusion Detection
        </h2>
      <div style={styles.navLinks}>
          <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
          <span style={styles.navLink} onClick={() => navigate("/about")}>About</span>
          <span style={styles.navLink} onClick={() => navigate("/features")}>Features</span>
          <span style={styles.navLink} onClick={() => navigate("/demo")}>Demo</span>
          <span style={styles.navActive}>Login</span>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Sign in</h2>
          <p style={styles.subtitle}>Access the IDS Dashboard</p>

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
                autoComplete="email"
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
                  style={{ ...styles.input, paddingRight: "2.5rem" }}
                  required
                  autoComplete="current-password"
                />
                <span style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  <EyeIcon />
                </span>
              </div>
              <p style={styles.forgotPassword} onClick={() => navigate("/forgotpassword")}>
                Forgot password?
              </p>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>LOGIN AS</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.select}
              >
                <option value="Security Analyst">Security Analyst</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Log In"}
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
      <footer style={styles.footer}>© 2026 Intrusion Detection Dashboard</footer>
    </div>
  );
}



export default Login;