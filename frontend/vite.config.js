import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      // Prefix-less client paths (the envelope client sends e.g.
      // "/statistics/gaza"; API_BASE supplies "/api/v1" only in prod).
      // Rewrite them onto the backend's /api/v1 mount in dev.
      "/statistics": {
        target: "http://localhost:3000",
        rewrite: (path) => `/api/v1${path}`,
      },
      "/spatial": {
        target: "http://localhost:3000",
        rewrite: (path) => `/api/v1${path}`,
      },
      "/incidents": {
        target: "http://localhost:3000",
        rewrite: (path) => `/api/v1${path}`,
      },
      "/summary": {
        target: "http://localhost:3000",
        rewrite: (path) => `/api/v1${path}`,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/shared/test/setup.js"],
    css: false,
  },
});