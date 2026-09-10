import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GazaHistory } from "./GazaHistory.jsx";
import { historyFixture } from "./__fixtures__/history.js";

function jsonResponse(body, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    headers: new Headers(),
    json: vi.fn().mockResolvedValue(body),
  };
}

function blobResponse(disposition) {
  const headers = new Headers();
  if (disposition) headers.set("Content-Disposition", disposition);
  return {
    ok: true,
    status: 200,
    headers,
    blob: vi
      .fn()
      .mockResolvedValue(new Blob(["report_date\n2026-09-09\n"], { type: "text/csv" })),
  };
}

function renderHistory(initialEntries = ["/app/gaza?startDate=2026-09-06&endDate=2026-09-09"]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, cacheTime: 0 } },
  });
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <GazaHistory />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

function stubDownloadDom() {
  // NB: never stub the whole global URL — Testing Library needs the real
  // constructor. Only add the object-URL methods jsdom lacks. And never
  // mock appendChild — render() needs the real one. Only intercept "a"
  // elements; everything else falls through to the real createElement.
  URL.createObjectURL = vi.fn().mockReturnValue("blob:mock");
  URL.revokeObjectURL = vi.fn();
  const realCreateElement = document.createElement.bind(document);
  // Real anchor element (plain objects throw in appendChild) with only
  // click mocked — everything else on the element stays genuine.
  const anchor = realCreateElement("a");
  const click = vi.fn();
  anchor.click = click;
  vi.spyOn(document, "createElement").mockImplementation(
    (tagName, ...rest) => {
      if (String(tagName).toLowerCase() === "a") {
        return anchor;
      }
      return realCreateElement(tagName, ...rest);
    },
  );
  return click;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  // @ts-expect-error test-only cleanup of the stubbed object-URL methods
  delete URL.createObjectURL;
  // @ts-expect-error test-only cleanup of the stubbed object-URL methods
  delete URL.revokeObjectURL;
});

// Warm up the lazily-loaded chart modules so timers never starve mid-test.
await import("./TimeSeriesChart.jsx");
await import("./DemographicPie.jsx");

describe("GazaHistory export", () => {
  it("renders CSV and JSON download buttons after data loads", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(historyFixture)));
    renderHistory();

    await screen.findByLabelText("Gaza casualty trends");
    expect(screen.getByRole("button", { name: "Download CSV" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download JSON" })).toBeInTheDocument();
  });

  it("downloads the in-view window as CSV on click", async () => {
    const fetchMock = vi.fn((url) =>
      Promise.resolve(
        String(url).includes("/statistics/export")
          ? blobResponse('attachment; filename="gaza-history-2026-09-06-to-2026-09-09.csv"')
          : jsonResponse(historyFixture),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    renderHistory();

    await screen.findByLabelText("Gaza casualty trends");
    const click = stubDownloadDom();
    fireEvent.click(screen.getByRole("button", { name: "Download CSV" }));

    await waitFor(() => expect(click).toHaveBeenCalledTimes(1));
    const exportCall = fetchMock.mock.calls.find((call) =>
      String(call[0]).includes("/statistics/export"),
    );
    expect(exportCall[0]).toContain("startDate=2026-09-06");
    expect(exportCall[0]).toContain("endDate=2026-09-09");
    expect(exportCall[0]).toContain("format=csv");
  });

  it("shows an inline status message (no alert) when the download fails", async () => {
    const fetchMock = vi.fn((url) =>
      Promise.resolve(
        String(url).includes("/statistics/export")
          ? {
              ok: false,
              status: 400,
              headers: new Headers(),
              json: vi.fn().mockResolvedValue({
                success: false,
                data: null,
                error: { code: "VALIDATION_ERROR", message: "Bad range" },
              }),
            }
          : jsonResponse(historyFixture),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    renderHistory();

    await screen.findByLabelText("Gaza casualty trends");
    stubDownloadDom();
    fireEvent.click(screen.getByRole("button", { name: "Download JSON" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Bad range");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
