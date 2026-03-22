import { useState } from "react";
import { type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const rsp = await fetch(
            "https://localhost:3000/log-in",
            {
                headers: {
                "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                }),
            },
        );
        if (rsp.status != 201) {
        return console.log(rsp.body);
        }
        navigate("/Leaderboard");
    };

    const backHome = () => {
        navigate("/");
    };
    

    return(
        <div>
            <form action="" onSubmit={login}>
                <label htmlFor="email">Email: </label>
                <input type="text" onChange={(e) => {setEmail(e.target.value)}}/>
                <label htmlFor="password">Password: </label>
                <input type="password" onChange={(e) => {setPassword(e.target.value)}}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Login