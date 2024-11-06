import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Homepages from "./pages/Homepages";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import GazaSummary from "./components/GazaSummary";
import { useEffect, useState } from "react";
import WestBankSummary from "./components/WestBankSummary";
import IndexSummary from "./components/IndexSummary";
function App() {
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
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <Homepages gaza={gaza} isLoading={isLoading} error={error} />
          }
        />
        <Route path="page1" element={<Page1 />} />
        <Route path="page2" element={<Page2 />} />
        <Route path="app" element={<AppLayout />}>
          <Route
            index
            element={<IndexSummary gaza={gaza} isLoading={isLoading} />}
          />
          <Route
            path="gaza"
            element={<GazaSummary gaza={gaza} isLoading={isLoading} />}
          />
          <Route
            path="westBank"
            element={
              <WestBankSummary westBank={westBank} isLoading={isLoading} />
            }
          />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
