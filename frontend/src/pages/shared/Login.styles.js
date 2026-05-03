export const styles = {
  // --- Layout & Global ---
  page: { 
    backgroundColor: "#0f172a", 
    minHeight: "100vh", 
    display: "flex", 
    flexDirection: "column", 
    fontFamily: "sans-serif", 
    color: "#f1f5f9" 
  },

  // --- Main Container & Card ---
  container: { 
    flex: 1, 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    padding: "2rem" 
  },
  card: { 
    width: "100%", 
    maxWidth: "420px", 
    textAlign: "center" 
  },
  title: { 
    fontSize: "2rem", 
    fontWeight: "600", 
    marginBottom: "0.5rem" 
  },
  subtitle: { 
    color: "#94a3b8", 
    fontSize: "0.9rem", 
    marginBottom: "2rem" 
  },

  // --- Form Elements ---
  inputGroup: { 
    marginBottom: "1.25rem", 
    textAlign: "left" 
  },
  label: { 
    fontSize: "0.75rem", 
    color: "#94a3b8", 
    letterSpacing: "0.1em", 
    display: "block", 
    marginBottom: "0.4rem" 
  },
  input: { 
    width: "100%", 
    padding: "0.65rem 0.75rem", 
    borderRadius: "4px", 
    border: "1px solid #334155", 
    backgroundColor: "#f1f5f9", 
    color: "#0f172a", 
    fontSize: "0.95rem", 
    boxSizing: "border-box" 
  },
  select: { 
    width: "100%", 
    padding: "0.65rem 0.75rem", 
    borderRadius: "4px", 
    border: "1px solid #334155", 
    backgroundColor: "#1e293b", 
    color: "#f1f5f9", 
    fontSize: "0.9rem", 
    boxSizing: "border-box" 
  },

  // --- Password Specific ---
  passwordWrapper: { 
    position: "relative" 
  },
  eyeIcon: { 
    position: "absolute", 
    right: "0.75rem", 
    top: "50%", 
    transform: "translateY(-50%)", 
    cursor: "pointer", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    lineHeight: 0 
  },
  forgotPassword: { 
    textAlign: "right", 
    fontSize: "0.8rem", 
    color: "#60a5fa", 
    cursor: "pointer", 
    marginTop: "0.4rem", 
    fontWeight: 500 
  },

  // --- Actions & Feedback ---
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
    fontWeight: "bold"
  },
  errorBanner: { 
    background: "rgba(239,68,68,0.1)", 
    border: "1px solid rgba(239,68,68,0.3)", 
    color: "#f87171", 
    borderRadius: "8px", 
    padding: "0.65rem 1rem", 
    marginBottom: "1rem", 
    fontSize: "0.875rem", 
    textAlign: "left" 
  },

  // --- Footer & Registration ---
  divider: { 
    borderTop: "1px solid #334155", // Changed from borderColor to borderTop
    margin: "1.5rem 0" 
  },
  registerText: { 
    color: "#94a3b8", 
    fontSize: "0.9rem" 
  },
  registerLink: { 
    color: "#f1f5f9", 
    fontWeight: "bold", 
    cursor: "pointer", 
    textDecoration: "underline",
    marginLeft: "5px"
  },
  footer: { 
    textAlign: "right", 
    padding: "1rem 2rem", 
    color: "#475569", 
    fontSize: "0.8rem", 
    borderTop: "1px solid #1e293b" 
  }
};