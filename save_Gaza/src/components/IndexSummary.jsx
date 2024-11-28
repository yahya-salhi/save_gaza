import { useSummary } from "../context/SummaryContext";

function IndexSummary() {
  const { gaza, isLoading } = useSummary();
  if (isLoading) return <p>Loading...</p>;
  const { reports, last_update } = gaza;
  return (
    <ul>
      <li>
        <strong>Last Update:</strong> {last_update}
      </li>
      <li>
        <strong>Reports:</strong> {reports}
      </li>
    </ul>
  );
}

export default IndexSummary;
