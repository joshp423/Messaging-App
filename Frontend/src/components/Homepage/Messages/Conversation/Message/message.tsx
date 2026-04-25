import type { MessageSolo } from "../../../../../types/messageSolo";
import { Link } from "react-router";
import "./message.css"

type messageProps = {
  message: MessageSolo;
};

function Message({ message }: messageProps) {
  const timeSent = new Date(message.timeSent).toLocaleString();
  const user = sessionStorage.getItem("loggedUsername");
  if (message.imageUrl) {
    return (
      <div className={`message ${user === message.sender.username ? "sentMessage" : "receivedMessage"}`}>
        <h3>
          <img src={message.sender.pfpUrl} alt="" />
          <Link
            to={
              user === message.sender.username
                ? `/user/${message.senderId}`
                : ""
            }
          >
            {user === message.sender.username
              ? ""
              : `${message.sender.username}: `}
          </Link>
          {message.message}
        </h3>
        <img src={message.imageUrl} alt="message image" />
        <p>{timeSent}</p>
      </div>
    );
  }
  return (
    <div className={`message ${user === message.sender.username ? "sentMessage" : "receivedMessage"}`}>
      <h3>
        <img src={message.sender.pfpUrl} alt="" />
        <Link
          to={
            user === message.sender.username ? `/user/${message.senderId}` : ""
          }
        >
          {user === message.sender.username
            ? ""
            : `${message.sender.username}: `}
        </Link>
        {message.message}
      </h3>
      <p>{timeSent}</p>
    </div>
  );
}

export default Message;
