import { useParams } from "react-router-dom";

function DetailsSummaryKilled() {
  const { parameter } = useParams();

  return (
    <div>
      <h1> {parameter}</h1>
    </div>
  );
}

export default DetailsSummaryKilled;
