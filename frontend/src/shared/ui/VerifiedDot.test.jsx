import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VerifiedDot from "./VerifiedDot.jsx";

describe("VerifiedDot", () => {
  it("renders default label", () => {
    render(<VerifiedDot />);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("renders custom label", () => {
    render(<VerifiedDot label="Confirmed" />);
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("renders 8px green dot", () => {
    const { container } = render(<VerifiedDot />);
    const dot = container.querySelector(".bg-verified");
    expect(dot).toBeInTheDocument();
    expect(dot.className).toContain("h-2");
    expect(dot.className).toContain("w-2");
    expect(dot.className).toContain("rounded-full");
  });

  it("dot has aria-hidden", () => {
    const { container } = render(<VerifiedDot />);
    const dot = container.querySelector(".bg-verified");
    expect(dot).toHaveAttribute("aria-hidden", "true");
  });

  it("label uses neutral text color", () => {
    render(<VerifiedDot />);
    const label = screen.getByText("Verified");
    expect(label.className).toContain("text-text-2");
  });

  it("does NOT use green background on wrapper", () => {
    const { container } = render(<VerifiedDot />);
    const wrapper = container.firstChild;
    expect(wrapper.className).not.toContain("bg-verified");
    expect(wrapper.className).not.toContain("bg-green");
  });

  it("applies custom className", () => {
    render(<VerifiedDot className="custom" />);
    const wrapper = screen.getByText("Verified").parentElement;
    expect(wrapper.className).toContain("custom");
  });
});
