import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "./Card.jsx";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom">Content</Card>);
    const card = container.firstElementChild;
    expect(card.className).toContain("custom");
  });

  it("applies base surface classes", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstElementChild;
    expect(card.className).toContain("bg-surface-1");
    expect(card.className).toContain("rounded-md");
    expect(card.className).toContain("border-hairline");
  });

  it("applies hover classes when hoverable", () => {
    const { container } = render(<Card hoverable>Content</Card>);
    const card = container.firstElementChild;
    expect(card.className).toContain("hover:shadow-e2");
  });

  it("does not apply hover classes by default", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstElementChild;
    expect(card.className).not.toContain("hover:shadow-e2");
  });

  it("forwards ref", () => {
    const ref = { current: null };
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("passes additional props", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).toBeInTheDocument();
  });
});
