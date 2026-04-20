import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router";
import NewSingleConversationForm from "./newSingleConversationForm/newSingleConversationForm";
import NewGroupConversationForm from "./newGroupConversationForm/newGroupConversationForm";
import type { User } from "../../../types/user";
import { useNavigate } from "react-router";

function NewConversation() {
  const [newMessageText, setNewMessageText] = useState("");
  const [newMessageImage, setNewMessageImage] = useState<File | null>(null);
  const [newMessageRecipient, setNewMessageRecipient] = useState("");
  const [newGroupMessageText, setNewGroupMessageText] = useState("");
  const [newGroupMessageImage, setNewGroupMessageImage] = useState<File | null>(
    null,
  );
  const [newGroupRecipientsAmount, setNewGroupRecipientsAmount] = useState(3);
  const [newGroupMessageRecipients, setNewGroupMessageRecipients] = useState<
    string[]
  >([]);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const navigate = useNavigate();

  async function uploadImage(newMessageImage: File | null) {
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
      navigate("/error", {
        state: { error: "Profile picture upload failed" },
      });
      return "";
    }
  }

  async function newMessageAPI(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const uploadedUrl = await uploadImage(newMessageImage);
      const receiverId = await getUserId();
      const rsp = await fetch("http://localhost:3000/send-message-solo", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          receiverId,
          message: newMessageText,
          imageUrl: uploadedUrl,
          conversationId: 0,
        }),
      });

      if (rsp.status === 201) {
        navigate("/");
      }
    } catch (error) {
      navigate("/error", {
        state: { error: `${error}` },
      });
    }
  }

  async function newGroupMessageAPI(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const uploadedUrl = await uploadImage(newGroupMessageImage);
      const receiverIds = await getUserIds();
      const newGroupId = await createNewGroup(receiverIds);

      const rsp = await fetch("http://localhost:3000/send-message-group", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          message: newGroupMessageText,
          imageUrl: uploadedUrl,
          groupId: newGroupId,
        }),
      });

      if (rsp.status === 201) {
        navigate("/");
      }
    } catch (error) {
      console.error("Upload message error:", error);
    }
  }

  const recipientUpdater = (index: number, value: string) => {
    setNewGroupMessageRecipients((prev) => {
      const updated = [...prev]; //copy existing array
      updated[index] = value;
      return updated;
    });
  };

  async function getUserId() {
    if (!newMessageRecipient)
      return navigate("/error", {
        state: { error: "No message recipient" },
      });

    try {
      const rsp = await fetch("http://localhost:3000/getUserId", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          selectedUsername: newMessageRecipient,
        }),
      });
      if (rsp.status === 201) {
        const data = await rsp.json();
        return data.selectedUserId;
      }
    } catch (error) {
      navigate("/error", {
        state: { error: "User not found" },
      });
    }
  }

  async function getUserIds() {
    if (!newGroupMessageRecipients[0]) throw new Error("No message recipient");

    try {
      const rsp = await fetch("http://localhost:3000/getUserIds", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
        body: JSON.stringify({
          usernames: newGroupMessageRecipients,
        }),
      });
      if (rsp.status === 201) {
        const data = await rsp.json();
        const users: User[] = data.selectedUserId;
        const selectedIds = users.map((user) => user.id); //loop and pull id
        return selectedIds;
      }
      throw new Error("User/s not found");
    } catch (error) {
      navigate("/error", {
        state: { error: "User/s not found" },
      });
      throw error;
    }
  }

  async function createNewGroup(receiverIds: number[]) {
    if (!receiverIds[0])
      navigate("/error", {
        state: { error: "No group members" },
      });

    try {
      const rsp = await fetch("http://localhost:3000/create-group", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "PUT",
        body: JSON.stringify({
          userIds: receiverIds,
          name: newGroupName,
        }),
      });
      if (rsp.status === 201) {
        const data = await rsp.json();
        return data.newGroup.id;
      }
    } catch (error) {
      navigate("/error", {
        state: { error: "User/s not found" },
      });
    }
  }

  return (
    <div className="NewConversation">
      <h2>New Conversation</h2>
      <NewSingleConversationForm
        setNewMessageText={setNewMessageText}
        setNewMessageImage={setNewMessageImage}
        setNewMessageRecipient={setNewMessageRecipient}
        newMessageAPI={newMessageAPI}
      />
      <h2>New Group Conversation</h2>
      <NewGroupConversationForm
        setNewGroupMessageText={setNewGroupMessageText}
        setNewGroupMessageImage={setNewGroupMessageImage}
        setNewGroupMessageRecipients={setNewGroupMessageRecipients}
        setNewGroupRecipientsAmount={setNewGroupRecipientsAmount}
        newGroupMessageAPI={newGroupMessageAPI}
        newGroupRecipientsAmount={newGroupRecipientsAmount}
        recipientUpdater={recipientUpdater}
        setNewGroupName={setNewGroupName}
      />
      <Link to="/">Back</Link>
    </div>
  );
}

export default NewConversation;
