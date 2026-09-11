/**
 * Pins fixture — wrapped in the `{ success, data, error, timestamp }`
 * envelope returned by the backend. The `data` payload is the
 * `GET /api/v1/incidents/pins` shape: `{ items, total }` with the minimal
 * marker contract (`id`, `title`, `reportDate`, `region`, `latitude`,
 * `longitude`) — deliberately no `description`, `sourceUrl`, or
 * `evidenceUrl`; those are moderation-detail fields, not map dots.
 */
export const pinsFixture = {
  success: true,
  data: {
    items: [
      {
        id: "pin-1",
        title: "Clinic strike report",
        reportDate: "2026-09-08",
        region: "gaza",
        latitude: 31.5,
        longitude: 34.45,
      },
      {
        id: "pin-2",
        title: "School shelter report",
        reportDate: "2026-09-07",
        region: "khan-younis",
        latitude: 31.34,
        longitude: 34.3,
      },
    ],
    total: 2,
  },
  error: null,
  timestamp: "2026-09-10T00:00:00.000Z",
};

/** Empty-pins envelope — the live shape until moderation (Phase 5) approves rows. */
export const emptyPinsFixture = {
  success: true,
  data: { items: [], total: 0 },
  error: null,
  timestamp: "2026-09-10T00:00:00.000Z",
};
