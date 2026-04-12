import React, { useState, type SyntheticEvent } from "react";

type newMessageProps = {
  groupName: string;
  groupConversationId: number | undefined;
  setNewMessageStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

function NewGroupMessage({
  groupName,
  groupConversationId,
  setNewMessageStatus,
}: newMessageProps) {
  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageImage, setNewMessageImage] = useState<File | null>(null);

  async function uploadImage(newMessageImage:File | null) {
    if (!newMessageImage) return "";

    const formData = new FormData();

    formData.append("uploaded_file", newMessageImage);

    try {
      const rsp = await fetch("http://localhost:3000/uploadMessageImage", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: formData,
      });

      const data = await rsp.json();

      if (rsp.status === 201) {
        return data.imageUrl;
      } else {
        return "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      return "";
    }
  }

  async function newGroupMessageAPI(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {

      const uploadedUrl = await uploadImage(newGroupMessageImage);
      const receiverIds = await getUserIds();
      const newGroupId = await createNewGroup(receiverIds)
      
      const rsp = await fetch("http://localhost:3000/send-message-group", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          message: newGroupMessageText,
          imageUrl: uploadedUrl,
          groupId: newGroupId
        }),
      });

      if (rsp.status === 201) {
        navigate("/");
      }
    } catch (error) {
      console.error("Upload message error:", error);
    }
  }

  return (
    <div className="newMessage">
      <form onSubmit={newMessageAPI}>
        <h3>New Message to {conversationPartner}: </h3>
        <input
          type="text"
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
        <button>Send</button>
      </form>
    </div>
  );
}

export default NewGroupMessage;
