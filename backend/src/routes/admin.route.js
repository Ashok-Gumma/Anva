import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { protectAdminRoute } from "../middleware/admin.middleware.js";
import {
  getComplaints,
  updateComplaint,
  deleteComplaint,
  sendWarningNotification,
  toggleSuspendOffender,
  deleteOffender,
  getAdminStats,
  getUsers,
  updateUserDetails,
  updateUserRole,
  toggleSuspendUser,
  deleteUser,
  promoteToAdmin,
  broadcastAnnouncement,
  getAdminPosts,
  deleteAdminPost,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes strictly require valid login AND admin role
router.use(protectRoute, protectAdminRoute);

router.post("/promote", promoteToAdmin);
router.get("/stats", getAdminStats);
router.post("/broadcast", broadcastAnnouncement);

router.get("/complaints", getComplaints);
router.patch("/complaints/:id", updateComplaint);
router.delete("/complaints/:id", deleteComplaint);

router.post("/send-warning", sendWarningNotification);
router.post("/offenders/suspend", toggleSuspendOffender);
router.post("/offenders/delete", deleteOffender);

router.get("/users", getUsers);
router.put("/users/:id", updateUserDetails);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/suspend", toggleSuspendUser);
router.delete("/users/:id", deleteUser);

router.get("/posts", getAdminPosts);
router.delete("/posts/:id", deleteAdminPost);

export default router;

