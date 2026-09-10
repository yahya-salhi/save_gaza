import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegionInfo from "./RegionInfo.jsx";
import { regionFixture } from "../__fixtures__/region.js";
import { gazaLatestFixture } from "../../statistics/__fixtures__/gaza.js";

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: vi.fn().mockResolvedValue(body),
  };
}

function stubFetchByUrl() {
  return vi.fn((url) => {
    if (String(url).includes("/spatial/regions/")) {
      return Promise.resolve(jsonResponse(regionFixture));
    }
    if (String(url).includes("/statistics/gaza")) {
      return Promise.resolve(jsonResponse(gazaLatestFixture));
    }
    return Promise.resolve(jsonResponse({}, false, 404));
  });
}

function renderPanel(regionId, onClose = () => {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <RegionInfo regionId={regionId} onClose={onClose} />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RegionInfo", () => {
  it("invites selection without fetching when no region is selected", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    renderPanel(null);
    expect(
      screen.getByText(/select a governorate to inspect it/i),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("displays a loading skeleton while fetching region metadata", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    renderPanel("gaza");
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it("displays an error with retry when region metadata fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({}, false, 404)),
    );
    renderPanel("unknown-id");
    expect(
      await screen.findByText(/region details temporarily unavailable/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("shows identity plus Gaza-wide tally with the source disclaimer", async () => {
    vi.stubGlobal("fetch", stubFetchByUrl());
    renderPanel("gaza");

    expect(
      await screen.findByRole("heading", { name: "Gaza" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/governorate 2 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/34\.4573, 31\.5021/)).toBeInTheDocument();
    expect(
      screen.getByText(/per-governorate breakdowns are not published/i),
    ).toBeInTheDocument();
    // Gaza-wide context, never per-region casualty claims
    expect(screen.getByLabelText(/gaza-wide verified tally/i)).toBeInTheDocument();
  });

  it("shows the curated pre-war overview for the governorate", async () => {
    vi.stubGlobal("fetch", stubFetchByUrl());
    renderPanel("gaza");

    expect(await screen.findByText(/historic mediterranean port/i)).toBeInTheDocument();
    expect(screen.getByText("Gaza City", { selector: "dd" })).toBeInTheDocument();
    expect(screen.getByText(/74\.6 km²/)).toBeInTheDocument();
    expect(screen.getByText("652,597")).toBeInTheDocument();
    expect(screen.getByText("Al-Shati Camp")).toBeInTheDocument();
    expect(screen.getByText(/pcbs 2017 census/i)).toBeInTheDocument();
  });

  it("clears the selection through the close button", async () => {
    vi.stubGlobal("fetch", stubFetchByUrl());
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderPanel("gaza", onClose);

    const close = await screen.findByRole("button", { name: /clear selection/i });
    await user.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
