import { X } from "lucide-react";
import Card from "../../../shared/ui/Card.jsx";
import Skeleton from "../../../shared/ui/Skeleton.jsx";
import EmptyState from "../../../shared/ui/EmptyState.jsx";
import ErrorState from "../../../shared/ui/ErrorState.jsx";
import VerifiedDot from "../../../shared/ui/VerifiedDot.jsx";
import { useRegion } from "../hooks/useRegion.js";
import { useGazaDaily } from "../../statistics/hooks/useGazaDaily.js";
import mapStyles from "./MapContainer.module.css";
import styles from "./RegionInfo.module.css";

/**
 * Format a cumulative figure with en-US grouping, or an em dash when absent.
 *
 * @param {number|undefined} value
 */
function formatFigure(value) {
  return typeof value === "number" ? value.toLocaleString("en-US") : "—";
}

/**
 * RegionInfo — side details panel for the selected Gaza governorate.
 *
 * Identity comes from `GET /api/v1/spatial/regions/:id` (static metadata:
 * no per-governorate casualty figures exist upstream, so none are shown).
 * The tally context is the Gaza-wide latest snapshot, composed here from
 * the shared `useGazaDaily` cache — no second-purpose endpoint, no new
 * fetch beyond what the dashboard already owns.
 *
 * State ownership: the region query owns loading/error; the tally section
 * shows its own inline skeleton while loading and nothing on error (the
 * page keeps a single alert). With no selection, an empty-selection prompt
 * invites the user to pick a governorate — and no fetch fires at all.
 *
 * @param {object} props
 * @param {string|null} props.regionId selected governorate id, or null
 * @param {() => void} [props.onClose] clears the selection
 */
export default function RegionInfo({ regionId, onClose = () => {} }) {
  if (regionId === null || regionId === undefined || regionId === "") {
    return (
      <Card className={styles.panel} data-testid="region-info">
        <EmptyState message="Select a governorate to inspect it" />
      </Card>
    );
  }
  return <RegionDetails regionId={regionId} onClose={onClose} />;
}

/**
 * RegionDetails — fetches and renders one governorate. Rendered only after
 * a selection exists, so the region + tally queries never fire unselected.
 *
 * @param {object} props
 * @param {string} props.regionId
 * @param {() => void} props.onClose
 */
function RegionDetails({ regionId, onClose }) {
  const {
    data: region,
    isLoading,
    isError,
    refetch,
  } = useRegion(regionId);
  const { data: gaza } = useGazaDaily();

  if (isLoading) {
    return (
      <Card className={styles.panel} data-testid="region-info">
        <Skeleton count={3} />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={styles.panel} data-testid="region-info">
        <ErrorState
          message="Region details temporarily unavailable"
          onRetry={refetch}
        />
      </Card>
    );
  }

  if (!region) {
    return (
      <Card className={styles.panel} data-testid="region-info">
        <EmptyState message="No details recorded for this governorate" />
      </Card>
    );
  }

  const [lng, lat] = region.centroid;

  return (
    <Card
      className={styles.panel}
      data-testid="region-info"
      aria-label={`Details for ${region.name}`}
    >
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span
            aria-hidden="true"
            className={`${mapStyles.swatch} ${mapStyles[`region-${region.id}`] ?? ""}`}
          />
          <p className={styles.eyebrow}>
            Governorate {region.position} of 5 · north to south
          </p>
        </div>
        <button
          type="button"
          aria-label="Clear selection"
          onClick={onClose}
          className={styles.close}
        >
          <X aria-hidden="true" />
        </button>
      </div>
      <h2 className={styles.name}>{region.name}</h2>
      <p className={styles.blurb}>{region.blurb}</p>
      <dl className={styles.identity}>
        <div className={styles.row}>
          <dt>Admin centre</dt>
          <dd>{region.adminCentre}</dd>
        </div>
        <div className={styles.row}>
          <dt>Area</dt>
          <dd>
            <span
              dir="ltr"
              className="font-mono tabular-nums inline-block [unicode-bidi:isolate]"
            >
              {region.areaKm2} km²
            </span>
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Population</dt>
          <dd>
            <span
              dir="ltr"
              className="font-mono tabular-nums inline-block [unicode-bidi:isolate]"
            >
              {formatFigure(region.population2017)}
            </span>
          </dd>
        </div>
        <div className={styles.row}>
          <dt>Centroid</dt>
          <dd>
            <span
              dir="ltr"
              className="font-mono tabular-nums inline-block [unicode-bidi:isolate]"
            >
              {lng.toFixed(4)}, {lat.toFixed(4)}
            </span>
          </dd>
        </div>
      </dl>
      <div className={styles.localities}>
        <p className={styles.eyebrow}>Key localities</p>
        <ul className={styles.localityList}>
          {(region.localities ?? []).map((locality) => (
            <li key={locality}>{locality}</li>
          ))}
        </ul>
        <p className={styles.sourceNote}>{region.overviewSource}</p>
      </div>
      <hr className={styles.rule} />
      <section aria-label="Gaza-wide verified tally">
        <p className={styles.eyebrow}>Gaza-wide verified tally</p>
        {gaza ? (
          <dl className={styles.tally}>
            <div className={styles.row}>
              <dt>Killed</dt>
              <dd>
                <span
                  dir="ltr"
                  className="font-mono tabular-nums inline-block [unicode-bidi:isolate]"
                >
                  {formatFigure(gaza.killed_cum)}
                </span>
              </dd>
            </div>
            <div className={styles.row}>
              <dt>Injured</dt>
              <dd>
                <span
                  dir="ltr"
                  className="font-mono tabular-nums inline-block [unicode-bidi:isolate]"
                >
                  {formatFigure(gaza.injured_cum)}
                </span>
              </dd>
            </div>
            {gaza.report_date ? (
              <div className={styles.row}>
                <dt>Reported</dt>
                <dd>
                  <span
                    dir="ltr"
                    className="font-mono tabular-nums inline-block [unicode-bidi:isolate]"
                  >
                    {gaza.report_date}
                  </span>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <Skeleton count={2} />
        )}
        <p className={styles.disclaimer}>
          Per-governorate breakdowns are not published by the source —
          figures above cover the whole Strip.
        </p>
      </section>
      <div className={styles.footer}>
        <VerifiedDot label="Source: TechForPalestine v2 Gaza daily reports" />
      </div>
    </Card>
  );
}
