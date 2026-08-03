import { Link } from "react-router-dom";
import { NAV_ITEMS } from "./navItems";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-background-dark">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="text-center md:text-left">
          <p className="text-lg font-bold text-light-2">Save Gaza</p>
          <p className="mt-1 text-sm text-light-1">
            Verified data and awareness for Gaza &amp; the West Bank.
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="text-sm font-semibold uppercase tracking-wide text-light-2 transition-colors duration-300 hover:text-brand-crimson"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-sm text-light-1">
          &copy; {year} Save Gaza. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
