import type { ConversationPreviewObject } from "../../../../types/conversationPreviewObject";
import { useNavigate } from "react-router";

type conversationPreviewProps = {
  conversationMessage: ConversationPreviewObject;
};

function ConversationPreview({
  conversationMessage,
}: conversationPreviewProps) {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("loggedUsername");

  const viewConversation = () => {
    navigate(`conversation/${conversationMessage.id}`);
  };

  const latestMessage = conversationMessage.messages[0];

  const conversationPartnerProfile = latestMessage.sender.username === username
    ? latestMessage.receiver
    : latestMessage.sender

  return (
    <div className="conversationPreview">
      <div className="conversationPartnerProfile">
        { conversationPartnerProfile.pfpUrl !== "" ? (
            <img src={`${conversationPartnerProfile.pfpUrl}`} />
        ) : (
          <i className="fa-solid fa-user"></i>
        )}
        <h3>
          {latestMessage.sender.username === username
            ? latestMessage.receiver.username
            : latestMessage.sender.username}
        </h3>
      </div>
      <button onClick={viewConversation}><i className="fa-solid fa-arrow-right"></i></button>
      <p>
        {latestMessage.sender.username === username
          ? "You"
          : latestMessage.sender.username}
        : {latestMessage.message}
      </p>
      
    </div>
  );
}

export default ConversationPreview;
