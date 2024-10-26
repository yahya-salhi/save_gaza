import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

export default function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="gaza">Gaza Summary</NavLink>
        </li>
        <li>
          <NavLink to="westBank">West Bank Summry</NavLink>
        </li>
      </ul>
    </nav>
  );
}
