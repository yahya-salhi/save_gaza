import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function renderNavbar(props = {}, route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Navbar {...props} />
    </MemoryRouter>,
  );
}

describe("Navbar", () => {
  it("renders site name as link to home", () => {
    renderNavbar();
    const link = screen.getByRole("link", { name: /save gaza/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders dashboard link", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/app",
    );
  });

  it("renders report link", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: /report/i })).toHaveAttribute(
      "href",
      "/submit",
    );
  });

  it("renders hamburger toggle when onMenuToggle is provided", () => {
    renderNavbar({ onMenuToggle: vi.fn() });
    expect(
      screen.getByRole("button", { name: /toggle navigation menu/i }),
    ).toBeInTheDocument();
  });

  it("does not render hamburger toggle when onMenuToggle is null", () => {
    renderNavbar({ onMenuToggle: null });
    expect(
      screen.queryByRole("button", { name: /toggle navigation menu/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onMenuToggle when hamburger is clicked", async () => {
    const user = userEvent.setup();
    const onMenuToggle = vi.fn();
    renderNavbar({ onMenuToggle });
    await user.click(
      screen.getByRole("button", { name: /toggle navigation menu/i }),
    );
    expect(onMenuToggle).toHaveBeenCalledTimes(1);
  });

  it("applies sticky positioning and backdrop blur", () => {
    renderNavbar();
    const header = screen.getByRole("banner");
    expect(header.className).toContain("sticky");
    expect(header.className).toContain("backdrop-blur");
  });

  it("applies custom className", () => {
    renderNavbar({ className: "custom-class" });
    const header = screen.getByRole("banner");
    expect(header.className).toContain("custom-class");
  });
});
