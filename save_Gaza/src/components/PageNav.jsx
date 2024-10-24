import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
function PageNav() {
  return (
    <nav className={styles.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/page1">page1</NavLink>
        </li>
        <li>
          <NavLink to="/page2">page2</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
