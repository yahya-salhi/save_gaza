import Breadcrumbs from "../features/dashboard/components/Breadcrumbs.jsx";
import DashboardHeader from "../features/dashboard/components/DashboardHeader.jsx";
import HeaderMapBanner from "../features/dashboard/components/HeaderMapBanner.jsx";
import EmptyState from "../shared/ui/EmptyState.jsx";

/**
 * DashboardPage — `/app` overview shell.
 *
 * Slice 3.1 is shell-chrome-only: header, route-aware breadcrumbs, and the
 * static map banner above a placeholder. Gaza / West Bank stat grids arrive
 * in Slices 3.2–3.3.
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <Breadcrumbs />
      <DashboardHeader />
      <HeaderMapBanner />
      <EmptyState message="Gaza and West Bank statistics arrive in the next slices." />
    </div>
  );
}
