import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "./EmptyState.jsx";

describe("EmptyState", () => {
  it("renders default message", () => {
    render(<EmptyState />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<EmptyState message="No reports found" />);
    expect(screen.getByText("No reports found")).toBeInTheDocument();
  });

  it("renders action slot when provided", () => {
    render(
      <EmptyState action={<button>Add item</button>} />,
    );
    expect(screen.getByRole("button", { name: /add item/i })).toBeInTheDocument();
  });

  it("does not render action slot by default", () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("applies custom className", () => {
    render(<EmptyState className="custom" />);
    const wrapper = screen.getByText("No data available").parentElement;
    expect(wrapper.className).toContain("custom");
  });

  it("uses muted text color", () => {
    render(<EmptyState />);
    const msg = screen.getByText("No data available");
    expect(msg.className).toContain("text-text-3");
  });
});
