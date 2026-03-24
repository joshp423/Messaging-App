import { useNavigate } from "react-router-dom";
import { useState, type SyntheticEvent } from "react";

function SignUp() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pfp, setPfp] = useState<File | null>(null);
    const [pfpUrl, setPfpUrl] = useState("");
    const [blurb, setProfileBlurb] = useState("");
    // const [loading, setLoading] = useState(false);

    async function signupAPI(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        // try to create new prisma user, checking fields
        // setLoading(true);
        try {

            const rsp = await fetch(
                "http://localhost:3000/sign-up",
                {
                    headers: {
                    "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({ username, email, password }),
                },
            );

            const data = await rsp.json();

            if (data.status === 201) {

                try {

                    const rsp = await fetch(
                        "http://localhost:3000/edit-profile",
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                            method: "PUT",
                            body: JSON.stringify({ username, email, password }),
                        },
                    );

                    const data = await rsp.json();

                    if (data.status === 201) {
                        uploadAdditionalProfileInfo();
                        try {

                            await fetch(
                                "http://localhost:3000/initialProfileUpdate",
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    method: "PUT",
                                    body: JSON.stringify({ email, pfpUrl, blurb }),
                                },
                            );

                        } catch (error) {
                            console.error(error)
                        };
                    }

                } catch (error) {
                    console.error(error)
                };

                navigate(0);

            }

        } catch (error) {
            console.error(error)
        };
        // if (rsp.status != 201) {
        // // setLoading(false);
        
        // }
        // // setLoading(false);
        // navigate(0);
    }

    async function uploadAdditionalProfileInfo() {
        if (!pfp) return;

        const formData = new FormData();

        formData.append("uploaded_pfp", pfp);

        const rsp = await fetch(
            "http://localhost:3000/edit-profile",
            {
                method: "POST",
                body: formData
            });

        const data = await rsp.json();

        if (data.status === 201) {
            setPfpUrl(String(data.pfpUrl));
        }
        
        
    }
    

    return(

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
                <input type="file" className="form-control-file" name="uploaded_file" id="fileInput" onChange={(e) => {setPfp(e.target.files?.[0] || null)}}/> 
                <label htmlFor="profileBlurb">Profile Summary: </label>
                <input type="text" name="profileBlurb" onChange={(e) => {setProfileBlurb(e.target.value)}}/>
                <button type="submit"></button>
            </form>
        </div>

    )
}

export default SignUp