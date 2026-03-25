import { Router } from "express";
import * as indexController from "../controllers/indexController.js";
const indexRouter = Router();

indexRouter.post("/sign-up", indexController.signUp);
indexRouter.post("/log-in", indexController.logIn);
indexRouter.put(
  "/edit-profile",
  indexController.verifyToken,
  indexController.editProfile,
);
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
  "/receive-messages",
  indexController.verifyToken,
  indexController.getUserConversations,
);
indexRouter.put(
  "/create-group",
  indexController.verifyToken,
  indexController.createNewGroup,
);
indexRouter.put("/initialProfileUpdate", indexController.initialProfileUpdate);
indexRouter.post("/uploadPFP", indexController.uploadPFP);
indexRouter.get("/get-usernames", indexController.verifyToken,
indexController.getSoloUsernames)
export default indexRouter;
