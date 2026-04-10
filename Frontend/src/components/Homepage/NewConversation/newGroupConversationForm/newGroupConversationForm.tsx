import type { Dispatch, SetStateAction, SubmitEventHandler } from "react";
import GroupConversationRecipientInput from "./GroupConversationRecipientInput/GroupConversationRecipientInput";

type NewGroupConversationFormProps = {
  setNewGroupMessageText: Dispatch<SetStateAction<string>>;
  setNewGroupMessageImage: Dispatch<SetStateAction<File | null>>;
  setNewGroupMessageRecipients: Dispatch<SetStateAction<string[]>>;
  setNewGroupRecipientsAmount: Dispatch<SetStateAction<number>>;
  newGroupMessageAPI: SubmitEventHandler<HTMLFormElement>;
  newGroupRecipientsAmount: number;
  recipientUpdater: (index: number, value: string) => void;
  setNewGroupName: Dispatch<SetStateAction<string>>;
};

function NewGroupConversationForm({
  setNewGroupMessageText,
  setNewGroupMessageImage,
  setNewGroupRecipientsAmount,
  newGroupRecipientsAmount,
  setNewGroupMessageRecipients,
  newGroupMessageAPI,
  setNewGroupName
}: NewGroupConversationFormProps) {
  return (
    <form onSubmit={newGroupMessageAPI}>
      <label htmlFor="newMessageRecipientUsername">Recipient Username: </label>
      <input
        type="number"
        name="newGroupRecipientsAmount"
        min={3}
        defaultValue={3}
        required
        onChange={(e) => {
          const newValue = e.target.valueAsNumber;
          setNewGroupRecipientsAmount(newValue);
          setNewGroupMessageRecipients((prev) => {
            return newValue > prev.length
              ? [...prev, ...Array(newValue - prev.length).fill("")]
              : prev.slice(0, newValue);
          });
        }}
      />
      <label>Group Member Usernames</label>
      <div className="groupMemberInputs">
        {Array.from({ length: newGroupRecipientsAmount }).map(
          (
            _,
            index, //value, index
          ) => (
            <GroupConversationRecipientInput key={index} />
          ),
        )}
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
      <label htmlFor="newGroupName">New Group Name: </label>
      <input 
        type="text"
        name="newGroupName"
        onChange={(e) => {
          setNewGroupName(e.target.value);
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default NewGroupConversationForm;
