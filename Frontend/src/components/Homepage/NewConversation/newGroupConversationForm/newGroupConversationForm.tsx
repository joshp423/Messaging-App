import type { Dispatch, SetStateAction, SubmitEventHandler } from "react";

type NewGroupConversationFormProps = {
    setNewGroupMessageText: Dispatch<SetStateAction<string>>;
    setGroupNewMessageImage: Dispatch<SetStateAction<File | null>>;
    setNewMessageRecipient: Dispatch<SetStateAction<string>>;
    newMessageAPI: SubmitEventHandler<HTMLFormElement>;
}

function NewGroupConversationForm ({ setNewGroupMessageText, setGroupNewMessageImage, setNewMessageRecipient, newMessageAPI}: NewGroupConversationFormProps,  ) {
    return (
        <form onSubmit={newMessageAPI}>
            <label htmlFor="newMessageRecipientUsername">Recipient Username: </label>
            <input 
                type="text" 
                name="newMessageRecipientUsername"
                onChange={(e) => {
                    setNewGroupMessageText(e.target.value);
                }}
              />
              <input
                type="text"
                name="newMessageText"
                onChange={(e) => {
                    setNewMessageText(e.target.value);
                }}
              />
              <label htmlFor="messageImage">Add Image</label>
              <input
                type="file"
                className="form-control-file"
                name="uploaded_file"
                id="fileInput"
                onChange={(e) => {
                  setNewMessageImage(e.target.files?.[0] || null);
                }}
              />
            <button type="submit">Send</button>
        </form>
    )

}

export default NewGroupConversationForm