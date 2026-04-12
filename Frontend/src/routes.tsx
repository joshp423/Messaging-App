import App from "./App";
import Homepage from "./components/Homepage/homepage";
import Login from "./components/Login/login";
import SignUp from "./components/Sign Up/signUp";
import Conversation from "./components/Homepage/Messages/Conversation/conversation";
import UserProfile from "./components/Homepage/Messages/Conversation/Users/userProfile";
import NewConversation from "./components/Homepage/NewConversation/newConversation";
import GroupConversation from "./components/Homepage/Messages/Conversation/groupConversation";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "/Log-in", element: <Login /> },
      { path: "/Sign-up", element: <SignUp /> },
      {
        path: "/conversation/:conversationId",
        element: <Conversation />,
      },
      {
        path: "/groupConversation/:conversationId",
        element: <GroupConversation />,
      },
      { path: "/user/:userId", element: <UserProfile /> },
      { path: "/new-message", element: <NewConversation /> },
    ],
  },
];

export default routes;
