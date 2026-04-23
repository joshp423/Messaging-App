import type { Dispatch, SetStateAction, SubmitEventHandler } from "react";

type NewSingleConversationFormProps = {
  setNewMessageText: Dispatch<SetStateAction<string>>;
  setNewMessageImage: Dispatch<SetStateAction<File | null>>;
  setNewMessageRecipient: Dispatch<SetStateAction<string>>;
  newMessageAPI: SubmitEventHandler<HTMLFormElement>;
};

function NewSingleConversationForm({
  setNewMessageText,
  setNewMessageImage,
  setNewMessageRecipient,
  newMessageAPI,
}: NewSingleConversationFormProps) {
  return (
    <form onSubmit={newMessageAPI}>
      <label htmlFor="newMessageRecipientUsername">Recipient Username: </label>
      <input
        type="text"
        name="newMessageRecipientUsername"
        required
        onChange={(e) => {
          setNewMessageRecipient(e.target.value);
        }}
      />
      <label htmlFor="newMessageText">Message: </label>
      <input
        type="text"
        name="newMessageText"
        required
        onChange={(e) => {
          setNewMessageText(e.target.value);
        }}
      />
      <label htmlFor="messageImage">Add Image:</label>
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
  );
}

export default NewSingleConversationForm;
