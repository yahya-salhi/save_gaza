import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

export default function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink
            to="gaza"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Gaza Summary
          </NavLink>
        </li>
        <li>
          <NavLink
            to="westBank"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            West Bank Summary
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
