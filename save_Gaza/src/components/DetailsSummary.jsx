import { useParams } from "react-router-dom";
function DetailsSummary() {
  const { parameter } = useParams();

  return (
    <>
      <h3>The Tragic Reality of Massacres in Gaza: A Closer Look </h3>
      <br />
      <p>
        In the context of the Gaza conflict, the word<mark>Massacre</mark>
        evokes harrowing images of destruction and despair, with reports
        suggesting that the toll of lives lost has reached staggering numbers.
        According to recent data, at least <mark>{parameter}</mark> massacres
        have been reported killed due to violence in the region. This tragedy
        brings forth urgent questions about the impacts on the civilian
        population, the resilience of the community, and the pressing need for
        solutions to address this humanitarian crisis.
      </p>
    </>
  );
}

export default DetailsSummary;
