import type { MessageSolo } from "../../../../../types/messageSolo";
import { Link } from "react-router";

type messageProps = {
  message: MessageSolo;
};

function Message({ message }: messageProps) {
  if (message.imageUrl) {
    return (
      <div className="message">
        <h3>
          <img src={message.sender.pfpUrl} alt="" />
          <Link to={`/user/${message.senderId}`}>
            {message.sender.username}
          </Link>
          : {message.message}
        </h3>
        <img src={message.imageUrl} alt="message image" />
        <p>{message.timeSent}</p>
      </div>
    );
  }
  return (
    <div className="message">
      <h3>
        <img src={message.sender.pfpUrl} alt="" />
        <Link to={`/user/${message.senderId}`}>
          {message.sender.username}
        </Link>: {message.message}
      </h3>
      <p>{message.timeSent}</p>
    </div>
  );
}

export default Message;
