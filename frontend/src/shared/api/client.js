export const API_BASE =
  import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? "/api/v1" : "");

/**
 * Normalized API error with a machine-readable code.
 */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {string} code
   */
  constructor(message, code = "HTTP_ERROR") {
    super(message);
    this.name = "ApiError";
    /** @type {string} */
    this.code = code;
  }
}

/**
 * Throw a normalized ApiError from a non-ok response or failed envelope.
 * Exported so byte-download modules (e.g. the history export, which cannot
 * go through `apiGet`) share the single error seam.
 * @param {Response} res
 * @returns {Promise<never>}
 */
export async function throwApiError(res) {
  const errorBody = await res.json().catch(() => ({}));
  const message =
    errorBody?.error?.message || `Request failed with status ${res.status}`;
  const code = errorBody?.error?.code || "HTTP_ERROR";
  throw new ApiError(message, code);
}

/**
 * Unwrap a pre-parsed JSON payload: backend envelope → `data`, anything
 * else (dev upstream passthrough) returned as-is.
 * @param {unknown} json
 * @returns {unknown}
 */
function unwrapJson(json) {
  if (json && typeof json === "object" && "success" in json) {
    if (!json.success) {
      throw new ApiError(
        json.error?.message || "Unknown error",
        json.error?.code || "API_ERROR",
      );
    }
    return json.data;
  }

  // Dev direct fallback — raw array from upstream
  return json;
}

/**
 * Unwrap the backend response envelope, returning `data` or throwing.
 * @param {Response} res
 * @returns {Promise<unknown>}
 */
async function unwrapResponse(res) {
  if (!res.ok) {
    await throwApiError(res);
  }
  return unwrapJson(await res.json());
}

/**
 * Unwrap a dev-fallback daily-rows payload: pick the latest-date row so the
 * UI receives the same single-object shape the backend serves. Enveloped
 * payloads (test stubs) fall through to standard unwrapping; empty feeds
 * yield `null` (empty state).
 * @param {Response} res
 * @returns {Promise<unknown>}
 */
async function unwrapDevRows(res) {
  if (!res.ok) {
    await throwApiError(res);
  }
  const json = await res.json();
  const rows = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
      ? json.data
      : null;
  if (!rows) {
    return unwrapJson(json);
  }
  let latest = null;
  for (const row of rows) {
    if (
      row &&
      typeof row.report_date === "string" &&
      (!latest || row.report_date > latest.report_date)
    ) {
      latest = row;
    }
  }
  return latest;
}

/**
 * GET from the backend envelope API.
 * @param {string} endpoint - Path starting with "/", e.g. "/statistics/gaza".
 * @returns {Promise<unknown>}
 */
export async function apiGet(endpoint) {
  let url = `${API_BASE}${endpoint}`;

  // Dev-only upstream fallback when VITE_API_BASE is empty. The daily rows
  // endpoints additionally pick the latest snapshot (backend shape) — see
  // `unwrapDevRows` — so the UI renders without a backend running.
  const devRowsEndpoint =
    !API_BASE &&
    import.meta.env.DEV &&
    (endpoint === "/statistics/gaza" || endpoint === "/statistics/west-bank");

  // Dev-only fallback when VITE_API_BASE is empty
  if (!API_BASE && import.meta.env.DEV) {
    if (endpoint === "/statistics/gaza") {
      url = "https://data.techforpalestine.org/api/v2/casualties_daily.json";
    } else if (endpoint === "/statistics/west-bank") {
      url = "https://data.techforpalestine.org/api/v2/west_bank_daily.min.json";
    } else if (endpoint === "/summary") {
      url = "https://data.techforpalestine.org/api/v3/summary.json";
    }
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (devRowsEndpoint) {
    return unwrapDevRows(res);
  }
  return unwrapResponse(res);
}

/**
 * POST to the backend envelope API.
 * @param {string} endpoint - Path starting with "/".
 * @param {unknown} [body]
 * @returns {Promise<unknown>}
 */
export async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  return unwrapResponse(res);
}

/**
 * PATCH to the backend envelope API.
 * @param {string} endpoint - Path starting with "/".
 * @param {unknown} [body]
 * @returns {Promise<unknown>}
 */
export async function apiPatch(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return unwrapResponse(res);
}