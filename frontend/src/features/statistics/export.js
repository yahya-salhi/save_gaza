import { API_BASE, throwApiError } from "../../shared/api/client.js";

/**
 * @typedef {object} ExportParams
 * @property {string} [startDate] - YYYY-MM-DD window start
 * @property {string} [endDate] - YYYY-MM-DD window end
 * @property {"csv" | "json"} [format] - download format (defaults to csv)
 */

/**
 * Build the export endpoint path with only defined params. The download
 * covers the whole selected window in one file — no pagination.
 *
 * @param {ExportParams} [params]
 * @returns {string}
 */
export function buildExportEndpoint(params = {}) {
  const { startDate, endDate, format = "csv" } = params;
  const query = new URLSearchParams();
  if (startDate) query.set("startDate", startDate);
  if (endDate) query.set("endDate", endDate);
  query.set("format", format);
  return `/statistics/export?${query.toString()}`;
}

/**
 * Parse a filename from a `Content-Disposition` header value.
 *
 * @param {string | null} header
 * @param {string} fallback
 * @returns {string}
 */
export function parseExportFilename(header, fallback) {
  if (!header) return fallback;
  const quoted = header.match(/filename="([^"]+)"/);
  if (quoted) return quoted[1];
  const bare = header.match(/filename=([^;]+)/);
  if (bare) return bare[1].trim();
  return fallback;
}

/**
 * Default filename when the response carries no usable disposition.
 *
 * @param {ExportParams} [params]
 * @returns {string}
 */
export function fallbackExportFilename(params = {}) {
  const { startDate, endDate, format = "csv" } = params;
  if (startDate && endDate) {
    return `gaza-history-${startDate}-to-${endDate}.${format}`;
  }
  return `gaza-history-export.${format}`;
}

/**
 * Download the Gaza history export for the given window.
 *
 * Uses a raw `fetch` (not `apiGet`) because the endpoint returns file bytes
 * outside the JSON envelope by contract. Failures stay in the envelope, so
 * a non-ok response throws the normalized `ApiError` from the shared client
 * (with a `code` property) and no file is saved.
 *
 * @param {ExportParams} [params]
 * @returns {Promise<string>} the filename that was saved
 */
export async function downloadHistoryExport(params = {}) {
  const url = `${API_BASE}${buildExportEndpoint(params)}`;
  const res = await fetch(url);

  if (!res.ok) {
    await throwApiError(res);
  }

  const fallback = fallbackExportFilename(params);
  const filename = parseExportFilename(
    res.headers.get("Content-Disposition"),
    fallback,
  );
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on a tick so the download has started before cleanup.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);

  return filename;
}
