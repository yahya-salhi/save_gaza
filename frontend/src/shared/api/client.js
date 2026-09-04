const API_BASE =
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
 * @param {Response} res
 * @returns {Promise<never>}
 */
async function throwApiError(res) {
  const errorBody = await res.json().catch(() => ({}));
  const message =
    errorBody?.error?.message || `Request failed with status ${res.status}`;
  const code = errorBody?.error?.code || "HTTP_ERROR";
  throw new ApiError(message, code);
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
  const json = await res.json();

  // Standard backend envelope unwrapping
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
 * GET from the backend envelope API.
 * @param {string} endpoint - Path starting with "/", e.g. "/statistics/gaza".
 * @returns {Promise<unknown>}
 */
export async function apiGet(endpoint) {
  let url = `${API_BASE}${endpoint}`;

  // Dev-only fallback when VITE_API_BASE is empty
  if (!API_BASE && import.meta.env.DEV) {
    if (endpoint === "/statistics/gaza") {
      url = "https://data.techforpalestine.org/api/v2/casualties_daily.json";
    } else if (endpoint === "/statistics/west-bank") {
      url = "https://data.techforpalestine.org/api/v2/west_bank_daily.min.json";
    } else if (endpoint === "/summary") {
      url = "https://data.techforpalestine.org/api/v2/summary.json";
    }
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

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