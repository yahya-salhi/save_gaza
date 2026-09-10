import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GazaMapPage from "./GazaMapPage.jsx";
import { boundariesFixture } from "../features/map/__fixtures__/boundaries.js";

// Warm up the lazily-loaded Leaflet canvas (and the heavy leaflet
// transform) before any test starts so timers never starve mid-test.
await import("../features/map/components/MapContainer.jsx");

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  };
}

function renderMap() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  return render(
    <MemoryRouter initialEntries={["/app/gazaMap"]}>
      <QueryClientProvider client={queryClient}>
        <GazaMapPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GazaMapPage", () => {
  it("renders the Gaza Map heading", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    renderMap();
    expect(
      screen.getByRole("heading", { name: /^gaza map$/i }),
    ).toBeInTheDocument();
  });

  it("displays a loading skeleton while fetching boundaries", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    renderMap();
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("displays an error with retry when boundaries fail", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 503)),
    );
    renderMap();
    expect(
      await screen.findByText(/boundary data temporarily unavailable/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("displays an empty state when no boundaries exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          success: true,
          data: { type: "FeatureCollection", features: [] },
          error: null,
          timestamp: "2026-09-10T00:00:00.000Z",
        }),
      ),
    );
    renderMap();
    expect(
      await screen.findByText(/no boundary data available/i),
    ).toBeInTheDocument();
  });

  it("renders the map canvas with five governorate buttons and a prompt", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(boundariesFixture)),
    );
    renderMap();
    expect(
      await screen.findByLabelText(/interactive map of gaza governorates/i),
    ).toBeInTheDocument();
    const group = screen.getByRole("group", { name: /gaza governorates/i });
    expect(group).toBeInTheDocument();
    for (const name of ["North Gaza", "Gaza", "Deir al-Balah", "Khan Younis", "Rafah"]) {
      expect(
        screen.getByRole("button", { name, exact: true }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText(/select a governorate to inspect it/i)).toBeInTheDocument();
  });

  it("selects a governorate on button click without casualty numbers", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse(boundariesFixture)),
    );
    const user = userEvent.setup();
    renderMap();
    const gazaButton = await screen.findByRole("button", { name: "Gaza", exact: true });
    await user.click(gazaButton);
    expect(gazaButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/selected: gaza/i)).toBeInTheDocument();
    expect(screen.getByText(/arrives in slice 4\.2/i)).toBeInTheDocument();
  });
});
