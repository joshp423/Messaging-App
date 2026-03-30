import { useEffect, useState } from "react";
import type { messageGroup } from "../../../types/messageGroup";
import ConversationPreview from "./Conversation/conversationPreview";
import type { conversationPreview } from "../../../types/conversationPreview";

function Messages() {
  const [soloMessages, setSoloMessages] = useState<conversationPreview[]>([]);
  const [groupMessages, setGroupMessages] = useState<messageGroup[]>([]);

  useEffect(() => {
    async function getMessages() {
      try {
        const rsp = await fetch("http://localhost:3000/receive-messages", {
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
          console.log(data.messagesSolo, data.messagesGroup);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getMessages();
  }, []);
  // think about if we need userids in groups and conversations might be able to pull usernames anyway with prisma
  
  return (
    <div className="messageLobby">
      <div className="soloMessages">
        {soloMessages.map((conversation) => (
          <ConversationPreview key={conversation.id} conversationMessage={conversation} />
        ))}
      </div>
      <div className="groupMessages">
        
      </div>
    </div>
  );
}

export default Messages;
