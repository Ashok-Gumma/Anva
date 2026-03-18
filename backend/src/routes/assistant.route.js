import express from "express";
import { chatWithAssistant, checkGrammar } from "../controllers/assistant.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/chat", protectRoute, chatWithAssistant);
router.post("/grammar", protectRoute, checkGrammar);

export default router;
