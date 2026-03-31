import { useEffect, useState } from "react";
import type { conversation } from "../../../../types/conversation";
import Message from "./Message/message";
import NewMessage from "./NewMessage/newMessage";
import { useParams } from "react-router";


function Conversation() {

  const [conversation, setConversation] = useState<conversation | null>(null)

  const { conversationId } = useParams();

  useEffect (() => {
    async function getConversation() {
     try {
        const rsp = await fetch(`http://localhost:3000/conversation/${conversationId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          method: "POST",
          body: JSON.stringify({
            id: Number(sessionStorage.getItem("loggedUserID")),
            conversationId
          }),
        });
        if (rsp.status === 200) {
          const data = await rsp.json();
          setConversation(data.conversation)
          console.log(data.conversation);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getConversation();
  },[conversationId])

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
