import { Link } from "react-router-dom";
import styles from "./Logo.module.css";
function Logo() {
  return (
    <Link to="/">
      <div className={styles.navbarLogo}>
        <img src="/logo.png" alt="logo save Gaza" className={styles.logo} />
        <span>
          <p className={styles.logoText}> Save Gaza </p>
        </span>
      </div>
    </Link>
  );
}

export default Logo;
