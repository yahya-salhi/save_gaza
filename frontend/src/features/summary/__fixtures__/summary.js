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
 * Mirrors the TechForPalestine v3 `summary.json` feed (Slice 2.1 — the
 * summary contract standardizes on the nested multi-region v3 shape so the
 * fixture, backend entity/Zod schema, and backend proxy stay in sync with the
 * real upstream document).
 */

export const summaryFixture = {
  gaza: {
    reports: 1067,
    last_update: "2026-09-07",
    massacres: 12000,
    killed: {
      total: 73658,
      children: 20179,
      women: 12500,
      civil_defence: 140,
      press: 262,
      medical: 1701,
    },
    famine: {},
    aid_seeker: {},
    injured: {
      total: 174622,
    },
  },
  west_bank: {
    reports: 1067,
    last_update: "2026-09-07",
    settler_attacks: 4554,
    killed: {
      total: 1114,
      children: 238,
    },
    injured: {
      total: 11625,
      children: 1913,
    },
  },
  lebanon: {
    reports: 193,
    first_report: "2023-11-14",
    last_update: "2026-09-06",
    killed: {
      total: 8409,
    },
    injured: {
      total: 29016,
    },
  },
  known_killed_in_gaza: {
    records: 72835,
    pages: 729,
    page_size: 100,
    male: {
      adult: 36067,
      senior: 2089,
      child: 12803,
    },
    female: {
      adult: 11733,
      senior: 1309,
      child: 8834,
    },
    last_update: "2026-07-27",
    includes_until: "2026-05-07",
  },
  known_press_killed_in_gaza: {
    records: 262,
  },
};

export default summaryFixture;
