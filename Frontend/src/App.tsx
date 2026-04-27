import "./App.css";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Nav from "./components/Nav/nav";

const App = () => {
  //https://coolors.co/0d1f22-264027-3c5233-6f732f-b38a58
  const [loginStatus, setLoginStatus] = useState<boolean>(() =>
    Boolean(localStorage.getItem("token")),
  );

  console.log(loginStatus)
  return (
    <>
      <Nav setLoginStatus={setLoginStatus} loginStatus={loginStatus} />
      <Outlet
        context={{ loginStatus: loginStatus, setLoginStatus: setLoginStatus }}
      />
    </>
  );
};

export default App;
