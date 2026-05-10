import { useTheme } from "../contexts/ThemeContext";

export const THEMES = [
  { id: "dark",          name: "Dark",            bg: "#0f172a", accent: "#3b82f6" },
  { id: "light",         name: "Light",           bg: "#f8fafc", accent: "#2563eb" },
  { id: "white-yellow",  name: "White & Yellow",  bg: "#ffffff", accent: "#ca8a04" },
  { id: "blue-white",    name: "Blue & White",    bg: "#1e3a5f", accent: "#e0f2fe" },
  { id: "orange-black",  name: "Orange & Black",  bg: "#0a0a0a", accent: "#f97316" },
];

export default function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={styles.wrap}>
      <p style={styles.label}>THEME</p>
      <div style={styles.grid}>
        {THEMES.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              title={t.name}
              onClick={() => setTheme(t.id)}
              style={{
                ...styles.btn,
                background: `linear-gradient(to right, ${t.bg} 50%, ${t.accent} 50%)`,
                boxShadow: isActive
                  ? `0 0 0 3px var(--accent-main, #3b82f6)`
                  : "none",
                border: isActive
                  ? "2px solid var(--text-main, #f1f5f9)"
                  : "2px solid transparent",
                transform: isActive ? "scale(1.12)" : "scale(1)",
              }}
              aria-label={t.name}
              aria-pressed={isActive}
            />
          );
        })}
      </div>
      <p style={styles.currentLabel}>
        Current: <strong>{THEMES.find((t) => t.id === theme)?.name ?? theme}</strong>
      </p>
    </div>
  );
}

const styles = {
  wrap: {
    marginTop: "1rem",
  },
  label: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--text-muted, #94a3b8)",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
  btn: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    cursor: "pointer",
    padding: 0,
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    flexShrink: 0,
  },
  currentLabel: {
    marginTop: "0.85rem",
    fontSize: "0.82rem",
    color: "var(--text-muted, #94a3b8)",
  },
};
