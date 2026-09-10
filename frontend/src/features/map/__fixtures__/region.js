/**
 * Region fixture — wrapped in the `{ success, data, error, timestamp }`
 * envelope returned by the backend. The `data` payload is the
 * `GET /api/v1/spatial/regions/:id` shape: static identity + curated
 * pre-war overview (PCBS area/census) for one governorate — deliberately
 * no casualty or damage figures, since no upstream dataset publishes
 * per-governorate breakdowns.
 */
export const regionFixture = {
  success: true,
  data: {
    id: "gaza",
    name: "Gaza",
    sortOrder: 1,
    position: 2,
    centroid: [34.4573, 31.5021],
    bbox: [34.3732, 31.4272, 34.5673, 31.5487],
    areaKm2: 74.6,
    population2017: 652597,
    overviewSource: "PCBS 2017 census · GeoMOLG area (pre-war)",
    adminCentre: "Gaza City",
    localities: ["Gaza City", "Al-Shati Camp"],
    blurb:
      "Gaza City — the Strip's largest city, historic Mediterranean port and administrative capital.",
  },
  error: null,
  timestamp: "2026-09-10T00:00:00.000Z",
};
