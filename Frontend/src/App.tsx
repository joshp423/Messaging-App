import './App.css';
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
    </>
  )
}

export default App
