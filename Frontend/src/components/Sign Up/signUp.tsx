import { useNavigate } from "react-router-dom";
import { useState, type SyntheticEvent } from "react";

function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pfp, setPfp] = useState<File | null>(null);
  const [blurb, setProfileBlurb] = useState("");
  // const [loading, setLoading] = useState(false);

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

  async function signupAPI(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    // try to create new prisma user, checking fields
    // setLoading(true);
    try {
      const rsp = await fetch("http://localhost:3000/sign-up", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      if (rsp.status === 201) { // if sign up successful
        const uploadedUrl = await uploadPFP(); //await other function
        try {
          await fetch("http://localhost:3000/initialProfileUpdate", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify({ email, pfpUrl: uploadedUrl, blurb }),
          });
          navigate("/");
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }

    // if (rsp.status != 201) {
    // // setLoading(false);

    // }
    // // setLoading(false);
    // navigate(0);
  }

  return (
    <div>
      <form onSubmit={signupAPI}>
        <label htmlFor="username">Username: </label>
        <input
          name="username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="username">Email: </label>
        <input
          name="email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="username"> Password: </label>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="uploaded_file">Upload profile picture: </label>
        <input
          type="file"
          className="form-control-file"
          name="uploaded_file"
          id="fileInput"
          onChange={(e) => {
            setPfp(e.target.files?.[0] || null);
          }}
        />
        <label htmlFor="profileBlurb">Profile Summary: </label>
        <input
          type="text"
          name="profileBlurb"
          onChange={(e) => {
            setProfileBlurb(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignUp;
