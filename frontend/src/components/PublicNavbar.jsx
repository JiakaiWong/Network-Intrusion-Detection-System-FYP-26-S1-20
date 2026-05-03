import { useNavigate } from "react-router-dom";

const links = [
  { label: "Home",     to: "/" },
  { label: "About",    to: "/about" },
  { label: "Features", to: "/features" },
  { label: "Demo",     to: "/demo" },
  { label: "Login",    to: "/login" },
];

function PublicNavbar({ active }) {
  const navigate = useNavigate();

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo} onClick={() => navigate("/")}>Intrusion Detection</h2>
      <div style={styles.navLinks}>
        {links.map(({ label, to }) =>
          label === active ? (
            <span key={label} style={styles.navActive} onClick={() => navigate(to)}>
              {label}
            </span>
          ) : (
            <span key={label} style={styles.navLink} onClick={() => navigate(to)}>
              {label}
            </span>
          )
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    padding: "1rem 2rem",
    boxSizing: "border-box",
  },
  logo: {
    color: "#38bdf8",
    fontSize: "1.2rem",
    margin: 0,
    cursor: "pointer",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    flexDirection: "row",
    gap: "0.5rem",
    flexWrap: "wrap",
    justifyContent: "flex-end",
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
};

export default PublicNavbar;
