import { Link } from "react-router-dom";
import "./nav.css";

type NavProps = {
  setLoginStatus: (status: boolean) => void;
  loginStatus: boolean;
};

function Nav({ loginStatus, setLoginStatus }: NavProps) {
  const logOut = () => {
    setLoginStatus(false);
    sessionStorage.clear();
  };

  if (loginStatus) {
    return (
      <div className="navBar">
        <h1>
          <Link to="/">Messaging-App</Link>
        </h1>
        <div className="navLinks">
          <h3>
            <Link to={`users/${sessionStorage.getItem("loggedUserId")}`}>
              {sessionStorage.getItem("loggedUsername") || "User"}
            </Link>
          </h3>
          <h3>
            <Link to="/">Home</Link>
          </h3>
          <h3>
            <button onClick={logOut}>Logout</button>
          </h3>
          <h3>
            <Link to="edit-profile">Edit My Profile</Link>
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="navBar">
      <h1>
        <Link to="/">Messaging-App</Link>
      </h1>
      <div className="navLinks">
        <h3>
          <Link to="/">Home</Link>
        </h3>
        <h3>
          <Link to="/Log-in">Log In</Link>
        </h3>
        <h3>
          <Link to="/Sign-up">Sign Up</Link>
        </h3>
      </div>
    </div>
  );
}

export default Nav;
