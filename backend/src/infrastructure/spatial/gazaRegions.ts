import {
  GAZA_BOUNDARIES,
  type GazaGovernorateId,
} from "./gazaBoundaries.js";

/**
 * Static per-governorate metadata (Slice 4.2).
 *
 * Identity + curated overview only — deliberately NO casualty or damage
 * figures. No upstream TechForPalestine dataset publishes per-governorate
 * breakdowns (the killed-in-Gaza list carries no location field;
 * infrastructure-damaged and casualties-daily are Gaza-wide), so any
 * per-region number would be fabricated.
 *
 * Overview sources (all pre-war, labelled as such in the payload):
 * - Area km²: Ministry of Local Government GeoMOLG 2017 via PCBS
 *   (60.9 / 74.6 / 56.7 / 109.7 / 63.1)
 * - Population: PCBS Population, Housing and Establishments Census 2017
 *   (368,978 / 652,597 / 273,200 / 370,638 / 233,878)
 * - Capitals, localities, blurbs: PCBS locality tables + governorate
 *   profiles (Jabalia / Gaza City / Deir al-Balah / Khan Younis / Rafah).
 */
export interface RegionMeta {
  id: GazaGovernorateId;
  name: string;
  sortOrder: number;
  /** 1-based position, north to south. */
  position: number;
  /** [lng, lat], rounded to 4dp like the rings. */
  centroid: [number, number];
  /** [minLng, minLat, maxLng, maxLat]. */
  bbox: [number, number, number, number];
  /** Land area in km² (GeoMOLG 2017, pre-war). */
  areaKm2: number;
  /** Census population (PCBS 2017, pre-war). */
  population2017: number;
  /** Source label for the overview figures. */
  overviewSource: string;
  /** Administrative centre (capital) of the governorate. */
  adminCentre: string;
  /** Key cities, towns and refugee camps. */
  localities: string[];
  /** One-line neutral description. */
  blurb: string;
}

function round4(n: number): number {
  return Math.round(n * 10_000) / 10_000;
}

function buildMeta(
  id: GazaGovernorateId,
  name: string,
  sortOrder: number,
  ring: Array<[number, number]>,
  overview: Pick<
    RegionMeta,
    | "areaKm2"
    | "population2017"
    | "adminCentre"
    | "localities"
    | "blurb"
  >,
): RegionMeta {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  let sumLng = 0;
  let sumLat = 0;
  for (const [lng, lat] of ring) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
    sumLng += lng;
    sumLat += lat;
  }
  const n = ring.length;
  return {
    id,
    name,
    sortOrder,
    position: sortOrder + 1,
    centroid: [round4(sumLng / n), round4(sumLat / n)],
    bbox: [minLng, minLat, maxLng, maxLat],
    overviewSource: "PCBS 2017 census · GeoMOLG area (pre-war)",
    ...overview,
  };
}

/** Five Gaza governorates, north to south. */
export const REGION_METAS: RegionMeta[] = GAZA_BOUNDARIES.features.map(
  (feature) => {
    const overviews: Record<
      GazaGovernorateId,
      Pick<
        RegionMeta,
        "areaKm2" | "population2017" | "adminCentre" | "localities" | "blurb"
      >
    > = {
      "north-gaza": {
        areaKm2: 60.9,
        population2017: 368978,
        adminCentre: "Jabalia",
        localities: ["Jabalia", "Beit Lahia", "Beit Hanoun", "Jabalia Camp"],
        blurb:
          "Northernmost governorate — dense urban towns around the Jabalia refugee camp.",
      },
      gaza: {
        areaKm2: 74.6,
        population2017: 652597,
        adminCentre: "Gaza City",
        localities: ["Gaza City", "Al-Shati Camp"],
        blurb:
          "Gaza City — the Strip's largest city, historic Mediterranean port and administrative capital.",
      },
      "deir-al-balah": {
        areaKm2: 56.7,
        population2017: 273200,
        adminCentre: "Deir al-Balah",
        localities: [
          "Deir al-Balah",
          "Az-Zawayda",
          "Bureij",
          "Maghazi",
          "Nuseirat",
        ],
        blurb:
          "Central Gaza (“Middle Area”) — “Monastery of the Date Palm”, known for date palms, beaches and four refugee camps.",
      },
      "khan-younis": {
        areaKm2: 109.7,
        population2017: 370638,
        adminCentre: "Khan Younis",
        localities: [
          "Khan Younis",
          "Bani Suheila",
          "Abasan al-Kabira",
          "Al-Qarara",
        ],
        blurb:
          "Largest governorate by area — second city grown around a 14th-century caravanserai, market centre of the south.",
      },
      rafah: {
        areaKm2: 63.1,
        population2017: 233878,
        adminCentre: "Rafah",
        localities: ["Rafah"],
        blurb:
          "Southernmost governorate — home to the Rafah Border Crossing, the Strip's sole crossing with Egypt.",
      },
    };
    return buildMeta(
      feature.id as GazaGovernorateId,
      feature.properties.name,
      feature.properties.sortOrder,
      feature.geometry.coordinates[0],
      overviews[feature.id as GazaGovernorateId],
    );
  },
);

/** Look up a region by id — returns undefined for unknown ids (→ 404). */
export function getRegionMeta(id: string): RegionMeta | undefined {
  return REGION_METAS.find((region) => region.id === id);
}
