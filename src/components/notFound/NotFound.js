import { Link } from "react-router-dom";
import "./notFound.css"
const NotFound = () => {
  return (
    <main>
      <h1 class="error__title">
        Oops... we found an <span>404</span> error.
      </h1>
      <p class="error__subtitle">
        To main <Link to="/">page</Link>
      </p>
    </main>
  );
};
export default NotFound;
