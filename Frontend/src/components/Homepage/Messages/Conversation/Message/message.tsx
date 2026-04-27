import type { MessageSolo } from "../../../../../types/messageSolo";
import { Link } from "react-router";
import "./message.css";

type messageProps = {
  message: MessageSolo;
};

function Message({ message }: messageProps) {
  const timeSent = new Date(message.timeSent).toLocaleString();
  const user = localStorage.getItem("loggedUsername");
  if (message.imageUrl) {
    return (
      <div
        className={`message ${user === message.sender.username ? "sentMessage" : "receivedMessage"}`}
      >
        <div>
          {message.sender.pfpUrl === "" ? (
            <i className="fa-solid fa-user"></i>
          ) : (
            <img src={message.sender.pfpUrl} alt="" />
          )}
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
          <h3>{message.message}</h3>
        </div>
        <img src={message.imageUrl} alt="message image" />
        <p>{timeSent}</p>
      </div>
    );
  }
  return (
    <div
      className={`message ${user === message.sender.username ? "sentMessage" : "receivedMessage"}`}
    >
      <div>
        <Link to={`/user/${message.senderId}`}>
          {message.sender.pfpUrl === "" ? (
            <i className="fa-solid fa-user"></i>
          ) : (
            <img src={message.sender.pfpUrl} alt="" />
          )}
          <h3>
            {user === message.sender.username
              ? ""
              : `${message.sender.username}: `}
          </h3>
        </Link>
        <h3>{message.message}</h3>
      </div>
      <p>{timeSent}</p>
    </div>
  );
}

export default Message;
