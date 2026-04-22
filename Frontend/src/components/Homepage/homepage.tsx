import { useOutletContext } from "react-router-dom";
import Messages from "./Messages/messages";
import "./homepage.css";
import Login from "../Login/login";

type homepageProps = {
  loginStatus: boolean;
};

function Homepage() {
  const { loginStatus } = useOutletContext<homepageProps>();

  if (loginStatus) {
    return <Messages />;
  }

  return <Login />;
}

export default Homepage;
