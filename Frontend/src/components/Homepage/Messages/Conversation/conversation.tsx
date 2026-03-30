import type { conversation } from "../../../../types/conversation";
import { useEffect, useState } from "react";
import Message from "./Message/message";
import NewMessage from "./NewMessage/newMessage";

type conversationProps = {
  conversation: conversation;
};

function Conversation({ conversation }: conversationProps) {

  const [usernames, setUsernames] = useState([]);
  let oppositeUser = ""
  for (const user in usernames) {
    if (user === sessionStorage.getItem("loggedUser")) {
      oppositeUser = user
    }
  }

  useEffect(() => {
    async function getUsernames() {
      try {
        const rsp = await fetch("http//localhost:3000/get-usernames", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          method: "GET",
          body: JSON.stringify({
            senderId: conversation.messages[0].senderId,
            reveiverId: conversation.messages[0].receiverId
          }),
        });
        if (rsp.status === 200) {
          const data = await rsp.json();
          setUsernames(data.users);
          console.log(data.users);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUsernames();
  }, []);

  return (
    <div className="conversation">
      {conversation?.messages.map((message) => (
        <Message key={message.id} message={message} sentUser={oppositeUser}/>
      ))}
      <NewMessage />
    </div>
  );
}

export default Conversation;
