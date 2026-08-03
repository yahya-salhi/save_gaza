import { useLocation } from "react-router-dom";
import styles from "./HeaderMap.module.css";

function HeaderMap() {
  const location = useLocation();
  const isGaza =
    location.pathname.startsWith("/app/gaza") || location.pathname === "/app";

  return (
    <div className={styles.header}>
      <p className={styles.kicker}>Live record</p>
      <h2 className={styles.title}>
        The human toll · <span className={styles.location}>{isGaza ? "Gaza" : "West Bank"}</span>
      </h2>
      <p className={styles.subtitle}>Daily casualties since 07 Oct 2023</p>
    </div>
  );
}

export default HeaderMap;
