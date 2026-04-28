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
  setNewGroupName,
}: NewGroupConversationFormProps) {
  return (
    <form onSubmit={newGroupMessageAPI}>
      <label htmlFor="newMessageRecipientUsername">
        Amount of New Group Members (min 3):{" "}
      </label>
      <input
        type="number"
        name="newGroupRecipientsAmount"
        min={3}
        value={newGroupRecipientsAmount}
        required
        onChange={(e) => {
          let newValue = e.target.valueAsNumber;

          if (newValue < 3) {
            //protect from NAn
            newValue = 3;
          }
          setNewGroupRecipientsAmount(newValue);
          setNewGroupMessageRecipients((prev) => {
            return newValue > prev.length
              ? [...prev, ...Array(newValue - prev.length).fill("")]
              : prev.slice(0, newValue);
          });
        }}
      />
      <label>Other Group Member Usernames: </label>
      <div className="groupMemberInputs">
        {Array.from({ length: newGroupRecipientsAmount }).map(
          (
            _,
            index, //value, index
          ) => (
            <GroupConversationRecipientInput
              key={index}
              index={index}
              setNewGroupMessageRecipients={setNewGroupMessageRecipients}
            />
          ),
        )}
      </div>
      <label htmlFor="newGroupMessageText">Message: </label>
      <input
        type="text"
        name="newGroupMessageText"
        required
        onChange={(e) => {
          setNewGroupMessageText(e.target.value);
        }}
      />

      <label htmlFor="messageImage">Add Image to Message: </label>
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
        required
        onChange={(e) => {
          setNewGroupName(e.target.value);
        }}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default NewGroupConversationForm;
