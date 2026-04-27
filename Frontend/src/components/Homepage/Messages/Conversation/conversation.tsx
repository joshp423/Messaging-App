import { useEffect, useState } from "react";
import type { ConversationObject } from "../../../../types/conversationObject";
import Message from "./Message/message";
import NewMessage from "./NewMessage/newMessage";
import { useParams } from "react-router";
import "./conversation.css";

function Conversation() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationObject | null>(null);

  const { conversationId } = useParams();

  const userId = localStorage.getItem("loggedUserId");

  const username = localStorage.getItem("loggedUsername");

  const [newMessageStatus, setNewMessageStatus] = useState(false);

  useEffect(() => {
    async function getConversation() {
      try {
        const rsp = await fetch(
          `http://localhost:3000/conversations/${conversationId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            method: "GET",
          },
        );
        if (rsp.status === 200) {
          const data = await rsp.json();
          setSelectedConversation(data.conversation);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getConversation();
  }, [conversationId, newMessageStatus]);

  return (
    <div className="conversation">
      {selectedConversation?.messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <NewMessage
        conversationPartner={
          selectedConversation?.messages[0].receiver.username === username
            ? username
            : selectedConversation?.messages[0].receiver.username || ""
        }
        conversationPartnerId={
          selectedConversation?.userA === Number(userId)
            ? selectedConversation?.userB
            : selectedConversation?.userA
        }
        conversationId={Number(conversationId)}
        setNewMessageStatus={setNewMessageStatus}
      />
      <button onClick={() => setNewMessageStatus((prev) => !prev)}>
        Refresh Messages
      </button>
    </div>
  );
}

export default Conversation;
