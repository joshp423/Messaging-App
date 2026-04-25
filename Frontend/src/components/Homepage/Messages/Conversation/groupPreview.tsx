import { type GroupPreviewObject } from "../../../../types/groupPreviewObject";
import { useNavigate } from "react-router";

type groupPreviewProps = {
  conversationMessage: GroupPreviewObject;
};

function GroupPreview({ conversationMessage }: groupPreviewProps) {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("loggedUsername");

  const viewConversation = () => {
    navigate(`groupConversation/${conversationMessage.id}`);
  };

  const latestMessage = conversationMessage.messages[0];
  return (
    <div className="conversationPreview">
      <h3>{conversationMessage.name}</h3>
      <button onClick={viewConversation}>
        <i className="fa-solid fa-arrow-right"></i>
      </button>
      <p>
        {latestMessage.sender.username === username
          ? "You"
          : latestMessage.sender.username}
        : {latestMessage.message}
      </p>
    </div>
  );
}

export default GroupPreview;
