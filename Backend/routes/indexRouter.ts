import { Router } from "express";
import * as indexController from "../controllers/indexController.js";
import {
  signUp,
  logIn,
  editProfile,
  getUserId,
  getUserIds,
  initialProfileUpdate,
  uploadPFP,
  getUserProfile,
} from "../controllers/userController.js";
import {
  uploadMessageImage,
  sendMessageSingleRecipient,
  sendMessageGroupRecipient,
} from "../controllers/messageController.js";
import {
  getUserConversations,
  getSoloConversation,
  getGroupConversation,
  createNewGroup,
} from "../controllers/conversationController.js";
const indexRouter = Router();

indexRouter.post("/sign-up", signUp);
indexRouter.post("/log-in", logIn);
indexRouter.put("/edit-profile", indexController.verifyToken, editProfile);
indexRouter.post(
  "/send-message-solo",
  indexController.verifyToken,
  sendMessageSingleRecipient,
);
indexRouter.post(
  "/send-message-group",
  indexController.verifyToken,
  sendMessageGroupRecipient,
);
indexRouter.get(
  "/conversations",
  indexController.verifyToken,
  getUserConversations,
);
indexRouter.put("/create-group", indexController.verifyToken, createNewGroup);
indexRouter.put("/initialProfileUpdate", initialProfileUpdate);
indexRouter.post("/uploadPFP", uploadPFP);
indexRouter.post(
  "/uploadMessageImage",
  indexController.verifyToken,
  uploadMessageImage,
);
indexRouter.get("/users/:userId", indexController.verifyToken, getUserProfile);

indexRouter.get(
  "/conversations/:conversationId",
  indexController.verifyToken,
  getSoloConversation,
);
indexRouter.get(
  "/groupConversations/:conversationId",
  indexController.verifyToken,
  getGroupConversation,
);

indexRouter.post("/getUserId", indexController.verifyToken, getUserId);
indexRouter.post("/getUserIds", indexController.verifyToken, getUserIds);

export default indexRouter;
