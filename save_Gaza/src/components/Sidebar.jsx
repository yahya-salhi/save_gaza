import styeles from "./Sidebar.module.css";
import AppNav from "./AppNav";
import Logo from "./Logo";

function Sidebar() {
  return (
    <div className={styeles.sidebar}>
      <Logo />
      <AppNav />
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
