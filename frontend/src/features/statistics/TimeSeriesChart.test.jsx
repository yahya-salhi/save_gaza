import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HistoryTooltip } from "./TimeSeriesChart.jsx";

const payload = [
  { dataKey: "killed_cum", name: "Killed", value: 73662, color: "var(--accent-500)" },
  { dataKey: "injured_cum", name: "Injured", value: 174652, color: "var(--accent-300)" },
];

describe("HistoryTooltip", () => {
  it("renders nothing when inactive or empty", () => {
    const { container: c1 } = render(
      <HistoryTooltip active={false} payload={payload} label="2026-09-09" />,
    );
    expect(c1).toBeEmptyDOMElement();
    const { container: c2 } = render(
      <HistoryTooltip active payload={[]} label="2026-09-09" />,
    );
    expect(c2).toBeEmptyDOMElement();
  });

  it("renders the report label, series names, and grouped values", () => {
    render(<HistoryTooltip active payload={payload} label="2026-09-09" />);
    expect(screen.getByText("Report 2026-09-09")).toBeInTheDocument();
    expect(screen.getByText("Killed")).toBeInTheDocument();
    expect(screen.getByText("Injured")).toBeInTheDocument();
    expect(screen.getByText("73,662")).toBeInTheDocument();
    expect(screen.getByText("174,652")).toBeInTheDocument();
  });

  it("paints each swatch with its series color", () => {
    const { container } = render(
      <HistoryTooltip active payload={payload} label="2026-09-09" />,
    );
    const swatches = container.querySelectorAll('[aria-hidden="true"]');
    expect(swatches).toHaveLength(2);
    expect(swatches[0].style.background).toBe("var(--accent-500)");
    expect(swatches[1].style.background).toBe("var(--accent-300)");
  });
});
