import { Router } from "express";
import { getMessages } from "../controllers/message.js";

const messageRouter= Router();

messageRouter.get("/",getMessages);

export default messageRouter;