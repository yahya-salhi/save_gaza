import { Link, NavLink } from "react-router-dom";
function PageNav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/page1">page1</NavLink>
        </li>
        <li>
          <NavLink to="/page2">page2</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
