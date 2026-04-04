import React, { createContext, useContext, useState, useEffect } from "react";

// ── Theme definitions ─────────────────────────────────────────────────────────
export const THEMES = {
  "Dark Navy": {
    "--bg-primary":   "#0f172a",
    "--bg-secondary": "#1e293b",
    "--bg-card":      "#1e293b",
    "--bg-sidebar":   "#1e293b",
    "--border":       "#334155",
    "--text-primary": "#f1f5f9",
    "--text-muted":   "#94a3b8",
    "--accent":       "#38bdf8",
    "--accent-dim":   "#0ea5e9",
  },
  "Midnight Grey": {
    "--bg-primary":   "#111111",
    "--bg-secondary": "#1a1a1a",
    "--bg-card":      "#222222",
    "--bg-sidebar":   "#1a1a1a",
    "--border":       "#333333",
    "--text-primary": "#e5e5e5",
    "--text-muted":   "#888888",
    "--accent":       "#6366f1",
    "--accent-dim":   "#4f46e5",
  },
  "Light Mode": {
    "--bg-primary":   "#f8fafc",
    "--bg-secondary": "#ffffff",
    "--bg-card":      "#ffffff",
    "--bg-sidebar":   "#1e293b",
    "--border":       "#e2e8f0",
    "--text-primary": "#0f172a",
    "--text-muted":   "#64748b",
    "--accent":       "#2563eb",
    "--accent-dim":   "#1d4ed8",
  },
  "Teal Dark": {
    "--bg-primary":   "#0d1f1f",
    "--bg-secondary": "#102828",
    "--bg-card":      "#102828",
    "--bg-sidebar":   "#0a1a1a",
    "--border":       "#1a4a4a",
    "--text-primary": "#e0f2f1",
    "--text-muted":   "#80cbc4",
    "--accent":       "#14b8a6",
    "--accent-dim":   "#0d9488",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("ids-theme") || "Dark Navy"
  );

  useEffect(() => {
    const vars = THEMES[theme] || THEMES["Dark Navy"];
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, val]) => root.style.setProperty(key, val));
    localStorage.setItem("ids-theme", theme);
    // Keep body bg in sync for pages that read it directly
    document.body.style.backgroundColor = vars["--bg-primary"];
    document.body.style.color = vars["--text-primary"];
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: Object.keys(THEMES) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
