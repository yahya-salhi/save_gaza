import { createContext, useContext, useState, useEffect } from "react";

/**
 * @typedef {object} ThemeContextValue
 * @property {string} theme - Current theme ("dark" | "light").
 * @property {() => void} toggleTheme - Toggle between themes.
 */

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

/**
 * ThemeProvider — toggles `dark` class on <html>, persists to localStorage.
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("sg-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      localStorage.setItem("sg-theme", theme);
    } catch {
      // localStorage unavailable
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}