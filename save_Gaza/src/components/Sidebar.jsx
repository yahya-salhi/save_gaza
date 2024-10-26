import { Outlet } from "react-router-dom";
import styeles from "./Sidebar.module.css";
import AppNav from "./AppNav";
function Sidebar() {
  return (
    <div className={styeles.sidebar}>
      <AppNav />
      <Outlet />
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
