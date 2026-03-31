import type { messageSolo } from "../../../../../types/messageSolo";

type messageProps = {
  message: messageSolo;
};

function Message({ message }: messageProps) {
      
  
    if (message.imageUrl) {
        return (
            <div className="message">
              <h3>`${message.sender.username}: ${message.message}`</h3>
              <img src={message.imageUrl} alt="message image" />
              <p>`${message.timeSent}`</p>
            </div>
        );
    }
  return (
    <div className="message">
      <h3>`${message.sender.username}: ${message.message}`</h3>
      <p>`${message.timeSent}`</p>
    </div>
  );
}

export default Message;
