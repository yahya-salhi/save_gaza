import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs.jsx";

function renderAt(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Breadcrumbs />
    </MemoryRouter>,
  );
}

describe("Breadcrumbs", () => {
  it("renders Home link and current Dashboard on /app", () => {
    renderAt("/app");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    const current = screen.getByText("Dashboard");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("appends the Gaza segment on /app/gaza", () => {
    renderAt("/app/gaza");
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/app");
    expect(screen.getByText("Gaza")).toHaveAttribute("aria-current", "page");
  });

  it("appends the West Bank segment on /app/westBank", () => {
    renderAt("/app/westBank");
    expect(screen.getByText("West Bank")).toHaveAttribute("aria-current", "page");
  });

  it("appends the Map segment on /app/gazaMap", () => {
    renderAt("/app/gazaMap");
    expect(screen.getByText("Map")).toHaveAttribute("aria-current", "page");
  });

  it("exposes a breadcrumb landmark", () => {
    renderAt("/app");
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
  });
});
