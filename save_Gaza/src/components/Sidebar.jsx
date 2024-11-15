import styeles from "./Sidebar.module.css";
import AppNav from "./AppNav";
import { Outlet, useLocation } from "react-router-dom";
function Sidebar() {
  const location = useLocation();
  const isGazaDetailsRoute = location.pathname.includes("/app/gaza/");
  return (
    <div className={styeles.sidebar}>
      <AppNav />

      {!isGazaDetailsRoute && <Outlet />}
      <footer className={styeles.footer}>
        <p className={styeles.copyright}>
          &copy; copyright {new Date().getFullYear()}
          by yahya salhi
        </p>
      </footer>
    </div>
  );
}

export default Sidebar;
