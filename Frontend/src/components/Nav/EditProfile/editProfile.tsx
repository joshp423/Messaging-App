import { useEffect, useState, type SyntheticEvent } from "react";
import type { User } from "../../../types/user";

function EditProfile() {

    

    const userId  = sessionStorage.getItem("loggedUsername")
    const [editedProfile, setEditedProfile] = useState<User | null>(null)
    const [pfp, setPfp] = useState<File | null>(null);
    const [blurb, setProfileBlurb] = useState("");


    useEffect(() => {
        async function getUserProfile() {
          try {
            const rsp = await fetch(`http://localhost:3000/users/${userId}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
        const rsp = await fetch("http://localhost:3000/uploadPFP", {
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
        console.error("Upload error:", error);
        return "";
        }
    }

    async function updateProfile(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const uploadedUrl = await uploadPFP();

        

    }

    return (
        <div className="editProfile">
            <h1>Edit Profile</h1>
            <form onSubmit={updateProfile}>
                <img src={editedProfile?.pfpUrl} alt="user profile picture" />
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
                <label htmlFor="profileBlurb">Edit Profile: </label>
                <input
                    type="text"
                    name="profileBlurb"
                    value={editedProfile?.blurb}
                    onChange={(e) => {
                        setProfileBlurb(e.target.value);
                    }}
                />
            </form>
        </div>
    )
}

export default EditProfile