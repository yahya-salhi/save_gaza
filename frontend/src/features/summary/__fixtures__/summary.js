/**
 * Mock fixture — Summary (GET /api/v1/summary)
 *
 * Fixture standard (Slice 1.5):
 * - Colocated under `features/[feature]/__fixtures__/`.
 * - Holds the UNWRAPPED payload — what `apiGet(endpoint)` returns
 *   after the client strips the `{ success, data, error, timestamp }`
 *   envelope (i.e. the shape of `envelope.data`).
 * - Named `[endpoint].js` + matching `[endpoint].fixture.test.js`.
 * - Loading / empty / error are component states, not data fixtures;
 *   this file models a single verified populated payload.
 *
 * Mirrors the TechForPalestine v2 `summary.json` feed.
 */

export const summaryFixture = {
  gaza: {
    killed: 43846,
    injured: 103544,
    missing: 11000,
    killed_children: 17344,
    killed_women: 11500,
    last_update: "2026-09-09",
  },
  west_bank: {
    killed: 845,
    injured: 6500,
    arrested: 15000,
    last_update: "2026-09-09",
  },
};

export default summaryFixture;
