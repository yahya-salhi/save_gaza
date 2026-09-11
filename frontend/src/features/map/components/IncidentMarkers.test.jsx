import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import MapCanvas from "./MapContainer.jsx";
import { boundariesFixture } from "../__fixtures__/boundaries.js";
import { pinsFixture, emptyPinsFixture } from "../__fixtures__/pins.js";

// Warm up the lazily-loaded Leaflet canvas before timers start.
await import("./MapContainer.jsx");

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  };
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  function Wrapper({ children }) {
    return createElement(QueryClientProvider, { client: queryClient }, children);
  }
  return Wrapper;
}

/** Route stubbed fetches: pins go to the pins fixture, everything else to boundaries. */
function stubPinFetches(pinsBody) {
  return vi.fn((url) => {
    if (String(url).includes("/incidents/pins")) {
      return Promise.resolve(jsonResponse(pinsBody));
    }
    return Promise.resolve(jsonResponse(boundariesFixture));
  });
}

function renderCanvas(onSelect = () => {}) {
  return render(
    createElement(MapCanvas, {
      data: boundariesFixture.data,
      selectedId: null,
      onSelect,
    }),
    { wrapper: createWrapper() },
  );
}

/** All vector paths (5 polygons + N markers) in the Leaflet overlay pane. */
function overlayPaths(container) {
  return container.querySelectorAll(".leaflet-overlay-pane svg path");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Pin-styled SVG paths — the flat `className` reaches Leaflet's `_initPath`. */
function pinPaths(container) {
  return container.querySelectorAll(
    '.leaflet-overlay-pane svg path[class*="pinMarker"]',
  );
}

/**
 * Settle the canvas: the mount-settle `moveend` can remount markers once, so
 * two consecutive polls must agree before touching a node.
 */
async function settleCanvas(container, pins) {
  await waitFor(
    async () => {
      const first = overlayPaths(container).length;
      await new Promise((r) => setTimeout(r, 400));
      expect(overlayPaths(container)).toHaveLength(first);
      expect(first).toBe(5 + pins);
    },
    { timeout: 15000 },
  );
}

describe("incident markers", () => {
  it("renders one styled marker per pin on top of the five polygons", async () => {
    vi.stubGlobal("fetch", stubPinFetches(pinsFixture));
    const { container } = renderCanvas();

    await settleCanvas(container, pinsFixture.data.items.length);
    expect(pinPaths(container)).toHaveLength(pinsFixture.data.items.length);
  });

  it("opens the themed pin popup on marker click without touching selection", async () => {
    vi.stubGlobal("fetch", stubPinFetches(pinsFixture));
    const onSelect = vi.fn();
    const { container } = renderCanvas(onSelect);

    await settleCanvas(container, 2);
    // Markers follow the five polygons in DOM order; re-query fresh so the
    // click never lands on a node replaced by the mount-settle remount.
    const marker = pinPaths(container)[0];
    expect(marker).toBeDefined();
    fireEvent.click(marker);

    expect(
      await screen.findByText("Clinic strike report"),
    ).toBeInTheDocument();
    expect(screen.getByText(/field report/i)).toBeInTheDocument();
    expect(screen.getByText("2026-09-08")).toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders a clean map with no markers when no pins are approved", async () => {
    vi.stubGlobal("fetch", stubPinFetches(emptyPinsFixture));
    const { container } = renderCanvas();

    await waitFor(() => expect(overlayPaths(container)).toHaveLength(5));
    expect(screen.queryByText(/field report/i)).not.toBeInTheDocument();
  });

  it("keeps the boundaries map usable when the pins request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (String(url).includes("/incidents/pins")) {
          return Promise.resolve(jsonResponse({}, false, 503));
        }
        return Promise.resolve(jsonResponse(boundariesFixture));
      }),
    );
    const { container } = renderCanvas();

    // Polygons still render; the pins layer stays silent-null.
    await waitFor(() => expect(overlayPaths(container)).toHaveLength(5));
    expect(
      screen.getByLabelText(/interactive map of gaza governorates/i),
    ).toBeInTheDocument();
  });

  it("queries the pins endpoint with the Gaza bbox window", async () => {
    const fetchMock = stubPinFetches(pinsFixture);
    vi.stubGlobal("fetch", fetchMock);
    const { container } = renderCanvas();

    await waitFor(() => expect(overlayPaths(container)).toHaveLength(5 + 2));
    const pinsCall = fetchMock.mock.calls.find((call) =>
      String(call[0]).includes("/incidents/pins"),
    );
    expect(pinsCall).toBeDefined();
    expect(String(pinsCall[0])).toContain("bbox=34.2,31.18,34.58,31.62");
  });
});
