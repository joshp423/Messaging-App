import { useEffect, useState } from "react";
import type { ConversationObject } from "../../../../types/conversationObject";
import Message from "./Message/message";
import NewGroupMessage from "./NewMessage/newGroupMessage";
import { useParams } from "react-router";
import { Link } from "react-router";

function GroupConversation() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationObject | null>(null);

  const { groupConversationId } = useParams();

  const userId = sessionStorage.getItem("loggedUserId");

  const [newMessageStatus, setNewMessageStatus] = useState(false);

  const [groupName, setGroupName] = useState("")
  

  useEffect(() => {
    async function getConversation() {
      try {
        const rsp = await fetch(
          `http://localhost:3000/groupConversations/${groupConversationId}`,
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
          setSelectedConversation(data.groups[0]);
          setGroupName(data.groups[0].id)
          console.log(data.conversation);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getConversation();
  }, [groupConversationId, userId, newMessageStatus, groupName]);

  return (
    <div className="conversation">
      {selectedConversation?.messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    <NewGroupMessage />
      groupName={groupName}
      groupConversationId={groupConversationId}
      setNewMessageStatus={setNewMessageStatus}
      <Link to="/">Back</Link>
    </div>
  );
}

export default GroupConversation;
