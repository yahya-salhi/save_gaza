import { VERIFIED_GAZA_METRICS } from "../../core/entities/Statistic.js";
import type { HistoryItem } from "./GetHistoryUseCase.js";

/**
 * Fixed CSV column order for the Gaza export: `report_date` first, then
 * `report_period`, then every verified Gaza metric in canonical entity
 * order. Days without a value (e.g. demographics after 2025-10-07) emit an
 * empty cell — the column set never shifts with the window.
 */
export const EXPORT_CSV_COLUMNS: string[] = [
  "report_date",
  "report_period",
  ...VERIFIED_GAZA_METRICS.map((m) => String(m.key)),
];

/** Escape a single CSV cell per RFC 4180 (quote when needed). */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/** Serialize history items to CSV with the fixed column header. */
export function toCsv(
  items: HistoryItem[],
  columns: string[] = EXPORT_CSV_COLUMNS,
): string {
  const header = columns.join(",");
  const rows = items.map((item) =>
    columns.map((col) => escapeCsvCell(item[col])).join(","),
  );
  return [header, ...rows].join("\n") + "\n";
}
