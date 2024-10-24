import { Link } from "react-router-dom";
import styles from "./Homepages.module.css";
import PageNav from "../components/PageNav";
import { useRef, useState } from "react";

function Homepages() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          {" "}
          Do <span className={styles.red}> Not</span> Ignore{" "}
          <span className={styles.green}>Palestinian</span> Suffring
        </h1>
        <br />
        <h2>
          Stay up to date with the latest News From Gaza
          <br />
          The latest death toll stands at{" "}
          <span className="bloody-text"> 43,552 </span>
          Palestinians and <span className="bloody-text">1,139</span> people
          injured since October 7, 2023.
        </h2>
        <Link to="/app" className="cta">
          Get More Details
        </Link>
      </section>
      <div className={styles.homeContainer}>
        <header className={styles.header}>
          <h1 className={styles.title}>What’s happening in Gaza in numbers</h1>
        </header>
        <section className={styles.vedioSection}>
          <video
            ref={videoRef}
            width="800"
            controls
            autoPlay
            loop
            className={styles.video}
          >
            <source src="../public/video.mp4" type="video/mp4" />
          </video>
          <button onClick={togglePlay} className={styles.playButton}>
            {isPlaying ? "Pause Video" : "Play Video"}
          </button>
        </section>
      </div>
    </main>
  );
}

export default Homepages;
