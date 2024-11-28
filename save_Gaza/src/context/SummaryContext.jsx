/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const SummaryContext = createContext();
function SummaryProvider({ children }) {
  const [gaza, setGaza] = useState(null);
  const [westBank, setWestBank] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(function () {
    async function fetchSummary() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://data.techforpalestine.org/api/v3/summary.min.json`
        );
        if (!res.ok) throw new Error("network response was not ok");
        const data = await res.json();
        setGaza(data.gaza);
        setWestBank(data.west_bank);
      } catch (err) {
        setError("there was an error loading Api data");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSummary();
  }, []);
  return (
    <SummaryContext.Provider
      value={{
        gaza,
        westBank,
        isLoading,
        error,
      }}
    >
      {children}
    </SummaryContext.Provider>
  );
}
function useSummary() {
  const context = useContext(SummaryContext);
  if (context === undefined)
    throw new Error("SummaryContext was used outside the SummaryProvider");
  return context;
}
export { SummaryProvider, useSummary };
