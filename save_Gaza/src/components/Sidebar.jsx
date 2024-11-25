import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";
// import GazaSummary from "./GazaSummary";
import { Outlet, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const isGazaDetailsRoute = location.pathname.includes("/app/gaza/");

  return (
    <div className={styles.sidebar}>
      <AppNav />

      <div className={styles.content}>
        {!isGazaDetailsRoute && <Outlet />}
        {/* {location.pathname === "/app/gaza" && (
          <div className={styles.summaryWrapper}>
            <GazaSummary />
        
          </div>
        )} */}
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
