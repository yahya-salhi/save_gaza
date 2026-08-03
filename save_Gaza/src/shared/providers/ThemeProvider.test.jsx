import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme, THEME_KEY } from "./ThemeProvider";

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button type="button" onClick={toggleTheme}>
        toggle theme
      </button>
    </div>
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

describe("ThemeProvider", () => {
  it("renders its children", () => {
    render(
      <ThemeProvider>
        <div>content</div>
      </ThemeProvider>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("defaults to dark and applies the dark class to the document root", () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement).not.toHaveClass("light-theme");
  });

  it("toggles to light, applies the light-theme class, and persists the choice", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement).toHaveClass("light-theme");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("toggles back to dark when called again", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    await user.click(screen.getByRole("button", { name: /toggle theme/i }));

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("initializes from a stored light preference", () => {
    window.localStorage.setItem(THEME_KEY, "light");
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).toHaveClass("light-theme");
  });

  it("throws when useTheme is used outside the provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ThemeProbe />)).toThrow(
      "useTheme must be used within a ThemeProvider"
    );
    consoleError.mockRestore();
  });
});
