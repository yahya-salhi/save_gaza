import Breadcrumbs from "../features/dashboard/components/Breadcrumbs.jsx";
import DashboardHeader from "../features/dashboard/components/DashboardHeader.jsx";
import HeaderMapBanner from "../features/dashboard/components/HeaderMapBanner.jsx";
import { GazaSummary } from "../features/statistics/GazaSummary.jsx";

/**
 * DashboardPage — `/app` overview shell.
 *
 * Shell-chrome: header, route-aware breadcrumbs, static map banner.
 * Gaza daily stat grid (Slice 3.2) renders directly below; West Bank grid
 * arrives in Slice 3.3.
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <Breadcrumbs />
      <DashboardHeader />
      <HeaderMapBanner />
      <GazaSummary />
    </div>
  );
}
