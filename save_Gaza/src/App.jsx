import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Homepages from "./pages/Homepages";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import GazaSummary from "./components/GazaSummary";

import WestBankSummary from "./components/WestBankSummary";
import IndexSummary from "./components/IndexSummary";
import GazaMap from "./components/GazaMap";

import DetailsSummary from "./components/DetailsSummary";
import { SummaryProvider } from "./context/SummaryContext";

function App() {
  return (
    <SummaryProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepages />} />
          <Route path="page1" element={<Page1 />} />
          <Route path="page2" element={<Page2 />} />
          <Route path="app" element={<AppLayout />}>
            <Route index element={<IndexSummary />} />
            <Route path="gaza" element={<GazaSummary />} />
            <Route path="gaza/:param" element={<DetailsSummary />} />

            <Route path="westBank" element={<WestBankSummary />} />
            <Route path="gazaMap" element={<GazaMap />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </SummaryProvider>
  );
}

export default App;
