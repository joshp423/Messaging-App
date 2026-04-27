import { useEffect, useState } from "react";
import type { User } from "../../../../../types/user";
import { useParams } from "react-router";
import "./userProfile.css";

function UserProfile() {
  const { userId } = useParams();

  const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(
    null,
  );

  useEffect(() => {
    async function getUserProfile() {
      try {
        const rsp = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          method: "GET",
        });
        if (rsp.status === 200) {
          const data = await rsp.json();
          setSelectedUserProfile(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserProfile();
  }, [userId]);

  if (userId === localStorage.getItem("loggedUserId")) {
    return (
      <>
        <div className="userProfile">
          <div>
            {selectedUserProfile?.pfpUrl === "" ? (
              <i className="fa-solid fa-user"></i>
            ) : (
              <img src={selectedUserProfile?.pfpUrl} alt="" />
            )}
            <h1>{selectedUserProfile?.username}</h1>
          </div>
          <p>
            {selectedUserProfile?.blurb === ""
              ? "No user information."
              : selectedUserProfile?.blurb}
          </p>
          <a id="editProfileLink" href="/edit-profile">
            Edit Profile
          </a>
        </div>
      </>
    );
  }
  return (
    <div className="userProfile">
      <div>
        {selectedUserProfile?.pfpUrl === "" ? (
          <i className="fa-solid fa-user"></i>
        ) : (
          <img src={selectedUserProfile?.pfpUrl} alt="" />
        )}
        <h1>{selectedUserProfile?.username}</h1>
      </div>
      <p>
        {selectedUserProfile?.blurb === ""
          ? "No user information."
          : selectedUserProfile?.blurb}
      </p>
    </div>
  );
}

export default UserProfile;
