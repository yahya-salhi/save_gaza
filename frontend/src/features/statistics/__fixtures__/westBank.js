/**
 * West Bank daily fixture — wrapped in the `{ success, data, error, timestamp }`
 * envelope returned by the backend. The `data` payload is a single flat
 * object for the latest report date. No arrests data exists in the v2 feed.
 */
export const westBankLatestFixture = {
  success: true,
  data: {
    report_date: "2026-09-09",
    flash_source: "fill",
    killed_cum: 1114,
    killed_children_cum: 238,
    injured_cum: 11625,
    injured_children_cum: 1913,
    settler_attacks_cum: 4554,
    displaced_households_cum: 1423,
    displaced_persons_cum: 9553,
    displaced_children_cum: 3963,
  },
  error: null,
  timestamp: "2026-09-09T12:00:00.000Z",
};
