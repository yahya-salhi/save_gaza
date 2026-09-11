import { describe, it, expect } from "vitest";
import {
  EXPORT_CSV_COLUMNS,
  escapeCsvCell,
  toCsv,
} from "./csvSerializer.js";

describe("EXPORT_CSV_COLUMNS", () => {
  it("starts with report_date then report_period with no _ keys", () => {
    expect(EXPORT_CSV_COLUMNS[0]).toBe("report_date");
    expect(EXPORT_CSV_COLUMNS[1]).toBe("report_period");
    expect(EXPORT_CSV_COLUMNS.some((c) => c.startsWith("_"))).toBe(false);
    expect(EXPORT_CSV_COLUMNS).toContain("killed_cum");
  });
});

describe("escapeCsvCell", () => {
  it("emits empty cells for nullish values", () => {
    expect(escapeCsvCell(null)).toBe("");
    expect(escapeCsvCell(undefined)).toBe("");
  });

  it("quotes cells containing commas, quotes, or newlines", () => {
    expect(escapeCsvCell("a,b")).toBe('"a,b"');
    expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCsvCell("a\nb")).toBe('"a\nb"');
  });

  it("passes plain values through", () => {
    expect(escapeCsvCell(72850)).toBe("72850");
    expect(escapeCsvCell("2026-09-09")).toBe("2026-09-09");
  });
});

describe("toCsv", () => {
  it("serializes fixed columns with blank sparse cells", () => {
    const csv = toCsv(
      [
        { report_date: "2026-09-08", report_period: 66, killed_cum: 72850 },
        { report_date: "2026-09-09", report_period: 67 },
      ],
      ["report_date", "report_period", "killed_cum"],
    );
    expect(csv).toBe(
      "report_date,report_period,killed_cum\n" +
        "2026-09-08,66,72850\n" +
        "2026-09-09,67,\n",
    );
  });

  it("emits header-only output for empty items", () => {
    expect(toCsv([], ["report_date"])).toBe("report_date\n");
  });
});
