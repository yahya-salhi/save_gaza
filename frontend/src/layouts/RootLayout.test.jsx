import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./RootLayout.jsx";

function renderRootLayout(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<div>Test Content</div>} />
          <Route path="/submit" element={<div>Submit Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("RootLayout", () => {
  it("renders navbar", () => {
    renderRootLayout();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders footer", () => {
    renderRootLayout();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders child content via Outlet", () => {
    renderRootLayout();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders different child content on different routes", () => {
    renderRootLayout("/submit");
    expect(screen.getByText("Submit Page")).toBeInTheDocument();
  });

  it("applies min-h-screen and flex column layout", () => {
    renderRootLayout();
    const wrapper = screen.getByRole("banner").parentElement;
    expect(wrapper.className).toContain("min-h-screen");
    expect(wrapper.className).toContain("flex");
    expect(wrapper.className).toContain("flex-col");
  });

  it("main element has flex-1 to push footer down", () => {
    renderRootLayout();
    const main = screen.getByRole("main");
    expect(main.className).toContain("flex-1");
  });
});
