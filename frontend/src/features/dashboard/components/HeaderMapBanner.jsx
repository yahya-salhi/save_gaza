/**
 * HeaderMapBanner — static visual strip above the dashboard content.
 *
 * Slice 3.1 is intentionally static: no Leaflet, no data fetching. The live
 * spatial map lands in Phase 4; this reserves the space with token-only
 * obsidian styling and a crimson marker motif.
 */
export default function HeaderMapBanner() {
  return (
    <div
      role="img"
      aria-label="Map preview placeholder — the interactive spatial map arrives in a later slice"
      className="flex items-center gap-3 rounded-lg border border-hairline bg-surface-1 px-5 py-4"
    >
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 shrink-0 rounded-full bg-accent-500"
      />
      <p className="text-sm text-text-2">
        Interactive map preview — live spatial telemetry arrives in Phase 4.
      </p>
    </div>
  );
}
