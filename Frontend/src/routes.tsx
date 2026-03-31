import App from "./App";
import Homepage from "./components/Homepage/homepage";
import Login from "./components/Login/login";
import SignUp from "./components/Sign Up/signUp";
import Conversation from "./components/Homepage/Messages/Conversation/conversation";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "/Log-in", element: <Login /> },
      { path: "/Sign-up", element: <SignUp /> },
      { path: "/conversation/:id", element: <Conversation /> },
    ],
  },
];

export default routes;
