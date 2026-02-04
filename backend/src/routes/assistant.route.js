import express from "express";
import { chatWithAssistant } from "../controllers/assistant.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/chat", protectRoute, chatWithAssistant);

export default router;
