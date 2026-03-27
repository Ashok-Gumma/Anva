import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
  updateProfile,
  updatePassword,
  getUserProfile,
  unfriend,
  blockUser,
  unblockUser,
  getBlockedUsers
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.get("/blocked", getBlockedUsers);

router.put("/profile", updateProfile);
router.put("/password", updatePassword);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

router.get("/:id", getUserProfile);
router.delete("/friend/:id", unfriend);
router.post("/block/:id", blockUser);
router.delete("/block/:id", unblockUser);

export default router;
