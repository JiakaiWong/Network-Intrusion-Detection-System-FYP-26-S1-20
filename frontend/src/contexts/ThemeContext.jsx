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
  "purple-dark",
  "green-dark",
  "midnight-red",
];

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

// ── Provider ──────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply theme to <html> and save to localStorage whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    // Remove all old theme classes from body, then add current
    VALID_THEMES.forEach((t) => document.body.classList.remove(t));
    document.body.classList.add(theme);

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
