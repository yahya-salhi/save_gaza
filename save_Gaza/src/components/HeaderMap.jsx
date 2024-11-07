import { useLocation } from "react-router-dom";

function HeaderMap() {
  const location = useLocation();
  return (
    <div>
      <h2>
        The Human Toll || <span className="green"> Daily casualties</span>
      </h2>
      <p>
        {" "}
        Since October 7,2023 For{" "}
        {location.pathname === "/app/gaza" ? "gaza" : "westbank"}
      </p>
    </div>
  );
}

export default HeaderMap;
