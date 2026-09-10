import { Suspense, lazy, useState } from "react";
import Breadcrumbs from "../features/dashboard/components/Breadcrumbs.jsx";
import Skeleton from "../shared/ui/Skeleton.jsx";
import EmptyState from "../shared/ui/EmptyState.jsx";
import ErrorState from "../shared/ui/ErrorState.jsx";
import { useBoundaries } from "../features/map/hooks/useBoundaries.js";
import mapStyles from "../features/map/components/MapContainer.module.css";

const MapCanvas = lazy(() => import("../features/map/components/MapContainer.jsx"));

/**
 * GazaMapPage — `/app/gazaMap` interactive Gaza governorate map.
 *
 * Map canvas (lazy Leaflet, token polygons) + region selector list driving
 * the same `selectedId` state. Slice 4.1 is selection-only: clicking a
 * polygon or list button highlights the governorate and names it below the
 * map. Per-governorate killed/damage aggregates wire in Slice 4.2 via
 * `GET /spatial/regions/:id` — no casualty numbers are shown here.
 */
export default function GazaMapPage() {
  const { data, isLoading, isError, refetch } = useBoundaries();
  const [selectedId, setSelectedId] = useState(/** @type {string|null} */ (null));

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
      <>
        <Suspense fallback={<Skeleton count={3} />}>
          <MapCanvas data={/** @type {any} */ (data)} selectedId={selectedId} onSelect={setSelectedId} />
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
              onClick={() => setSelectedId(feature.id)}
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
            ? `Selected: ${selected.properties.name} — per-governorate casualty data arrives in Slice 4.2.`
            : "Select a governorate to inspect it — per-governorate casualty data arrives in Slice 4.2."}
        </p>
      </>
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
          Five Gaza governorates — select one to highlight it on the map.
        </p>
      </div>
      {body}
    </div>
  );
}
