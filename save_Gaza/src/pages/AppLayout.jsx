import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import Logo from "../components/Logo";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
            <Map />
          </div>
          <div className={styles.infoPanel}>
            <div className={styles.stat}>
              <h2>Deaths</h2>
              <p>448</p>
            </div>
            <div className={styles.stat}>
              <h2>Injuries</h2>
              <p>240</p>
            </div>
            <div className={styles.stat}>
              <h2>Displaced</h2>
              <p>52,000</p>
            </div>
            <div className={styles.stat}>
              <h2>Buildings Destroyed</h2>
              <p>1,800</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
