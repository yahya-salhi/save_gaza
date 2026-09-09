/**
 * Summary — domain aggregate mirroring the TechForPalestine v3 `summary.json`.
 *
 * Pure domain model. Holds the currently published verified tallies across
 * the gaza / west_bank / lebanon regions plus the known-killed aggregate
 * record counts. Optional nested collections (`famine`, `aid_seeker`) may be
 * empty objects upstream.
 */

export interface CasualtyBreakdown {
  total: number;
  children?: number;
  women?: number;
  civil_defence?: number;
  press?: number;
  medical?: number;
}

export interface GazaSummary {
  reports: number;
  last_update: string;
  massacres: number;
  killed: CasualtyBreakdown;
  famine: Record<string, unknown>;
  aid_seeker: Record<string, unknown>;
  injured: { total: number };
}

export interface WestBankSummary {
  reports: number;
  last_update: string;
  settler_attacks: number;
  killed: { total: number; children: number };
  injured: { total: number; children: number };
}

export interface LebanonSummary {
  reports: number;
  first_report: string;
  last_update: string;
  killed: { total: number };
  injured: { total: number };
}

export interface KnownKilledInGaza {
  records: number;
  pages: number;
  page_size: number;
  male: { adult: number; senior: number; child: number };
  female: { adult: number; senior: number; child: number };
  last_update: string;
  includes_until: string;
}

export interface KnownPressKilledInGaza {
  records: number;
}

export interface Summary {
  gaza: GazaSummary;
  west_bank: WestBankSummary;
  lebanon: LebanonSummary;
  known_killed_in_gaza: KnownKilledInGaza;
  known_press_killed_in_gaza: KnownPressKilledInGaza;
}
