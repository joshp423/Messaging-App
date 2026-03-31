import { type conversationPreview } from "../../../../types/conversationPreview"
import { useNavigate } from "react-router";

type conversationPreviewProps = {
  conversationMessage: conversationPreview;
};

function ConversationPreview( {conversationMessage}: conversationPreviewProps) {

    const navigate = useNavigate();

    const viewConversation = () => {
        navigate(`/conversation/${conversationMessage.id}`)
    }

    const latestMessage = conversationMessage.messages[0]
    return (
        <div className="conversationPreview">
            <h3>{latestMessage.sender.username === sessionStorage.getItem("loggedUsername") ? latestMessage.receiver.username : latestMessage.sender.username}</h3>
            <p>{latestMessage.sender.username === sessionStorage.getItem("loggedUsername") ? "You" : latestMessage.sender.username}: {latestMessage.message}</p>
            <button onClick={viewConversation}>View Conversation</button>
        </div>
    )
}

export default ConversationPreview