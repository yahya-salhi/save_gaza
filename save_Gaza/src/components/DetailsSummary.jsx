import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./DetailsSummary.module.css";
import Buttons from "./Buttons";
import { useSummary } from "../context/SummaryContext";

function DetailsSummary() {
  const { gaza } = useSummary();
  const [searchParams] = useSearchParams();
  const detail = searchParams.get("details");
  const navigate = useNavigate();

  const getDescription = (value) => {
    if (value === gaza?.massacres?.toString()) {
      return {
        title: "The Tragic Reality of Massacres in Gaza: A Closer Look",
        content: `In the context of the Gaza conflict, the word "Massacre" evokes harrowing images of destruction and despair, with reports suggesting that the toll of lives lost has reached staggering numbers. According to recent data, at least ${value} massacres have been reported in the region. This tragedy brings forth urgent questions about the impacts on the civilian population, the resilience of the community, and the pressing need for solutions to address this humanitarian crisis.`,
      };
    }
    if (value === gaza?.killed?.total?.toString()) {
      return {
        title: "Total Lives Lost in Gaza",
        content: `The devastating toll of the conflict has resulted in ${value} lives lost. Each number represents a person, a story, a family torn apart by the ongoing crisis.`,
      };
    }
    if (value === gaza?.killed?.children?.toString()) {
      return {
        title: "Children: The Most Vulnerable Victims",
        content: `Among the casualties, ${value} children have lost their lives. This heartbreaking statistic underscores the disproportionate impact of the conflict on the youngest and most vulnerable members of society.`,
      };
    }
    return {
      title: "Statistical Details",
      content: `Detailed information about the value: ${value}`,
    };
  };

  const details = getDescription(detail);

  if (!detail || !gaza) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>No data available</div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>{details.title}</h3>
        <div className={styles.content}>
          <p>{details.content}</p>
        </div>
        <Buttons type="back" onClick={() => navigate(-1)}>
          &larr; Back
        </Buttons>
      </div>
    </>
  );
}

export default DetailsSummary;
