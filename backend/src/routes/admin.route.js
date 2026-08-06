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
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/promote", protectRoute, promoteToAdmin);

// All routes below require login AND admin role
router.use(protectRoute, protectAdminRoute);

router.get("/stats", getAdminStats);
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

export default router;
