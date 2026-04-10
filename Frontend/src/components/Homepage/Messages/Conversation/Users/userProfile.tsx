import { useEffect, useState } from "react";
import type { User } from "../../../../../types/user";
import { useParams } from "react-router";
import { Link } from "react-router";

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
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          method: "GET",
        });
        if (rsp.status === 200) {
          const data = await rsp.json();
          setSelectedUserProfile(data.user);
          console.log(data.conversation);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getUserProfile();
  }, [userId]);

  if (
    selectedUserProfile?.username === sessionStorage.getItem("loggedUsername")
  ) {
    return (
      <div className="userProfile">
        <img src={selectedUserProfile?.pfpUrl} alt="" />
        <h1>{selectedUserProfile?.username}</h1>
        <p>{selectedUserProfile?.blurb}</p>
        <Link to="/editProfile"></Link>
      </div>
    );
  }
  return (
    <div className="userProfile">
      <img src={selectedUserProfile?.pfpUrl} alt="" />
      <h1>{selectedUserProfile?.username}</h1>
      <p>{selectedUserProfile?.blurb}</p>
    </div>
  );
}

export default UserProfile;
