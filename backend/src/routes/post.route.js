import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getPosts,
  createPost,
  toggleLikePost,
  addCommentPost,
  deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getPosts);
router.post("/", protectRoute, createPost);
router.post("/:id/like", protectRoute, toggleLikePost);
router.post("/:id/comment", protectRoute, addCommentPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
