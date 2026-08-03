/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background-dark": "#121212",
        card: "#1c1c1e",
        brand: {
          crimson: "#c41e3a",
        },
        verified: "#2ecc71",
        dark: {
          0: "#242a2e",
          1: "#2d3439",
          2: "#42484d",
        },
        light: {
          1: "#aaa",
          2: "#ececec",
          3: "#d6dee0",
        },
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Archivo", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "10px",
      },
    },
  },
  plugins: [],
};
