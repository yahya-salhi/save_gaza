import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import Logo from "../components/Logo";
import MapWest from "../components/MapWest";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const location = useLocation();

  return (
    <div className={`${styles.app} ${sidebarOpen ? styles.sidebarActive : ""}`}>
      <header className={styles.header}>
        <Logo />
        <h1>
          <span className={styles.red}>War</span>{" "}
          <span className={styles.green}>in Gaza</span>
        </h1>
        <button className={styles.learnMoreBtn}>Learn More</button>
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
          <div className={styles.map}>
            {location.pathname === "/app/westBank" ? <MapWest /> : <Map />}
          </div>
        </main>
      </div>
    </div>
  );
}
