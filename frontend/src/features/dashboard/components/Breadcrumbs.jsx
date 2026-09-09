import { Link, useLocation } from "react-router-dom";

/**
 * @typedef {object} TrailItem
 * @property {string} to
 * @property {string} label
 */

/** @type {Record<string, string>} */
const CHILD_LABELS = {
  "/app/gaza": "Gaza",
  "/app/westBank": "West Bank",
  "/app/gazaMap": "Map",
};

/**
 * @param {string} pathname
 * @returns {TrailItem[]}
 */
function trailFor(pathname) {
  const trail = [
    { to: "/", label: "Home" },
    { to: "/app", label: "Dashboard" },
  ];
  if (CHILD_LABELS[pathname]) {
    trail.push({ to: pathname, label: CHILD_LABELS[pathname] });
  }
  return trail;
}

/**
 * Breadcrumbs — route-aware dashboard trail.
 *
 * Reads the current path and renders Home / Dashboard [/ Gaza | West Bank | Map].
 * All segments except the current page are links; the current page uses
 * `aria-current="page"`. Token-only styling, logical layout for RTL.
 */
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const trail = trailFor(pathname);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.to} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-text-3">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page" className="font-semibold text-text-1">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="text-text-2 no-underline transition-colors hover:text-accent-500"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
