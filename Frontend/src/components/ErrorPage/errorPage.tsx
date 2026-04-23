import { useLocation } from "react-router-dom";
import "./errorPage.css";

type errorPageState = {
  error: string;
};

function ErrorPage() {
  const location = useLocation();
  const error = location.state as errorPageState | null;

  return (
    <div className="errorPage">
      <h1>Something went wrong</h1>
      <p>{error?.error}</p>
      <p>Please try again later.</p>
    </div>
  );
}

export default ErrorPage;
