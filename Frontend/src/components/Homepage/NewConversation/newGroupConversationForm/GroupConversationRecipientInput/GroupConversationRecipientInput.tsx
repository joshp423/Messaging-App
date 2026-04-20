import { type Dispatch, type SetStateAction } from "react";

type GroupConversationRecipientInputProps = {
  setNewGroupMessageRecipients: Dispatch<SetStateAction<string[]>>;
  index: number;
};

function GroupConversationRecipientInput({
  setNewGroupMessageRecipients,
  index,
}: GroupConversationRecipientInputProps) {
  return (
    <input
      type="text"
      required
      onChange={(e) => {
        setNewGroupMessageRecipients((prev) => {
          const updated = [...prev];
          updated[index] = e.target.value;
          return updated;
        });
      }}
    />
  );
}

export default GroupConversationRecipientInput;
