import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getPosts,
  getPostById,
  createPost,
  toggleLikePost,
  addCommentPost,
  deleteCommentPost,
  deletePost,
  updatePost,
  toggleSavePost,
  getSavedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getPosts);
router.get("/saved", protectRoute, getSavedPosts);
router.get("/:id", protectRoute, getPostById);
router.post("/", protectRoute, createPost);
router.put("/:id", protectRoute, updatePost);
router.post("/:id/like", protectRoute, toggleLikePost);
router.post("/:id/save", protectRoute, toggleSavePost);
router.put("/:id/save", protectRoute, toggleSavePost);
router.post("/:id/comment", protectRoute, addCommentPost);
router.delete("/:id/comment/:commentId", protectRoute, deleteCommentPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
