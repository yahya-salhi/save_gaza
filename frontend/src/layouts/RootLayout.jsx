import { Outlet } from "react-router-dom";
import Navbar from "../shared/ui/Navbar.jsx";
import Footer from "../shared/ui/Footer.jsx";

/**
 * Root layout — Navbar + content + Footer.
 * Used for public pages: /, /submit, /login, /admin/moderation.
 */
export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text-2 font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
