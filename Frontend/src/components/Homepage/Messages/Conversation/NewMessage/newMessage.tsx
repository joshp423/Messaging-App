import React, { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./newMessages.css";

type newMessageProps = {
  conversationPartner: string;
  conversationPartnerId: number | undefined;
  conversationId: number;
  setNewMessageStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

function NewMessage({
  conversationPartner,
  conversationPartnerId,
  conversationId,
  setNewMessageStatus,
}: newMessageProps) {
  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageImage, setNewMessageImage] = useState<File | null>(null);

  const navigate = useNavigate();

  async function uploadImage() {
    if (!newMessageImage) return "";

    const formData = new FormData();

    formData.append("uploaded_file", newMessageImage);
    const rsp = await fetch("https://messaging-app-be5n.onrender.com/uploadMessageImage", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "POST",
      body: formData,
    });

    const data = await rsp.json();

    if (rsp.status === 201) {
      return data.imageUrl;
    }

    navigate("/error", {
      state: {
        error: "Picture upload failed, please try again later",
      },
    });
    return;
  }

  async function newMessageAPI(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const uploadedUrl = await uploadImage();
    const rsp = await fetch("https://messaging-app-be5n.onrender.com/send-message-solo", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "POST",
      body: JSON.stringify({
        receiverId: conversationPartnerId,
        message: newMessageText,
        imageUrl: uploadedUrl,
        conversationId,
      }),
    });

    if (rsp.status === 201) {
      setNewMessageStatus((prev) => !prev); //return not the previous or flip
      return;
    }

    navigate("/error", {
      state: {
        error: "Message Upload Failed",
      },
    });
  }

  return (
    <div className="newMessage">
      <form onSubmit={newMessageAPI}>
        <h3>New Message to {conversationPartner}: </h3>
        <label htmlFor="messageText">Message Text: </label>
        <input
          type="text"
          id="messageText"
          required
          onChange={(e) => {
            setNewMessageText(e.target.value);
          }}
        />
        <label htmlFor="messageImage">Add Image: </label>
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

export default NewMessage;
