import { Router } from "express";
import * as indexController from "../controllers/indexController.js";
const indexRouter = Router();

indexRouter.post("/sign-up", indexController.signUp);
indexRouter.post("/log-in", indexController.logIn);

export default indexRouter;