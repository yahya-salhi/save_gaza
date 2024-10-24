import { Link } from "react-router-dom";
import styles from "./Logo.module.css";
function Logo() {
  return (
    <Link to="/">
      <div className={styles.navbarLogo}>
        <img
          src="../public/logo.png"
          alt="logo save Gaza"
          className={styles.logo}
        />
      </div>
      <p className={styles.logoText}> Save Gaza </p>
    </Link>
  );
}

export default Logo;
