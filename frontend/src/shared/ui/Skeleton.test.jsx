import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Skeleton from "./Skeleton.jsx";

describe("Skeleton", () => {
  it("renders default 3 skeleton lines", () => {
    const { container } = render(<Skeleton />);
    const bars = container.querySelectorAll("[role='status'] > div");
    expect(bars).toHaveLength(3);
  });

  it("renders custom count of skeleton lines", () => {
    const { container } = render(<Skeleton count={5} />);
    const bars = container.querySelectorAll("[role='status'] > div");
    expect(bars).toHaveLength(5);
  });

  it("sets aria-busy for loading state", () => {
    render(<Skeleton />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
  });

  it("has accessible loading label", () => {
    render(<Skeleton />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("applies animate-pulse to each bar", () => {
    const { container } = render(<Skeleton count={2} />);
    const bars = container.querySelectorAll("[role='status'] > div");
    bars.forEach((bar) => {
      expect(bar.className).toContain("animate-pulse");
    });
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom" />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain("custom");
  });

  it("last bar is narrower (60% width)", () => {
    const { container } = render(<Skeleton count={3} />);
    const bars = container.querySelectorAll("[role='status'] > div");
    expect(bars[2].style.width).toBe("60%");
    expect(bars[0].style.width).toBe("100%");
  });
});
