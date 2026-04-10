import type { Dispatch, SetStateAction, SubmitEventHandler } from "react";
import GroupConversationRecipientInput from "./GroupConversationRecipientInput/GroupConversationRecipientInput";

type NewGroupConversationFormProps = {
  setNewGroupMessageText: Dispatch<SetStateAction<string>>;
  setNewGroupMessageImage: Dispatch<SetStateAction<File | null>>;
  setNewGroupMessageRecipients: Dispatch<SetStateAction<[]>>;
  setNewGroupRecipientsAmount: Dispatch<SetStateAction<number>>;
  newGroupMessageAPI: SubmitEventHandler<HTMLFormElement>;
  newGroupRecipientsAmount: number;
  recipientUpdater: (index: number, value: string) => void;
};

function NewGroupConversationForm({
  setNewGroupMessageText,
  setNewGroupMessageImage,
  setNewGroupRecipientsAmount,
  newGroupRecipientsAmount,
  setNewGroupMessageRecipients,
  newGroupMessageAPI,
}: NewGroupConversationFormProps) {


  return (
    <form onSubmit={newGroupMessageAPI}>
      <label htmlFor="newMessageRecipientUsername">Recipient Username: </label>
      <input
        type="number"
        name="newGroupRecipientsAmount"
        min={1}
        defaultValue={1}
        required
        onChange={(e) => {
          setNewGroupRecipientsAmount(e.target.valueAsNumber);
        }}
      />
      <label>Group Member Username</label>
      <div className="groupMemberInputs">
        {Array.from({ length: newGroupRecipientsAmount}).map((_, index) => ( //value, index
            <GroupConversationRecipientInput key={index}/>
        ))}
      </div>
      <label htmlFor="newGroupMessageText">Message: </label>
      <input
        type="text"
        name="newGroupMessageText"
        onChange={(e) => {
          setNewGroupMessageText(e.target.value);
        }}
      />
      
      <label htmlFor="messageImage">Add Image: </label>
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
  );
}

export default NewGroupConversationForm;
