import { useEffect } from "react";
import { useLocation, useSearchParams, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import Logo from "../components/Logo";
import HeaderMap from "../components/HeaderMap";
import styles from "./AppLayout.module.css";
import DetailsSummary from "../components/DetailsSummary";
import GazaMap from "../components/GazaMap/Components/GazaMap";
import { useAppContext, ActionTypes } from "../context/AppContext"; // Import AppContext utilities

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
  const { state, dispatch } = useAppContext();
  const { sidebarOpen, isLoading, data, error, selectedDate } = state;

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentRoute = Object.keys(ROUTES).find((key) =>
    location.pathname.includes(ROUTES[key])
  );
  const isQueryStringRoute = searchParams.has("details");

  const toggleSidebar = () => dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });

  useEffect(() => {
    const fetchStatistics = async () => {
      if (location.pathname.includes(ROUTES.GAZA_MAP)) return;

      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.SET_ERROR, payload: null });

      try {
        const res = await fetch(
          location.pathname.includes(ROUTES.GAZA)
            ? "https://data.techforpalestine.org/api/v2/casualties_daily.json"
            : "https://data.techforpalestine.org/api/v2/west_bank_daily.min.json"
        );
        if (!res.ok) throw new Error("Network response was not ok");

        const fetchedData = await res.json();
        dispatch({ type: ActionTypes.SET_DATA, payload: fetchedData });

        if (fetchedData.length > 0) {
          dispatch({
            type: ActionTypes.SET_SELECTED_DATE,
            payload: fetchedData[fetchedData.length - 1].report_date,
          });
        }
      } catch (err) {
        dispatch({
          type: ActionTypes.SET_ERROR,
          payload: "There was an error loading API data",
        });
        console.error("Fetch error:", err);
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    };

    fetchStatistics();
  }, [location.pathname, dispatch]);

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
        setSelectedDate={(date) =>
          dispatch({ type: ActionTypes.SET_SELECTED_DATE, payload: date })
        }
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
