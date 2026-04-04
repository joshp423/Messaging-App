import React, { useState, type SyntheticEvent } from "react";

type newMessageProps = {
  conversationPartner: string;
  conversationPartnerId: number | undefined;
  conversationId: number | undefined;
  userId: number | null;
  setNewMessageStatus: React.Dispatch<React.SetStateAction<boolean>>;
};


  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageImage, setNewMessageImage] = useState<File | null>(null);

  async function uploadImage() {
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

  async function newMessageAPI(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      console.log(
        userId,
        conversationPartnerId,
        newMessageText,
        conversationId,
      );
      const uploadedUrl = await uploadImage();
      const rsp = await fetch("http://localhost:3000/send-message-solo", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          senderId: userId,
          receiverId: conversationPartnerId,
          message: newMessageText,
          imageUrl: uploadedUrl,
          conversationId,
        }),
      });

      if (rsp.status === 201) {
        setNewMessageStatus((prev) => !prev); //return not the previous or flip
      }
    } catch (error) {
      console.error("Upload message error:", error);
    }
  }

  return (
    <div className="newMessage">
      <form onSubmit={newMessageAPI}>
        <label htmlFor="newMessageRecipientUsername">Message Recipient: </label>
        <input 
            type="text" 
            name="newMessageRecipientUsername"
        />
        <input
          type="text"
          name="newMessageText"
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



function NewConversation () {
    return (
        <div className="NewConversation">
            
        </div>
    )
}

export default NewConversation