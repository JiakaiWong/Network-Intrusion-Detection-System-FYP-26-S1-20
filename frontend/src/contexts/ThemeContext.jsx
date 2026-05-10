import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

export const VALID_THEMES = [
  "dark",
  "light",
  "white-yellow",
  "blue-white",
  "orange-black",
];

// All CSS variables per theme — injected as inline styles on <html> so they
// always beat any stylesheet rule regardless of specificity.
const THEME_VARS = {
  dark: {
    "--accent-dim":    "rgba(59,130,246,0.15)",
    "--bg-primary":    "#0f172a",
    "--bg-secondary":  "#1e293b",
    "--bg-card":       "#1e293b",
    "--bg-card-alt":   "#0b1224",
    "--bg-sidebar":    "#0f172a",
    "--bg-input":      "#1e293b",
    "--bg-hover":      "#334155",
    "--bg-main":       "#0f172a",
    "--text-primary":  "#f1f5f9",
    "--text-secondary":"#94a3b8",
    "--text-main":     "#f1f5f9",
    "--text-muted":    "#94a3b8",
    "--border-primary":"#334155",
    "--border-color":  "#334155",
    "--primary":       "#3b82f6",
    "--primary-hover": "#2563eb",
    "--primary-bg":    "rgba(59,130,246,0.1)",
    "--accent-primary":"#3b82f6",
    "--accent-main":   "#3b82f6",
    "--success":       "#10b981",
    "--success-bg":    "rgba(16,185,129,0.1)",
    "--warning":       "#f59e0b",
    "--warning-bg":    "rgba(245,158,11,0.1)",
    "--error":         "#ef4444",
    "--error-bg":      "rgba(239,68,68,0.1)",
    "--sev-high-bg":   "rgba(239,68,68,0.15)",
    "--sev-high-color":"#ef4444",
    "--sev-med-bg":    "rgba(245,158,11,0.15)",
    "--sev-med-color": "#f59e0b",
    "--sev-low-bg":    "rgba(16,185,129,0.15)",
    "--sev-low-color": "#10b981",
    "--sidebar-text":  "#94a3b8",
    "--sidebar-active":"#3b82f6",
    "--nav-bg":        "#1e293b",
  },
  light: {
    "--accent-dim":    "rgba(37,99,235,0.08)",
    "--bg-primary":    "#f8fafc",
    "--bg-secondary":  "#ffffff",
    "--bg-card":       "#ffffff",
    "--bg-card-alt":   "#f8fafc",
    "--bg-sidebar":    "#f1f5f9",
    "--bg-input":      "#f8fafc",
    "--bg-hover":      "#e2e8f0",
    "--bg-main":       "#f8fafc",
    "--text-primary":  "#0f172a",
    "--text-secondary":"#64748b",
    "--text-main":     "#0f172a",
    "--text-muted":    "#64748b",
    "--border-primary":"#e2e8f0",
    "--border-color":  "#e2e8f0",
    "--primary":       "#2563eb",
    "--primary-hover": "#1d4ed8",
    "--primary-bg":    "rgba(37,99,235,0.1)",
    "--accent-primary":"#2563eb",
    "--accent-main":   "#2563eb",
    "--success":       "#16a34a",
    "--success-bg":    "rgba(22,163,74,0.1)",
    "--warning":       "#d97706",
    "--warning-bg":    "rgba(217,119,6,0.1)",
    "--error":         "#dc2626",
    "--error-bg":      "rgba(220,38,38,0.1)",
    "--sev-high-bg":   "rgba(220,38,38,0.12)",
    "--sev-high-color":"#dc2626",
    "--sev-med-bg":    "rgba(217,119,6,0.12)",
    "--sev-med-color": "#d97706",
    "--sev-low-bg":    "rgba(22,163,74,0.12)",
    "--sev-low-color": "#16a34a",
    "--sidebar-text":  "#64748b",
    "--sidebar-active":"#2563eb",
    "--nav-bg":        "#ffffff",
  },
  "white-yellow": {
    "--accent-dim":    "rgba(202,138,4,0.12)",
    "--bg-primary":    "#fffbeb",
    "--bg-secondary":  "#ffffff",
    "--bg-card":       "#ffffff",
    "--bg-card-alt":   "#fffbeb",
    "--bg-sidebar":    "#fef9c3",
    "--bg-input":      "#fef9c3",
    "--bg-hover":      "#fde68a",
    "--bg-main":       "#fffbeb",
    "--text-primary":  "#1c1917",
    "--text-secondary":"#78716c",
    "--text-main":     "#1c1917",
    "--text-muted":    "#78716c",
    "--border-primary":"#fde68a",
    "--border-color":  "#fde68a",
    "--primary":       "#ca8a04",
    "--primary-hover": "#a16207",
    "--primary-bg":    "rgba(202,138,4,0.1)",
    "--accent-primary":"#ca8a04",
    "--accent-main":   "#ca8a04",
    "--success":       "#16a34a",
    "--success-bg":    "rgba(22,163,74,0.1)",
    "--warning":       "#d97706",
    "--warning-bg":    "rgba(217,119,6,0.1)",
    "--error":         "#dc2626",
    "--error-bg":      "rgba(220,38,38,0.1)",
    "--sev-high-bg":   "rgba(220,38,38,0.12)",
    "--sev-high-color":"#dc2626",
    "--sev-med-bg":    "rgba(202,138,4,0.15)",
    "--sev-med-color": "#ca8a04",
    "--sev-low-bg":    "rgba(22,163,74,0.12)",
    "--sev-low-color": "#16a34a",
    "--sidebar-text":  "#78716c",
    "--sidebar-active":"#ca8a04",
    "--nav-bg":        "#ffffff",
  },
  "blue-white": {
    "--accent-dim":    "rgba(224,242,254,0.1)",
    "--bg-primary":    "#1e3a5f",
    "--bg-secondary":  "#234876",
    "--bg-card":       "#234876",
    "--bg-card-alt":   "#1a3356",
    "--bg-sidebar":    "#1a3356",
    "--bg-input":      "#1a3356",
    "--bg-hover":      "#2d5a8e",
    "--bg-main":       "#1e3a5f",
    "--text-primary":  "#e0f2fe",
    "--text-secondary":"#93c5fd",
    "--text-main":     "#e0f2fe",
    "--text-muted":    "#93c5fd",
    "--border-primary":"#2d5a8e",
    "--border-color":  "#2d5a8e",
    "--primary":       "#e0f2fe",
    "--primary-hover": "#bae6fd",
    "--primary-bg":    "rgba(224,242,254,0.1)",
    "--accent-primary":"#e0f2fe",
    "--accent-main":   "#e0f2fe",
    "--success":       "#10b981",
    "--success-bg":    "rgba(16,185,129,0.1)",
    "--warning":       "#f59e0b",
    "--warning-bg":    "rgba(245,158,11,0.1)",
    "--error":         "#ef4444",
    "--error-bg":      "rgba(239,68,68,0.1)",
    "--sev-high-bg":   "rgba(239,68,68,0.15)",
    "--sev-high-color":"#ef4444",
    "--sev-med-bg":    "rgba(245,158,11,0.15)",
    "--sev-med-color": "#f59e0b",
    "--sev-low-bg":    "rgba(16,185,129,0.15)",
    "--sev-low-color": "#10b981",
    "--sidebar-text":  "#93c5fd",
    "--sidebar-active":"#e0f2fe",
    "--nav-bg":        "#234876",
  },
  "orange-black": {
    "--accent-dim":    "rgba(249,115,22,0.15)",
    "--bg-primary":    "#0a0a0a",
    "--bg-secondary":  "#1a1a1a",
    "--bg-card":       "#1a1a1a",
    "--bg-card-alt":   "#111111",
    "--bg-sidebar":    "#111111",
    "--bg-input":      "#111111",
    "--bg-hover":      "#2a2a2a",
    "--bg-main":       "#0a0a0a",
    "--text-primary":  "#f5f5f5",
    "--text-secondary":"#a3a3a3",
    "--text-main":     "#f5f5f5",
    "--text-muted":    "#a3a3a3",
    "--border-primary":"#2a2a2a",
    "--border-color":  "#2a2a2a",
    "--primary":       "#f97316",
    "--primary-hover": "#ea6a0a",
    "--primary-bg":    "rgba(249,115,22,0.12)",
    "--accent-primary":"#f97316",
    "--accent-main":   "#f97316",
    "--success":       "#22c55e",
    "--success-bg":    "rgba(34,197,94,0.1)",
    "--warning":       "#f59e0b",
    "--warning-bg":    "rgba(245,158,11,0.1)",
    "--error":         "#ef4444",
    "--error-bg":      "rgba(239,68,68,0.1)",
    "--sev-high-bg":   "rgba(239,68,68,0.15)",
    "--sev-high-color":"#ef4444",
    "--sev-med-bg":    "rgba(249,115,22,0.18)",
    "--sev-med-color": "#f97316",
    "--sev-low-bg":    "rgba(34,197,94,0.12)",
    "--sev-low-color": "#22c55e",
    "--sidebar-text":  "#a3a3a3",
    "--sidebar-active":"#f97316",
    "--nav-bg":        "#1a1a1a",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem("theme");
    if (saved && VALID_THEMES.includes(saved)) return saved;
  } catch {
    // localStorage blocked (e.g. sandboxed iframe)
  }
  return getSystemTheme();
};

function applyTheme(theme) {
  const root = document.documentElement;

  // Set data-theme attribute (still used for any remaining CSS selectors)
  root.setAttribute("data-theme", theme);

  // Remove all old theme classes from body, then add current
  VALID_THEMES.forEach((t) => document.body.classList.remove(t));
  document.body.classList.add(theme);

  // Inject CSS variables as inline styles on <html> — inline styles always
  // win over any stylesheet rule, so this bypasses all specificity conflicts.
  const vars = THEME_VARS[theme] ?? THEME_VARS.dark;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // localStorage blocked
    }
  }, [theme]);

  // Listen for OS-level theme changes — only if user has not manually set a theme
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      try {
        const saved = localStorage.getItem("theme");
        if (!saved) {
          setThemeState(media.matches ? "dark" : "light");
        }
      } catch {
        setThemeState(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const setTheme = (newTheme) => {
    if (VALID_THEMES.includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return context;
}
