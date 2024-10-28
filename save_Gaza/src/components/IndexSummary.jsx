/* eslint-disable react/prop-types */
function IndexSummary({ gaza, isLoading }) {
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
