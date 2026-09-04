import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./shared/providers/ErrorBoundary.jsx";
import { ThemeProvider } from "./shared/providers/ThemeProvider.jsx";
import { I18nProvider } from "./shared/providers/I18nProvider.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

/**
 * App root — providers + routes.
 * Composition: ErrorBoundary → ThemeProvider → QueryClientProvider → I18nProvider → BrowserRouter.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PlaceholderPage title="Home — Coming Soon" />} />
                <Route path="/app" element={<PlaceholderPage title="Dashboard — Coming Soon" />} />
                <Route path="/app/gaza" element={<PlaceholderPage title="Gaza Statistics — Coming Soon" />} />
                <Route path="/app/westBank" element={<PlaceholderPage title="West Bank Statistics — Coming Soon" />} />
                <Route path="/app/gazaMap" element={<PlaceholderPage title="Interactive Map — Coming Soon" />} />
                <Route path="/submit" element={<PlaceholderPage title="Submit Incident — Coming Soon" />} />
                <Route path="/login" element={<PlaceholderPage title="Admin Login — Coming Soon" />} />
                <Route path="/admin/moderation" element={<PlaceholderPage title="Moderation — Coming Soon" />} />
              </Routes>
            </BrowserRouter>
          </I18nProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

/**
 * @param {object} props
 * @param {string} props.title
 */
function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text-3)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-xl)",
      }}
    >
      {title}
    </div>
  );
}