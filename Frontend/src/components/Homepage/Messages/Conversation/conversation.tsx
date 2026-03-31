import { useEffect, useState } from "react";
import type { conversation } from "../../../../types/conversation";
import Message from "./Message/message";
import NewMessage from "./NewMessage/newMessage";



function Conversation() {

  const [conversation, setConversation] = useState<conversation | null>(null)

  useEffect (() => {
    async function getConversation() {
     try {
        const rsp = await fetch(`http://localhost:3000/conversation/${sessionStorage.}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          method: "POST",
          body: JSON.stringify({
            id: Number(sessionStorage.getItem("loggedUserID")),
          }),
        });
        if (rsp.status === 200) {
          const data = await rsp.json();
          setSoloMessages(data.conversationsSolo);
          setGroupMessages(data.groups);
          console.log(data.conversationsSolo, data.groups);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getConversation();
  },[])

  return (
    <div className="conversation">
      {conversation?.messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <NewMessage />
    </div>
  );
}

export default Conversation;
