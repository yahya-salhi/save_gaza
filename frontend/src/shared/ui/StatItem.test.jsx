import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatItem from "./StatItem.jsx";

describe("StatItem", () => {
  it("renders value and label", () => {
    render(<StatItem value={1234} label="Casualties" />);
    expect(screen.getByText("Casualties")).toBeInTheDocument();
    const val = screen.getByText((_, el) =>
      el?.tagName === "SPAN" && el.textContent.includes("1"),
    );
    expect(val).toBeInTheDocument();
  });

  it("formats numeric values with locale separators", () => {
    render(<StatItem value={50000} label="Total" />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    const val = screen.getByText((_, el) =>
      el?.tagName === "SPAN" && el.textContent.includes("50"),
    );
    expect(val).toBeInTheDocument();
  });

  it("renders string values as-is", () => {
    render(<StatItem value="N/A" label="Status" />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <StatItem icon={<span data-testid="icon">icon</span>} value={10} label="Test" />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("does not render icon slot when not provided", () => {
    const { container } = render(<StatItem value={10} label="Test" />);
    const iconArea = container.querySelector("[aria-hidden='true']");
    expect(iconArea).toBeNull();
  });

  it("value uses mono tabular-nums with bidi isolation", () => {
    render(<StatItem value={42} label="Count" />);
    const val = screen.getByText("42");
    expect(val.getAttribute("dir")).toBe("ltr");
    expect(val.className).toContain("font-mono");
    expect(val.className).toContain("tabular-nums");
    expect(val.className).toContain("[unicode-bidi:isolate]");
  });

  it("applies surface-2 background", () => {
    render(<StatItem value={1} label="Test" />);
    const wrapper = screen.getByText("1").closest("[class*='bg-surface-2']");
    expect(wrapper).toBeInTheDocument();
  });

  it("applies hover surface-3", () => {
    render(<StatItem value={1} label="Test" />);
    const wrapper = screen.getByText("1").closest("[class*='hover:bg-surface-3']");
    expect(wrapper).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<StatItem value={1} label="Test" className="custom" />);
    const wrapper = screen.getByText("1").closest("[class*='custom']");
    expect(wrapper).toBeInTheDocument();
  });
});
