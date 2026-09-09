import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardHeader from "./DashboardHeader.jsx";

describe("DashboardHeader", () => {
  it("renders the static WAR IN GAZA display heading", () => {
    render(<DashboardHeader />);
    expect(
      screen.getByRole("heading", { name: /war in gaza/i }),
    ).toBeInTheDocument();
  });

  it("renders the dashboard eyebrow", () => {
    render(<DashboardHeader />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
