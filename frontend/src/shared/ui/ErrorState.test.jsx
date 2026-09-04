import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorState from "./ErrorState.jsx";

describe("ErrorState", () => {
  it("renders default error message", () => {
    render(<ErrorState />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders custom error message", () => {
    render(<ErrorState message="Connection failed" />);
    expect(screen.getByText("Connection failed")).toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("does not render retry button by default", () => {
    const { container } = render(<ErrorState />);
    expect(container.querySelector("button")).toBeNull();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders danger dot indicator", () => {
    const { container } = render(<ErrorState />);
    const dot = container.querySelector(".bg-danger");
    expect(dot).toBeInTheDocument();
    expect(dot.className).toContain("h-3");
    expect(dot.className).toContain("w-3");
  });

  it("applies custom className", () => {
    render(<ErrorState className="custom" />);
    const wrapper = screen.getByText("Something went wrong").parentElement;
    expect(wrapper.className).toContain("custom");
  });
});
