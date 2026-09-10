import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BreakdownTooltip } from "./DemographicPie.jsx";

const payload = [
  { name: "Children", value: 20179, payload: { fill: "var(--accent-500)" } },
];

describe("BreakdownTooltip", () => {
  it("renders nothing when inactive or empty", () => {
    const { container: c1 } = render(
      <BreakdownTooltip active={false} payload={payload} />,
    );
    expect(c1).toBeEmptyDOMElement();
    const { container: c2 } = render(
      <BreakdownTooltip active payload={[]} />,
    );
    expect(c2).toBeEmptyDOMElement();
  });

  it("renders the slice name and grouped value with its fill", () => {
    const { container } = render(
      <BreakdownTooltip active payload={payload} />,
    );
    expect(screen.getByText("Children")).toBeInTheDocument();
    expect(screen.getByText("20,179")).toBeInTheDocument();
    const swatch = container.querySelector('[aria-hidden="true"]');
    expect(swatch.style.background).toBe("var(--accent-500)");
  });
});
