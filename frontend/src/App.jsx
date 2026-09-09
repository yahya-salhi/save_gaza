import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./shared/providers/ErrorBoundary.jsx";
import { ThemeProvider } from "./shared/providers/ThemeProvider.jsx";
import { I18nProvider } from "./shared/providers/I18nProvider.jsx";
import RootLayout from "./layouts/RootLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";

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
                {/* Public pages — RootLayout shell */}
                <Route element={<RootLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/submit" element={<PlaceholderPage title="Submit Incident — Coming Soon" />} />
                  <Route path="/login" element={<PlaceholderPage title="Admin Login — Coming Soon" />} />
                  <Route path="/admin/moderation" element={<PlaceholderPage title="Moderation — Coming Soon" />} />
                </Route>

                {/* Dashboard pages — AppLayout shell with sidebar */}
                <Route element={<AppLayout />}>
                  <Route path="/app" element={<PlaceholderPage title="Dashboard — Coming Soon" />} />
                  <Route path="/app/gaza" element={<PlaceholderPage title="Gaza Statistics — Coming Soon" />} />
                  <Route path="/app/westBank" element={<PlaceholderPage title="West Bank Statistics — Coming Soon" />} />
                  <Route path="/app/gazaMap" element={<PlaceholderPage title="Interactive Map — Coming Soon" />} />
                </Route>
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
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-3)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-xl)",
      }}
    >
      {title}
    </div>
  );
}
