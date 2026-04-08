import { useEffect, useState } from "react";
import type { ConversationObject } from "../../../../types/conversationObject";
import Message from "./Message/message";
import NewMessage from "./NewMessage/newMessage";
import { useParams } from "react-router";
import { Link } from "react-router";

function GroupConversation() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationObject | null>(null);

  const { groupConversationId } = useParams();

  const userId = sessionStorage.getItem("loggedUserId");

  const username = sessionStorage.getItem("loggedUsername");

  const [newMessageStatus, setNewMessageStatus] = useState(false);

  useEffect(() => {
    async function getConversation() {
      try {
        const rsp = await fetch(
          `http://localhost:3000/users/${userId}/groupConversations/${groupConversationId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            method: "GET",
          },
        );
        if (rsp.status === 200) {
          const data = await rsp.json();
          setSelectedConversation(data.conversation[0]);
          console.log(data.conversation);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getConversation();
  }, [conversationId, userId, newMessageStatus]);

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
        userId={Number(userId)}
        setNewMessageStatus={setNewMessageStatus}
      />
      <Link to="/">Back</Link>
    </div>
  );
}

export default GroupConversation;
