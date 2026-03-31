import { useEffect, useState } from "react";
import ConversationPreview from "./Conversation/conversationPreview";
import type { ConversationPreviewObject } from "../../../types/conversationPreviewObject";
import GroupPreview from "./Conversation/groupPreview";
import type { GroupPreviewObject } from "../../../types/groupPreviewObject";

function Messages() {
  const [soloMessages, setSoloMessages] = useState<ConversationPreviewObject[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupPreviewObject[]>([]);
  const userId = sessionStorage.getItem("loggedUserId")
  
  useEffect(() => {
    async function getMessages() {
      try {
        const rsp = await fetch(`http://localhost:3000/users/${userId}/conversations`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          method: "GET"
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
    getMessages();
  }, []);
  // think about if we need userids in groups and conversations might be able to pull usernames anyway with prisma
  // dont think we need to use map here with just one message
  return (
    <div className="messageLobby">
      <h1>Your Messages</h1>
      <div className="soloMessages">
        {soloMessages.map((conversation) => (
          <ConversationPreview key={conversation.id} conversationMessage={conversation} />
        ))}
      </div>
      <div className="groupMessages">
        {groupMessages.map((conversation) => (
          <GroupPreview key={conversation.id} conversationMessage={conversation} />
        ))}
      </div>
    </div>
  );
}

export default Messages;
