import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "./DashboardPage.jsx";

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={["/app"]}>
      <DashboardPage />
    </MemoryRouter>,
  );
}

describe("DashboardPage", () => {
  it("renders the dashboard header", () => {
    renderDashboard();
    expect(
      screen.getByRole("heading", { name: /war in gaza/i }),
    ).toBeInTheDocument();
  });

  it("renders breadcrumbs with Dashboard current", () => {
    renderDashboard();
    const nav = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    const current = nav.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent("Dashboard");
  });

  it("renders the static map banner", () => {
    renderDashboard();
    expect(
      screen.getByRole("img", { name: /map preview placeholder/i }),
    ).toBeInTheDocument();
  });

  it("renders the statistics placeholder", () => {
    renderDashboard();
    expect(screen.getByText(/statistics arrive/i)).toBeInTheDocument();
  });
});
