import type { Dispatch, SetStateAction, SubmitEventHandler } from "react";

type NewGroupConversationFormProps = {
    setNewGroupMessageText: Dispatch<SetStateAction<string>>;
    setNewGroupMessageImage: Dispatch<SetStateAction<File | null>>;
    setNewGroupMessageRecipients: Dispatch<SetStateAction<[]>>;
    setNewGroupRecipientsAmount: Dispatch<SetStateAction<number>>;
    newGroupMessageAPI: SubmitEventHandler<HTMLFormElement>;
}

function NewGroupConversationForm ({ setNewGroupMessageText, setNewGroupMessageImage, setNewGroupRecipientsAmount, setNewGroupMessageRecipients, newGroupMessageAPI}: NewGroupConversationFormProps,  ) {
    return (
        <form onSubmit={newGroupMessageAPI}>
            <label htmlFor="newMessageRecipientUsername">Recipient Username: </label>
            <input
                type="number"
                name="newGroupRecipientsAmount"
                onChange={(e) => {
                    setNewGroupRecipientsAmount(e.target.valueAsNumber);
                }}
            />

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
                    setNewGroupMessageText(e.target.value);
                }}
              />
              <label htmlFor="messageImage">Add Image</label>
              <input
                type="file"
                className="form-control-file"
                name="uploaded_file"
                id="fileInput"
                onChange={(e) => {
                  setNewGroupMessageImage(e.target.files?.[0] || null);
                }}
              />
            <button type="submit">Send</button>
        </form>
    )

}

export default NewGroupConversationForm