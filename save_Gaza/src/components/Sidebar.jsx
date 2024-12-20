import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";
// import GazaSummary from "./GazaSummary";
import { Outlet, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const isGazaDetailsRoute = location.pathname.includes("/app/gaza/");
  const isGazaMap = location.pathname.includes("app/gazaMap");

  return (
    <div className={styles.sidebar}>
      <AppNav />

      <div className={styles.content}>
        {!isGazaDetailsRoute && !isGazaMap && <Outlet />}
      </div>

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; copyright {new Date().getFullYear()} by yahya salhi
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
