import { useOutletContext } from "react-router-dom";
import Messages from "./Messages/messages";
import "./homepage.css"

type homepageProps = {
  loginStatus: boolean;
};

function Homepage() {
  const { loginStatus } = useOutletContext<homepageProps>();

  if (loginStatus) {
    return <Messages />;
  }

  return <div className="hpMain"></div>;
}

export default Homepage;
