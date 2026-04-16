import React, { useState, type Dispatch, type SyntheticEvent } from "react";
import { useNavigate } from "react-router";

type newMessageProps = {
  groupName: string;
  groupConversationId: number;
  setNewMessageStatus: Dispatch<React.SetStateAction<boolean>>;
};

function NewGroupMessage({
  groupName,
  groupConversationId,
  setNewMessageStatus,
}: newMessageProps) {
  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageImage, setNewMessageImage] = useState<File | null>(null);
  const navigate = useNavigate();


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

      const uploadedUrl = await uploadImage(newMessageImage);
      
      const rsp = await fetch("http://localhost:3000/send-message-group", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          message: newMessageText,
          imageUrl: uploadedUrl,
          groupId: groupConversationId
        }),
      });

      if (rsp.status === 201) {
        setNewMessageStatus((prev) => !prev)
        navigate("/");
      }
    } catch (error) {
      console.error("Upload message error:", error);
    }
  }

  return (
    <div className="newMessage">
      <form onSubmit={newGroupMessageAPI}>
        <h3>New Message to {groupName}: </h3>
        <input
          type="text"
          required
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
      
    </div>
  );
}

export default NewGroupMessage;
