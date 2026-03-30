import { useEffect, useState } from "react";
import type { messageGroup } from "../../../types/messageGroup";
import type { conversation } from "../../../types/conversation";
import Conversation from "./Conversation/conversation";

function Messages() {
  const [soloMessages, setSoloMessages] = useState<conversation[]>([]);
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
            email: sessionStorage.getItem("loggedUser"),
          }),
        });
        if (rsp.status === 200) {
          const data = await rsp.json();
          setSoloMessages(data.messagesSolo);
          setGroupMessages(data.messagesGroup);
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
        {soloMessages?.map((conversation) => (
          <Conversation key={conversation.id} conversation={conversation} />
        ))}
      </div>
      <div className="groupMessages">
        
      </div>
    </div>
  );
}

export default Messages;
