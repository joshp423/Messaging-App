import { useOutletContext } from "react-router-dom";
import Messages from "./Messages/messages";
import NewConversation from "./NewConversation/newConversation";

type homepageProps = {
  loginStatus: boolean;
};

function Homepage() {
  const { loginStatus } = useOutletContext<homepageProps>();

  if (loginStatus) {
    return (
      <div className="hpMain">
        <NewConversation />
        <Messages />
      </div>
    )
  }

  return <div className="hpMain"></div>;
}

export default Homepage;
