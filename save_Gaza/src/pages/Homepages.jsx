/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "./Homepages.module.css";
import PageNav from "../components/PageNav";
import { useRef, useState } from "react";

function Homepages({ gaza, isLoading, error }) {
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
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const { killed, injured } = gaza || {};
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          Do <span className="red"> Not</span> Ignore
          <span className="green">Palestinian</span> Suffring
        </h1>
        <br />
        <h2>
          Stay up to date with the latest News From Gaza
          <br />
          The latest death toll stands a
          <span className="bloody-text">{killed?.total || 0} </span>
          Palestinians and{" "}
          <span className="bloody-text">{injured?.total || 0}</span>
          people injured since October 7, 2023.
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
            <source src="video.mp4" type="video/mp4" />
          </video>
          <button onClick={togglePlay} className={styles.playButton}>
            {isPlaying ? "Pause Video" : "Play Video"}
          </button>
        </section>
      </div>
      <section className={styles.statisticsSection}>
        <img src="gazaevryhour.webp" alt="war in gaza" />
        <div className={styles.statisticsText}>
          <p>Every hour in Gaza:</p>
          <ul>
            <li>15 people are killed. Six are children.</li>
            <li>35 people are injured.</li>
            <li>42 bombs are dropped.</li>
            <li>12 buildings are destroyed.</li>
          </ul>
          <p className={styles.note}>
            *Based on the first six days of the war, according to the Israeli
            army.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Homepages;
