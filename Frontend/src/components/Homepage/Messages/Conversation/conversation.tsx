import { useEffect, useState } from "react";
import type { ConversationObject } from "../../../../types/conversationObject";
import Message from "./Message/message";
import NewMessage from "./NewMessage/newMessage";
import { useParams } from "react-router";


function Conversation() {

  const [selectedConversation, setSelectedConversation] = useState<ConversationObject | null>(null)

  const { conversationId } = useParams();

  const userId = sessionStorage.getItem("loggedUserId")

  useEffect (() => {
    async function getConversation() {
     try {
        const rsp = await fetch(`http://localhost:3000/users/${userId}/conversations/${conversationId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          method: "GET"
        });
        if (rsp.status === 200) {
          const data = await rsp.json();
          setSelectedConversation(data.conversation)
          console.log(data.conversation);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getConversation();
  },[conversationId, userId])

  return (
    <div className="conversation">
      {selectedConversation?.messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <NewMessage />
    </div>
  );
}

export default Conversation;
