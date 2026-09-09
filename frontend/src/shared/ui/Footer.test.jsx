import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer.jsx";

function renderFooter(props = {}) {
  return render(
    <MemoryRouter>
      <Footer {...props} />
    </MemoryRouter>,
  );
}

describe("Footer", () => {
  it("renders copyright with current year", () => {
    renderFooter();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`©.*${year}`))).toBeInTheDocument();
  });

  it("renders TechForPalestine link", () => {
    renderFooter();
    const link = screen.getByRole("link", { name: /techforpalestine/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://data.techforpalestine.org");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies hairline border-top class", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer.className).toContain("border-t");
    expect(footer.className).toContain("border-hairline");
  });

  it("applies muted text color", () => {
    renderFooter();
    const footer = screen.getByRole("contentinfo");
    expect(footer.className).toContain("text-text-3");
  });

  it("applies custom className", () => {
    renderFooter({ className: "custom-footer" });
    const footer = screen.getByRole("contentinfo");
    expect(footer.className).toContain("custom-footer");
  });
});
