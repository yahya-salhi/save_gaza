/**
 * Statistic — domain entity mirroring the Prisma `Statistic` EAV model.
 *
 * One row per metric per date (`region` / `reportDate` / `type` / `value`).
 * Gaza daily ingestion (Slice 3.2) stores each verified upstream field as its
 * own row so upserts stay idempotent on `@@unique([region, reportDate, type])`
 * and "latest date" reads stay fast on `@@index([region, reportDate])`.
 */
export interface Statistic {
  id?: number;
  region: string;
  /** Report date in YYYY-MM-DD. */
  reportDate: string;
  /** Metric key, e.g. `killed_cum`, `press_killed_cum`. */
  type: string;
  /** Human-readable label for the metric. */
  label: string;
  value: number;
}

/**
 * GazaDaily — latest-date Gaza payload served by `GET /api/v1/statistics/gaza`.
 *
 * Flat, full-fidelity shape: every verified `*_cum` field from
 * `casualties_daily.json` plus reporting meta, enriched with `summary.json`
 * meta (`reports`, `last_update`, `massacres`). All `ext_*` extrapolated
 * fields are excluded by contract. Optional cum fields are present only when
 * the upstream row carried them.
 */
export interface GazaDaily {
  report_date: string;
  report_source: string;
  report_period: number;
  reports?: number;
  last_update?: string;
  massacres?: number;
  massacres_cum?: number;
  killed?: number;
  killed_cum?: number;
  killed_children_cum?: number;
  killed_women_cum?: number;
  killed_recovered?: number;
  killed_succumbed?: number;
  killed_truce_new?: number;
  killed_committee?: number;
  child_famine_cum?: number;
  famine_cum?: number;
  aid_seeker_killed_cum?: number;
  aid_seeker_injured_cum?: number;
  injured?: number;
  injured_cum?: number;
  civdef_killed_cum?: number;
  med_killed_cum?: number;
  press_killed_cum?: number;
}

/** EAV region key for Gaza daily rows. */
export const GAZA_REGION = "gaza";

/**
 * Verified metric keys persisted to the EAV table, with human labels.
 * `ext_*` extrapolated fields are intentionally absent.
 */
export const VERIFIED_GAZA_METRICS: ReadonlyArray<{
  key: keyof Omit<
    GazaDaily,
    "report_date" | "report_source" | "report_period" | "reports" | "last_update" | "massacres"
  >;
  label: string;
}> = [
  { key: "massacres_cum", label: "Massacres (cumulative)" },
  { key: "killed", label: "Killed (this report)" },
  { key: "killed_cum", label: "Total killed" },
  { key: "killed_children_cum", label: "Children killed" },
  { key: "killed_women_cum", label: "Women killed" },
  { key: "killed_recovered", label: "Recovered bodies (truce)" },
  { key: "killed_succumbed", label: "Succumbed to injuries (truce)" },
  { key: "killed_truce_new", label: "Killed (2025 truce onward)" },
  { key: "killed_committee", label: "Recognized by committee" },
  { key: "child_famine_cum", label: "Children killed by starvation" },
  { key: "famine_cum", label: "Killed by starvation" },
  { key: "aid_seeker_killed_cum", label: "Aid seekers killed" },
  { key: "aid_seeker_injured_cum", label: "Aid seekers injured" },
  { key: "injured", label: "Injured (this report)" },
  { key: "injured_cum", label: "Total injured" },
  { key: "civdef_killed_cum", label: "Civil defence killed" },
  { key: "med_killed_cum", label: "Medical personnel killed" },
  { key: "press_killed_cum", label: "Journalists killed" },
];
