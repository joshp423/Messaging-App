import { type conversationPreview } from "../../../../types/conversationPreview"

type conversationPreviewProps = {
  conversationMessage: conversationPreview;
};

function ConversationPreview( {conversationMessage}: conversationPreviewProps) {

    const latestMessage = conversationMessage.messages[0]
    return (
        <div className="conversationPreview">
            <h3>{latestMessage.sender.username === sessionStorage.getItem("loggedUsername") ? latestMessage.receiver.username : latestMessage.sender.username}</h3>
            <p>{latestMessage.sender.username === sessionStorage.getItem("loggedUsername") ? "You" : latestMessage.sender.username}: {latestMessage.message}</p>
            <button>View Conversation</button>
        </div>
    )
}

export default ConversationPreview