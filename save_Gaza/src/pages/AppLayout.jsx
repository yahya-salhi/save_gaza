import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import Logo from "../components/Logo";
import HeaderMap from "../components/HeaderMap";
import styles from "./AppLayout.module.css";
import DetailsSummary from "../components/DetailsSummary";
import GazaMap from "../components/GazaMap/Components/GazaMap";

const ROUTES = {
  GAZA: "/app/gaza",
  WEST_BANK: "/app/westBank",
  GAZA_MAP: "/app/gazaMap",
};

const RouteComponents = {
  [ROUTES.GAZA]: Map,
  [ROUTES.WEST_BANK]: Map,
  [ROUTES.GAZA_MAP]: GazaMap,
};

export default function AppLayout() {
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const location = useLocation();
  const currentRoute = Object.keys(ROUTES).find((key) =>
    location.pathname.includes(ROUTES[key])
  );
  const isQueryStringRoute = searchParams.has("details");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (location.pathname.includes(ROUTES.GAZA_MAP)) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          location.pathname.includes(ROUTES.GAZA)
            ? "https://data.techforpalestine.org/api/v2/casualties_daily.json"
            : "https://data.techforpalestine.org/api/v2/west_bank_daily.min.json"
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const fetchedData = await res.json();
        setData(fetchedData);
        if (fetchedData.length > 0) {
          setSelectedDate(fetchedData[fetchedData.length - 1].report_date);
        }
      } catch (err) {
        setError("There was an error loading API data");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatistics();
  }, [location.pathname]);

  const renderMainContent = () => {
    if (isQueryStringRoute) return <DetailsSummary />;

    if (location.pathname.includes(ROUTES.GAZA_MAP)) {
      return <GazaMap />;
    }

    const Component = RouteComponents[ROUTES[currentRoute]] || (() => null);
    return (
      <Component
        isLoading={isLoading}
        data={data}
        error={error}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    );
  };

  return (
    <div className={`${styles.app} ${sidebarOpen ? styles.sidebarActive : ""}`}>
      <header className={styles.header}>
        <Logo />
        <h1>
          <span className={styles.red}>War</span>{" "}
          <span className={styles.green}>in Gaza</span>
        </h1>
        <NavLink to={ROUTES.GAZA_MAP}>
          <button className={styles.learnMoreBtn}>Learn More</button>
        </NavLink>
        <button
          className={styles.menuBtn}
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div className={styles.content}>
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <button
            className={styles.closeSidebarBtn}
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
          <Sidebar />
        </aside>

        <main className={styles.main}>
          <HeaderMap />
          <div className={styles.map}>{renderMainContent()}</div>
        </main>
      </div>
    </div>
  );
}
