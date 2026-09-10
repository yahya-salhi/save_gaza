import Breadcrumbs from "../features/dashboard/components/Breadcrumbs.jsx";
import { WestBankSummary } from "../features/statistics/WestBankSummary.jsx";

/**
 * WestBankPage — `/app/westBank` regional view.
 *
 * Breadcrumbs (Home / Dashboard / West Bank) + display heading +
 * West Bank daily tally card. Mirrors the DashboardPage composition
 * without the map banner.
 */
export default function WestBankPage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <Breadcrumbs />
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
          Dashboard
        </p>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-text-1">
          West Bank
        </h1>
        <p className="max-w-2xl text-sm text-text-2">
          Verified casualty, settler-attack, and displacement telemetry.
        </p>
      </div>
      <WestBankSummary />
    </div>
  );
}
