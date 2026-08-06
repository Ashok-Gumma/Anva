import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.patch("/:id/read", protectRoute, markNotificationRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
