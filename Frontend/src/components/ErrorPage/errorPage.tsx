import { useLocation }  from "react-router-dom";
type errorPageState = {
    error: string
}

function ErrorPage(){
    const location = useLocation() ;
    const error = location.state as errorPageState | null;

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error?.error}</p>
      <p>Please try again later.</p>
    </div>
  );
}

export default ErrorPage