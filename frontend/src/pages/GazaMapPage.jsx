import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import Breadcrumbs from "../features/dashboard/components/Breadcrumbs.jsx";
import Skeleton from "../shared/ui/Skeleton.jsx";
import EmptyState from "../shared/ui/EmptyState.jsx";
import ErrorState from "../shared/ui/ErrorState.jsx";
import RegionInfo from "../features/map/components/RegionInfo.jsx";
import { useBoundaries } from "../features/map/hooks/useBoundaries.js";
import mapStyles from "../features/map/components/MapContainer.module.css";

const MapCanvas = lazy(() => import("../features/map/components/MapContainer.jsx"));

/**
 * GazaMapPage — `/app/gazaMap` interactive Gaza governorate map.
 *
 * Map canvas (lazy Leaflet, token polygons) + region selector list driving
 * the same `selectedId` state, with a `RegionInfo` side panel (side-by-side
 * on desktop, stacked below on mobile). Clicking the selected governorate
 * again, the panel close button, or Escape clears the selection.
 * Per-governorate casualty figures are not shown anywhere: no upstream
 * dataset publishes them, so the panel pairs static region identity with
 * the Gaza-wide verified tally and an explicit disclaimer.
 */
export default function GazaMapPage() {
  const { data, isLoading, isError, refetch } = useBoundaries();
  const [selectedId, setSelectedId] = useState(/** @type {string|null} */ (null));

  const handleSelect = useCallback(
    /** @param {string} id */
    (id) => {
      setSelectedId((prev) => (prev === id ? null : id));
    },
    [],
  );

  const clearSelection = useCallback(() => setSelectedId(null), []);

  useEffect(() => {
    if (selectedId === null) return;
    const onKeyDown = /** @param {KeyboardEvent} event */ (event) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  const features = data?.features ?? [];
  const selected = features.find((f) => f.id === selectedId) ?? null;

  let body;
  if (isLoading) {
    body = <Skeleton count={3} />;
  } else if (isError) {
    body = (
      <ErrorState
        message="Boundary data temporarily unavailable"
        onRetry={refetch}
      />
    );
  } else if (features.length === 0) {
    body = <EmptyState message="No boundary data available" />;
  } else {
    body = (
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Suspense fallback={<Skeleton count={3} />}>
            <MapCanvas data={/** @type {any} */ (data)} selectedId={selectedId} onSelect={handleSelect} />
          </Suspense>
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Gaza governorates"
          >
            {features.map((feature) => (
              <button
                key={feature.id}
                type="button"
                aria-pressed={feature.id === selectedId}
                onClick={() => handleSelect(feature.id)}
                className={
                  feature.id === selectedId
                    ? "flex items-center gap-2 rounded-md bg-accent-500 px-4 py-2 text-sm font-bold text-text-on-accent"
                    : "flex items-center gap-2 rounded-md border border-hairline bg-surface-2 px-4 py-2 text-sm text-text-2 hover:bg-surface-3"
                }
              >
                <span
                  aria-hidden="true"
                  className={`${mapStyles.swatch} ${mapStyles[`region-${feature.id}`] ?? ""}`}
                />
                {feature.properties.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-text-2" role="status">
            {selected
              ? `Selected: ${selected.properties.name} — details in the side panel.`
              : "Select a governorate to inspect it."}
          </p>
        </div>
        <aside className="w-full shrink-0 lg:w-[360px]" aria-label="Governorate details">
          <RegionInfo regionId={selectedId} onClose={clearSelection} />
        </aside>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <Breadcrumbs />
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-500">
          Dashboard
        </p>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-text-1">
          Gaza Map
        </h1>
        <p className="max-w-2xl text-sm text-text-2">
          Five Gaza governorates — select one to inspect it.
        </p>
      </div>
      {body}
    </div>
  );
}
