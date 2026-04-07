import { useState, type SyntheticEvent } from "react";

function NewConversation () {

  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageImage, setNewMessageImage] = useState<File | null>(null);
  const [newMessageRecipient, setNewMessageRecipient] = useState("")

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

  // will need a new api with username
  async function newMessageAPI(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const uploadedUrl = await uploadImage();
      const receiverId = await getUserId();
      const userId = sessionStorage.getItem("loggedUserId")
      const rsp = await fetch("http://localhost:3000/send-message-solo", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          senderId: userId,
          receiverId,
          message: newMessageText,
          imageUrl: uploadedUrl,
          conversationId: null
        }),
      });

      if (rsp.status === 201) {
        return
      }
    } catch (error) {
      console.error("Upload message error:", error);
    }
  }

  async function getUserId() {
    if (!newMessageRecipient) return console.error("No message recipient")

      try {
        const rsp = await fetch("http://localhost:3000/getUserId", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          selectedUsername: newMessageRecipient
        }),
      });
      if (rsp.status === 201) {
        const data = await rsp.json();
        return data. selectedUserId
      }

      } catch (error) {
        console.error("User not found:", error);
      }
  }

    return (
        <div className="NewConversation">
            <form onSubmit={newMessageAPI}>
              <label htmlFor="newMessageRecipientUsername">Message Recipient: </label>
              <input 
                  type="text" 
                  name="newMessageRecipientUsername"
                  onChange={(e) => {
                  setNewMessageRecipient(e.target.value);
                }}
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
    )
}

export default NewConversation