import { useState } from "react";
import { type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useOutletContext } from "react-router-dom";

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

  const { setLoginStatus } = useOutletContext<LoginProps>();

  const navigate = useNavigate();

  const login = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
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

        case 200:
          const decoded = jwtDecode<JwtPayload>(data.token);
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("loggedUsername", decoded.username);
          sessionStorage.setItem("loggedUserId", String(decoded.id));
          setLoginStatus(true);
          navigate("/")
          break;

        case 400:
          console.log(data.errors)
          //pass back error on form
          break;

        case 403:
          console.log(data.errors)
          //pass back error on form
          break;

        case 500:
          navigate("/error");
          break;
      }

    } catch (err) {
      navigate("/error");
      console.error(err);
    }
  };

  const backHome = () => {
    navigate("/");
  };

  return (
    <div className="login">
      <form action="" onSubmit={login}>
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={backHome}>Back</button>
    </div>
  );
}

export default Login;
