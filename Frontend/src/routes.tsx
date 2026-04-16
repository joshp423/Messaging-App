import App from "./App";
import Homepage from "./components/Homepage/homepage";
import Login from "./components/Login/login";
import SignUp from "./components/Sign Up/signUp";
import Conversation from "./components/Homepage/Messages/Conversation/conversation";
import UserProfile from "./components/Homepage/Messages/Conversation/Users/userProfile";
import NewConversation from "./components/Homepage/NewConversation/newConversation";
import GroupConversation from "./components/Homepage/Messages/Conversation/groupConversation";
import EditProfile from "./components/Nav/EditProfile/editProfile";
import ErrorPage from "./components/ErrorPage/errorPage";
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
        path: "/groupConversation/:groupConversationId",
        element: <GroupConversation />,
      },
      { path: "/user/:userId", element: <UserProfile /> },
      { path: "/new-message", element: <NewConversation /> },
      { path: "/edit-profile", element: <EditProfile /> },
      { path: "/error", element: <ErrorPage  /> }
    ],
  },
];

export default routes;
