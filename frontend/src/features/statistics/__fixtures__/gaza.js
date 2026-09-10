/**
 * Gaza daily fixture — wrapped in the `{ success, data, error, timestamp }`
 * envelope returned by the backend. The `data` payload is a single flat
 * object for the latest report date.
 */
export const gazaLatestFixture = {
  success: true,
  data: {
    report_date: "2026-09-09",
    report_source: "MoH",
    report_period: 68,
    massacres_cum: 2000,
    killed: 150,
    killed_cum: 73000,
    killed_children_cum: 20000,
    killed_women_cum: 12000,
    killed_recovered: 50,
    killed_succumbed: 10,
    killed_truce_new: 200,
    killed_committee: 500,
    child_famine_cum: 500,
    famine_cum: 800,
    aid_seeker_killed_cum: 400,
    aid_seeker_injured_cum: 1500,
    injured: 200,
    injured_cum: 174000,
    civdef_killed_cum: 140,
    med_killed_cum: 1700,
    press_killed_cum: 260,
  },
  error: null,
  timestamp: "2026-09-09T12:00:00.000Z",
};
