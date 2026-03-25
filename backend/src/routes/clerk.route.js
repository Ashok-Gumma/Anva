import express from "express";
import { handleClerkWebhook } from "../controllers/clerk.controller.js";

const router = express.Router();

// Clerk webhooks need the raw body for Svix signature verification
// The express.raw middleware is applied at the server level for this path
router.post("/", handleClerkWebhook);

export default router;
