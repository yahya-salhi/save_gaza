import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeaderMapBanner from "./HeaderMapBanner.jsx";

describe("HeaderMapBanner", () => {
  it("renders the static map preview placeholder", () => {
    render(<HeaderMapBanner />);
    expect(
      screen.getByRole("img", { name: /map preview placeholder/i }),
    ).toBeInTheDocument();
  });

  it("does not mount a Leaflet container", () => {
    const { container } = render(<HeaderMapBanner />);
    expect(container.querySelector(".leaflet-container")).toBeNull();
  });
});
