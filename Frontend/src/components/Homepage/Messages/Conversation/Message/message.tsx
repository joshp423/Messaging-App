import type { messageSolo } from "../../../../../types/messageSolo";
import type { user } from "../../../../../types/user";

type messageProps = {
  message: messageSolo;
  usernames: user[]
};

function Message({ message, usernames }: messageProps) {
  
    let messageSenderUsername;
    usernames.forEach((username) => {
        if (username.id === message.senderId){
            messageSenderUsername = username.username;
        }
    })
  
    if (message.imageUrl) {
        return (
            <div className="message">
            <h3>`${messageSenderUsername}: ${message.message}`</h3>
            <img src={message.imageUrl} alt="message image" />
            <p>`${message.timeSent}`</p>
            </div>
        );
    }
  return (
    <div className="message">
      <h3>`${messageSenderUsername}: ${message.message}`</h3>
      <p>`${message.timeSent}`</p>
    </div>
  );
}

export default Message;
