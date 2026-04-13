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
} from "../controllers/userController.js";
const indexRouter = Router();

indexRouter.post("/sign-up", signUp);
indexRouter.post("/log-in", logIn);
indexRouter.put("/edit-profile", indexController.verifyToken, editProfile);
indexRouter.post(
  "/send-message-solo",
  indexController.verifyToken,
  indexController.sendMessageSingleRecipient,
);
indexRouter.post(
  "/send-message-group",
  indexController.verifyToken,
  indexController.sendMessageGroupRecipient,
);
indexRouter.get(
  "/conversations",
  indexController.verifyToken,
  indexController.getUserConversations,
);
indexRouter.put(
  "/create-group",
  indexController.verifyToken,
  indexController.createNewGroup,
);
indexRouter.put("/initialProfileUpdate", initialProfileUpdate);
indexRouter.post("/uploadPFP", uploadPFP);
indexRouter.post(
  "/uploadMessageImage",
  indexController.verifyToken,
  indexController.uploadMessageImage,
);
indexRouter.get(
  "/users/:userId",
  indexController.verifyToken,
  indexController.getUserProfile,
);

indexRouter.get(
  "/conversations/:conversationId",
  indexController.verifyToken,
  indexController.getSoloConversation,
);
indexRouter.get(
  "/groupConversations/:conversationId",
  indexController.verifyToken,
  indexController.getGroupConversation,
);

indexRouter.post("/getUserId", indexController.verifyToken, getUserId);
indexRouter.post("/getUserIds", indexController.verifyToken, getUserIds);

export default indexRouter;
