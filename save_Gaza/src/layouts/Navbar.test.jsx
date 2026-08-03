import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, THEME_KEY } from "../shared/providers/ThemeProvider";
import Navbar from "./Navbar";

function renderNavbar(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.className = "";
});

afterEach(() => {
  document.documentElement.className = "";
  window.localStorage.clear();
});

describe("Navbar", () => {
  it("renders the site navigation links", () => {
    renderNavbar();
    for (const label of ["Map", "Statistics", "Submit Incident", "Admin"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("marks the active route link", () => {
    renderNavbar("/app/gaza");
    expect(screen.getByRole("link", { name: "Statistics" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders a theme toggle reflecting the current theme", () => {
    renderNavbar();
    expect(
      screen.getByRole("button", { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });

  it("toggles the theme when the toggle is clicked", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(
      screen.getByRole("button", { name: /switch to light theme/i })
    );

    expect(
      screen.getByRole("button", { name: /switch to dark theme/i })
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("light-theme");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("opens the mobile navigation menu", async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    );

    expect(
      screen.getByRole("button", { name: /close navigation menu/i })
    ).toBeInTheDocument();
  });
});
