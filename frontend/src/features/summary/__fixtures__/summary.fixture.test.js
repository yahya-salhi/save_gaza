import { describe, it, expect } from "vitest";
import summaryFixture from "./summary.js";

/**
 * Fixture standard — every fixture file verifies it models the
 * UNWRAPPED payload (the shape of envelope.data) for its endpoint.
 *
 * Slice 2.1 — the summary contract reflects the TechForPalestine v3
 * `summary.json` nested multi-region shape (gaza / west_bank / lebanon /
 * known_killed_in_gaza / known_press_killed_in_gaza).
 */
describe("summary fixture", () => {
  it("models the unwrapped payload (no envelope wrapper)", () => {
    expect(summaryFixture).not.toHaveProperty("success");
    expect(summaryFixture).not.toHaveProperty("error");
    expect(summaryFixture).not.toHaveProperty("timestamp");
  });

  it("has gaza telemetry with reports, massacres and last_update", () => {
    expect(summaryFixture.gaza).toMatchObject({
      reports: expect.any(Number),
      massacres: expect.any(Number),
      last_update: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
  });

  it("has gaza killed breakdown with total + demographics", () => {
    expect(summaryFixture.gaza.killed).toMatchObject({
      total: expect.any(Number),
      children: expect.any(Number),
      women: expect.any(Number),
      civil_defence: expect.any(Number),
      press: expect.any(Number),
      medical: expect.any(Number),
    });
  });

  it("has gaza injured total", () => {
    expect(summaryFixture.gaza.injured).toMatchObject({
      total: expect.any(Number),
    });
  });

  it("has west_bank telemetry", () => {
    expect(summaryFixture.west_bank).toMatchObject({
      reports: expect.any(Number),
      settler_attacks: expect.any(Number),
      last_update: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
    expect(summaryFixture.west_bank.killed.total).toEqual(
      expect.any(Number),
    );
    expect(summaryFixture.west_bank.killed.children).toEqual(
      expect.any(Number),
    );
    expect(summaryFixture.west_bank.injured.total).toEqual(
      expect.any(Number),
    );
    expect(summaryFixture.west_bank.injured.children).toEqual(
      expect.any(Number),
    );
  });

  it("has lebanon telemetry", () => {
    expect(summaryFixture.lebanon).toMatchObject({
      reports: expect.any(Number),
      first_report: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      last_update: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
    });
    expect(summaryFixture.lebanon.killed.total).toEqual(expect.any(Number));
    expect(summaryFixture.lebanon.injured.total).toEqual(expect.any(Number));
  });

  it("has known_killed_in_gaza aggregate records", () => {
    expect(summaryFixture.known_killed_in_gaza).toMatchObject({
      records: expect.any(Number),
      pages: expect.any(Number),
      page_size: expect.any(Number),
    });
    expect(summaryFixture.known_killed_in_gaza.male.adult).toEqual(
      expect.any(Number),
    );
    expect(summaryFixture.known_killed_in_gaza.female.child).toEqual(
      expect.any(Number),
    );
  });

  it("has known_press_killed_in_gaza count", () => {
    expect(summaryFixture.known_press_killed_in_gaza).toMatchObject({
      records: expect.any(Number),
    });
  });
});
