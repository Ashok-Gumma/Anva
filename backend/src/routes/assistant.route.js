import express from "express";
import { chatWithAssistant, checkGrammar, getChatHistory, clearChatHistory } from "../controllers/assistant.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history", protectRoute, getChatHistory);
router.delete("/history", protectRoute, clearChatHistory);
router.post("/chat", protectRoute, chatWithAssistant);
router.post("/grammar", protectRoute, checkGrammar);

export default router;
