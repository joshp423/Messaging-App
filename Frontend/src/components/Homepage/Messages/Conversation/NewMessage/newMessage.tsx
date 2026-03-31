import { useState } from "react";

type newMessageProps = {
  conversationPartner: string;
};

function NewMessage({ conversationPartner }: newMessageProps) {
  const [newMessageImage, setNewMessageImage] = useState<File | null>(null);

  //function here

  return (
    <div className="newMessage">
      <form>
        <h3>New Message to {conversationPartner}: </h3>
        <input type="text" />
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
        <button>Send</button>
      </form>
    </div>
  );
}

export default NewMessage;
