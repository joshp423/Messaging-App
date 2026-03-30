import { type conversationPreview } from "../../../../types/conversationPreview"

type conversationPreviewProps = {
  conversationMessage: conversationPreview;
};

function ConversationPreview( {conversationMessage}: conversationPreviewProps) {


    return (
        <div className="conversationPreview">
            <h3>{conversationMessage.messages.sender.username} : {conversationMessage.messages.message}</h3>
        </div>
    )
}

export default ConversationPreview