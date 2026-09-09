import { describe, it, expect } from "vitest";
import summaryFixture from "./summary.js";

/**
 * Fixture standard — every fixture file verifies it models the
 * UNWRAPPED payload (the shape of envelope.data) for its endpoint.
 */
describe("summary fixture", () => {
  it("models the unwrapped payload (no envelope wrapper)", () => {
    expect(summaryFixture).not.toHaveProperty("success");
    expect(summaryFixture).not.toHaveProperty("error");
    expect(summaryFixture).not.toHaveProperty("timestamp");
  });

  it("has gaza casualty tallies", () => {
    expect(summaryFixture.gaza).toMatchObject({
      killed: expect.any(Number),
      injured: expect.any(Number),
      missing: expect.any(Number),
    });
  });

  it("has gaza demographic breakdown", () => {
    expect(summaryFixture.gaza).toMatchObject({
      killed_children: expect.any(Number),
      killed_women: expect.any(Number),
    });
  });

  it("has west_bank telemetry", () => {
    expect(summaryFixture.west_bank).toMatchObject({
      killed: expect.any(Number),
      injured: expect.any(Number),
      arrested: expect.any(Number),
    });
  });

  it("records a last_update for each region", () => {
    expect(summaryFixture.gaza.last_update).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(summaryFixture.west_bank.last_update).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
