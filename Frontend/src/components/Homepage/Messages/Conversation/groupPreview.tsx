import { type groupPreview } from "../../../../types/groupPreview";

type groupPreviewProps = {
  conversationMessage: groupPreview;
};

function GroupPreview( {conversationMessage}: groupPreviewProps) {

    const latestMessage = conversationMessage.messages[0]
    return (
        <div className="conversationPreview">
            <h3>{}</h3>
            <p>{latestMessage.sender.username === sessionStorage.getItem("loggedUsername") ? "You" : latestMessage.sender.username}: {latestMessage.message}</p>
            <button>View Conversation</button>
        </div>
    )
}

export default GroupPreview