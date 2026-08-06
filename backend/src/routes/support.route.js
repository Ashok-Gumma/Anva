import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createSupportTicket, getUserTickets } from "../controllers/support.controller.js";

const router = express.Router();

router.post("/", protectRoute, createSupportTicket);
router.get("/my-tickets", protectRoute, getUserTickets);

export default router;
