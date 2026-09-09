/**
 * DashboardHeader — static overview heading for `/app`.
 *
 * Slice 3.1 is shell-chrome-only: the title is a fixed display heading, not a
 * per-route dynamic title. Token-only styling, logical layout for RTL.
 */
export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
        Dashboard
      </p>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-text-1">
        War in Gaza
      </h1>
      <p className="max-w-2xl text-sm text-text-2">
        Verified casualty telemetry and humanitarian metrics. Detailed grids
        arrive in the next slices.
      </p>
    </div>
  );
}
