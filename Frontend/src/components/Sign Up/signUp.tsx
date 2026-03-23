import { useNavigate } from "react-router-dom";
import { useState, type SyntheticEvent } from "react";

function SignUp() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [loading, setLoading] = useState(false);


    async function signupAPI(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        // setLoading(true);
        const rsp = await fetch(
        `https://blog-api-backend-jfv8.onrender.com/sign-up`,
        {
            headers: {
            "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ username, email, password }),
        },
        );
        if (rsp.status != 201) {
        // setLoading(false);
        return console.log("invalid sign-up");
        }
        // setLoading(false);
        navigate(0);
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
            </form>
        </div>
    )
}

export default SignUp