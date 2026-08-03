import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe("Footer", () => {
  it("renders the brand name", () => {
    renderFooter();
    expect(screen.getByText("Save Gaza")).toBeInTheDocument();
  });

  it("renders the footer navigation links", () => {
    renderFooter();
    for (const label of ["Map", "Statistics", "Submit Incident", "Admin"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("renders the current year in the copyright", () => {
    renderFooter();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year}`, "i"))).toBeInTheDocument();
  });
});
