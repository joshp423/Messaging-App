import { Router } from "express";
import * as indexController from "../controllers/indexController.js";
const indexRouter = Router();

indexRouter.post("/sign-up", indexController.signUp);
indexRouter.post("/log-in", indexController.logIn);
indexRouter.put("/edit-profile", indexController.editProfile);
indexRouter.post("/send-message-solo", indexController.sendMessageSingleRecipient);
indexRouter.post("/send-message-group", indexController.sendMessageGroupRecipient);

export default indexRouter;
