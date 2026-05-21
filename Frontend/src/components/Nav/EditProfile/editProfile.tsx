import { useEffect, useState, type SyntheticEvent } from "react";
import type { User } from "../../../types/user";
import { useNavigate } from "react-router";
import "./editProfile.css";

function EditProfile() {
  const userId = Number(localStorage.getItem("loggedUserId"));
  const [editedProfile, setEditedProfile] = useState<User | null>(null);
  const [pfp, setPfp] = useState<File | null>(null);
  const [blurb, setProfileBlurb] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserProfile() {
      try {
        const rsp = await fetch(`https://messaging-app-be5n.onrender.com/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "GET",
        });
        if (rsp.status === 200) {
          const data = await rsp.json();
          setEditedProfile(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserProfile();
  }, [userId]);

  async function uploadPFP() {
    if (!pfp) return "";

    const formData = new FormData();

    formData.append("uploaded_file", pfp);

    try {
      const rsp = await fetch("https://messaging-app-be5n.onrender.com/uploadPFP", {
        method: "POST",
        body: formData,
      });

      const data = await rsp.json();

      if (rsp.status === 201) {
        return data.pfpUrl;
      } else {
        return "";
      }
    } catch (error) {
      navigate("/error", {
        state: { error: "Profile picture upload failed" },
      });
      console.error("Upload error:", error);
      return "";
    }
  }

  async function updateProfile(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const uploadedUrl = await uploadPFP();

    try {
      await fetch("https://messaging-app-be5n.onrender.com/edit-profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        method: "PUT",
        body: JSON.stringify({
          username: editedProfile?.username,
          pfpUrl: uploadedUrl,
          blurb,
        }),
      });
      navigate(`/user/${localStorage.getItem("loggedUserId")}`);
    } catch (error) {
      navigate("/error", {
        state: { error: "Edit Profile Failed" },
      });
      console.error(error);
    }
  }

  return (
    <div className="editProfile">
      <h1>Edit Profile - {editedProfile?.username}</h1>
      <form onSubmit={updateProfile}>
        {editedProfile?.pfpUrl !== "" ? (
          <img src={editedProfile?.pfpUrl} alt="User Profile Picture" />
        ) : (
          <h3>No Profile Picture</h3>
        )}

        <label htmlFor="uploaded_file">Change profile picture: </label>
        <input
          type="file"
          className="form-control-file"
          name="uploaded_file"
          id="fileInput"
          onChange={(e) => {
            setPfp(e.target.files?.[0] || null);
          }}
        />
        <label htmlFor="profileBlurb">Edit Profile Description: </label>
        <input
          type="text"
          name="profileBlurb"
          defaultValue={editedProfile?.blurb}
          onChange={(e) => {
            setProfileBlurb(e.target.value);
          }}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditProfile;
