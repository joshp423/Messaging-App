import './App.css';
import { useState } from 'react';
import Nav from './components/Nav/nav';
import Homepage from './components/Homepage/homepage';
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
      <Homepage 
        loginStatus={loginStatus}
      />

    </>
  )
}

export default App
