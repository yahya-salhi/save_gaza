import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page1 from "./pages/Page1";
import Page2 from "./pages/Page2";
import Homepages from "./pages/Homepages";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepages />} />
        <Route path="page1" element={<Page1 />} />
        <Route path="page2" element={<Page2 />} />
        <Route path="app" element={<AppLayout />}>
          <Route index element={<p>last update {Date()} </p>} />
          <Route path="gaza" element={<p>summary gaza killed</p>} />
          <Route path="westBank" element={<p>summary WastBan killed</p>} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
