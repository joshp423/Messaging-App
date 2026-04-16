import { type GroupPreviewObject } from "../../../../types/groupPreviewObject";
import { useNavigate } from "react-router";

type groupPreviewProps = {
  conversationMessage: GroupPreviewObject;
};

function GroupPreview({ conversationMessage }: groupPreviewProps) {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("loggedUsername");
  console.log(conversationMessage)

  const viewConversation = () => {
    navigate(`groupConversation/${conversationMessage.id}`);
  };

  const latestMessage = conversationMessage.messages[0];
  return (
    <div className="conversationPreview">
      <h3>{conversationMessage.name}</h3>
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

export default GroupPreview;
