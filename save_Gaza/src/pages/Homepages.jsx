import { Link } from "react-router-dom";
import styles from "./Homepages.module.css";
import { useRef, useState } from "react";
import { useSummary } from "../context/SummaryContext";

function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("en-US");
}

function Homepages() {
  const { gaza, westBank, isLoading, error } = useSummary();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const killed = gaza?.killed?.total;
  const injured = gaza?.injured?.total;
  const westBankKilled = westBank?.killed?.total;
  const reportDate = gaza?.report_date || westBank?.report_date || null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className={styles.homepage}>
      <section className={styles.hero} aria-labelledby="toll-heading">
        <p className={styles.ticker}>
          <span className={styles.liveDot} aria-hidden="true" />
          Gaza · verified data feed
          {reportDate ? ` · report ${reportDate}` : ""}
        </p>

        <h1 id="toll-heading" className={styles.heading}>
          The death toll in Gaza
        </h1>
        <p className={styles.figure} aria-live="polite">
          {isLoading || error ? "—" : formatNumber(killed)}
        </p>
        <p className={styles.figureCaption}>verified killed · since 07 Oct 2023</p>

        <div className={styles.rule} aria-hidden="true" />

        <dl className={styles.instrument}>
          <div className={styles.instrumentItem}>
            <dt>Injured</dt>
            <dd>{isLoading || error ? "—" : formatNumber(injured)}</dd>
          </div>
          <div className={styles.instrumentItem}>
            <dt>West Bank killed</dt>
            <dd>{isLoading || error ? "—" : formatNumber(westBankKilled)}</dd>
          </div>
        </dl>

        {error && (
          <p className={styles.dataNotice} role="status">
            Live figures are unreachable right now. Open the dashboard to retry
            the daily feed.
          </p>
        )}

        <Link to="/app" className={styles.ctaLink}>
          Open the dashboard
        </Link>
      </section>

      <section
        className={styles.everyHour}
        aria-labelledby="every-hour-heading"
      >
        <h2 id="every-hour-heading">Every hour in Gaza</h2>
        <ul className={styles.everyHourList}>
          <li>
            <span>15</span> people killed · six are children
          </li>
          <li>
            <span>35</span> people injured
          </li>
          <li>
            <span>42</span> bombs dropped
          </li>
          <li>
            <span>12</span> buildings destroyed
          </li>
        </ul>
        <p className={styles.note}>
          Based on reports from the first six days of the war.
        </p>
      </section>

      <section className={styles.videoSection} aria-label="Documentary video">
        <h2 className={styles.videoTitle}>Watch: ground reports from Gaza</h2>
        <div className={styles.videoFrame}>
          <video
            ref={videoRef}
            controls
            preload="none"
            poster="/image5.jpg"
            className={styles.video}
            onEnded={() => setIsPlaying(false)}
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={togglePlay}
            className={styles.playButton}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Homepages;
