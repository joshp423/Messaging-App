import { useState } from "react";
import { type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useOutletContext } from "react-router-dom";
import "./login.css";

type JwtPayload = {
  id: number;
  email: string;
  username: string;
  iat: number;
  exp: number;
};

type LoginProps = {
  setLoginStatus: (status: boolean) => void; //function that takes a boolean and doesnt return anything
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const { setLoginStatus } = useOutletContext<LoginProps>();

  const navigate = useNavigate();

  const login = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const rsp = await fetch("http://localhost:3000/log-in", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await rsp.json();

    switch (rsp.status) {
      case 200: {
        const decoded = jwtDecode<JwtPayload>(data.token);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("loggedUsername", decoded.username);
        sessionStorage.setItem("loggedUserId", String(decoded.id));
        setLoginStatus(true);
        navigate("/");
        break;
      }

      case 400:
      case 403:
      case 500:
        setError("Incorrect email or password");
        console.log(error);
        break;
    }
    console.log(error);
  };

  return (
    <div className="login">
      <h1>Log In</h1>
      <form action="" onSubmit={login}>
        <div className="errorHandling">
          <h3>{error}</h3>
        </div>
        <div className="emailField">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="passwordField">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>  
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
