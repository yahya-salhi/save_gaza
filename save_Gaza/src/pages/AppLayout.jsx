import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import Logo from "../components/Logo";
import styles from "../pages/AppLayout.module.css";

export default function AppLayout() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Logo />

        <h1>
          <span className="red">War</span>{" "}
          <span className="green">in Gaza</span>
        </h1>
        <button className={styles.learnMoreBtn}>Learn More</button>
      </header>

      <div className={styles.content}>
        <Sidebar />

        <div className={styles.main}>
          <Map />
          <div className={styles.infoPanel}>
            <div className={styles.stat}>
              <h2>Deaths</h2>
              <p>448 ppx</p>
            </div>
            <div className={styles.stat}>
              <h2>Injuries</h2>
              <p>240 ppx</p>
            </div>
            {/* Add additional stats or chart areas as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
