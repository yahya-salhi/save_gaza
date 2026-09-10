/**
 * History fixture — wrapped in the `{ success, data, error, timestamp }`
 * envelope returned by the backend. The `data` payload is the paginated
 * `GET /api/v1/statistics/history` shape: full daily snapshots in ascending
 * `report_date` order plus `page` / `limit` / `total`.
 */
export const historyFixture = {
  success: true,
  data: {
    items: [
      {
        report_date: "2026-09-06",
        report_period: 65,
        killed_cum: 72700,
        killed_children_cum: 19900,
        killed_women_cum: 11900,
        injured_cum: 173500,
      },
      {
        report_date: "2026-09-07",
        report_period: 66,
        killed_cum: 72800,
        killed_children_cum: 19950,
        killed_women_cum: 11950,
        injured_cum: 173700,
      },
      {
        report_date: "2026-09-08",
        report_period: 67,
        killed_cum: 72850,
        killed_children_cum: 19980,
        killed_women_cum: 11980,
        injured_cum: 173800,
      },
      {
        report_date: "2026-09-09",
        report_period: 68,
        killed: 150,
        killed_cum: 73000,
        killed_children_cum: 20000,
        killed_women_cum: 12000,
        injured: 200,
        injured_cum: 174000,
      },
    ],
    page: 1,
    limit: 100,
    total: 4,
  },
  error: null,
  timestamp: "2026-09-09T12:00:00.000Z",
};

/**
 * Recent-window fixture — mirrors live upstream rows, which carry
 * demographics as `ext_*` estimates only. The backend excludes those by
 * contract, so these items hold no verified children/women counters and
 * the section must fall back to the last verified breakdown.
 */
export const historyNoDemoFixture = {
  success: true,
  data: {
    items: [
      {
        report_date: "2026-09-08",
        report_period: 24,
        killed: 4,
        killed_cum: 73662,
        killed_recovered: 4,
        injured_cum: 174652,
      },
      {
        report_date: "2026-09-09",
        report_period: 24,
        killed: 7,
        killed_cum: 73669,
        killed_recovered: 4,
        killed_succumbed: 1,
        killed_truce_new: 2,
        injured_cum: 174652,
      },
    ],
    page: 1,
    limit: 1000,
    total: 2,
  },
  error: null,
  timestamp: "2026-09-09T12:00:00.000Z",
};
