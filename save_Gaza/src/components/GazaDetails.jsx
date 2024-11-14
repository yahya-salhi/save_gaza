/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import DetailsSummary from "./DetailsSummary";
import DetailsSummaryKilled from "./DetailsSummaryKilled";

function GazaDetails({ gaza }) {
  const { massacres, killed, injured } = gaza;
  const { parameter } = useParams();
  console.log(parameter);

  console.log(useParams(parameter));
  return (
    <div>
      {parameter === `${massacres}` && <DetailsSummary />}
      {parameter === `${killed.total}` && <DetailsSummaryKilled />}
      {parameter === `${killed.children}` && <DetailsSummaryKilled />}
    </div>
  );
}

export default GazaDetails;
