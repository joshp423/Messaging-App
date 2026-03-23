import './App.css';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Nav from './components/Nav/nav';

const App = () => {

  const [loginStatus, setLoginStatus] = useState<boolean>(() =>
    Boolean(sessionStorage.getItem("loggedUser")),
  );

  return (
    <>
      <Nav
        setLoginStatus={setLoginStatus}
        loginStatus={loginStatus}
      />
      <Outlet context={{ loginStatus: loginStatus, setLoginStatus: setLoginStatus }} />
    </>
  );
};

export default App
