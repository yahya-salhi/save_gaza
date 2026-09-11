/**
 * Shared numeral formatting — single owner of en-US grouping + the
 * missing-value fallback.
 *
 * Previously copied per file (with one bare `toLocaleString()` that yields
 * "1 114" under fr-FR, and one direct call that crashes on `undefined`).
 * en-US grouping keeps rendering identical in every browser locale.
 */

/**
 * Format a count with en-US grouping (73,658). Falls back to "—" when the
 * value is missing so partial payloads never render "undefined" or crash.
 *
 * @param {number | undefined | null} value
 * @returns {string}
 */
export function formatCount(value) {
  return typeof value === "number" ? value.toLocaleString("en-US") : "—";
}
