import type { ConversationPreviewObject } from "../../../../types/conversationPreviewObject";
import { useNavigate } from "react-router";

type conversationPreviewProps = {
  conversationMessage: ConversationPreviewObject;
};

function ConversationPreview({
  conversationMessage,
}: conversationPreviewProps) {
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("loggedUserId");
  const username = sessionStorage.getItem("loggedUsername");

  const viewConversation = () => {
    navigate(`user/${userId}/conversation/${conversationMessage.id}`);
  };

  const latestMessage = conversationMessage.messages[0];
  return (
    <div className="conversationPreview">
      <h3>
        {latestMessage.sender.username === username
          ? latestMessage.receiver.username
          : latestMessage.sender.username}
      </h3>
      <p>
        {latestMessage.sender.username === username
          ? "You"
          : latestMessage.sender.username}
        : {latestMessage.message}
      </p>
      <button onClick={viewConversation}>View Conversation</button>
    </div>
  );
}

export default ConversationPreview;
