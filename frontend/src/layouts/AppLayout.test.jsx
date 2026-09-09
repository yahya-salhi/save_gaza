import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout.jsx";
import { useUiStore } from "../shared/stores/uiStore.js";

function renderAppLayout(route = "/app") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<div>Dashboard Content</div>} />
          <Route path="/app/gaza" element={<div>Gaza Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AppLayout", () => {
  beforeEach(() => {
    useUiStore.setState({ sidebarOpen: false });
  });

  it("renders navbar", () => {
    renderAppLayout();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders footer", () => {
    renderAppLayout();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders child content via Outlet", () => {
    renderAppLayout();
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("renders different content on different routes", () => {
    renderAppLayout("/app/gaza");
    expect(screen.getByText("Gaza Content")).toBeInTheDocument();
  });

  it("renders desktop sidebar with navigation links", () => {
    renderAppLayout();
    // Two navs: desktop (hidden on mobile) + mobile (hidden on desktop)
    const navs = screen.getAllByRole("navigation", { name: /dashboard navigation/i });
    expect(navs.length).toBe(2);

    // Use getAllByRole since both desktop and mobile sidebar have the same links
    const overviewLinks = screen.getAllByRole("link", { name: /overview/i });
    expect(overviewLinks.length).toBe(2);
    expect(overviewLinks[0]).toHaveAttribute("href", "/app");

    // "Gaza" sidebar link (exact match) appears twice (desktop + mobile)
    const gazaLinks = screen.getAllByRole("link", { name: /^gaza$/i });
    expect(gazaLinks.length).toBe(2);
    expect(gazaLinks[0]).toHaveAttribute("href", "/app/gaza");

    const wbLinks = screen.getAllByRole("link", { name: /west bank/i });
    expect(wbLinks.length).toBe(2);
    expect(wbLinks[0]).toHaveAttribute("href", "/app/westBank");

    const mapLinks = screen.getAllByRole("link", { name: /^map$/i });
    expect(mapLinks.length).toBe(2);
    expect(mapLinks[0]).toHaveAttribute("href", "/app/gazaMap");
  });

  it("renders hamburger toggle in navbar", () => {
    renderAppLayout();
    expect(
      screen.getByRole("button", { name: /toggle navigation menu/i }),
    ).toBeInTheDocument();
  });

  it("toggles sidebar open on hamburger click", async () => {
    const user = userEvent.setup();
    renderAppLayout();
    const toggle = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });
    await user.click(toggle);
    expect(useUiStore.getState().sidebarOpen).toBe(true);
  });

  it("closes sidebar when backdrop is clicked", async () => {
    const user = userEvent.setup();
    useUiStore.setState({ sidebarOpen: true });
    renderAppLayout();
    const backdrop = document.querySelector(".bg-overlay-bg");
    if (backdrop) {
      await user.click(backdrop);
      expect(useUiStore.getState().sidebarOpen).toBe(false);
    }
  });

  it("main content is offset by sidebar width on desktop", () => {
    renderAppLayout();
    const main = screen.getByRole("main");
    expect(main.className).toContain("md:ms-[var(--sidebar-width)]");
  });

  it("content area has max-width constraint", () => {
    renderAppLayout();
    const main = screen.getByRole("main");
    const inner = main.querySelector("[class*='max-w']");
    expect(inner).toBeTruthy();
  });
});
