import Breadcrumbs from "../features/dashboard/components/Breadcrumbs.jsx";
import { GazaSummary } from "../features/statistics/GazaSummary.jsx";
import { GazaDetail } from "../features/statistics/GazaDetail.jsx";
import { GazaHistory } from "../features/statistics/GazaHistory.jsx";

/**
 * GazaPage — `/app/gaza` full-picture view.
 *
 * The overview (`/app`) keeps the headline tally with words; this page is
 * the whole data picture: the same tally on top, then the full record
 * (truce & committee, starvation, aid seekers) below, then the time-series
 * trends section (range slider + line + pie) at the bottom.
 */
export default function GazaPage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <Breadcrumbs />
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
          Dashboard
        </p>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-text-1">
          Gaza
        </h1>
        <p className="max-w-2xl text-sm text-text-2">
          The full verified record — every casualty, starvation, and aid-seeker
          figure from the latest daily report.
        </p>
      </div>
      <GazaSummary />
      <GazaDetail />
      <GazaHistory />
    </div>
  );
}
