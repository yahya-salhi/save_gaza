/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export const THEME_KEY = "sg-theme";
export const THEMES = { DARK: "dark", LIGHT: "light" };

const ThemeContext = createContext(null);

function getInitialTheme() {
  if (typeof window === "undefined") return THEMES.DARK;
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === THEMES.DARK);
  root.classList.toggle("light-theme", theme === THEMES.LIGHT);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
