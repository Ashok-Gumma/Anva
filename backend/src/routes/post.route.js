import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getPosts,
  getPostById,
  createPost,
  toggleLikePost,
  addCommentPost,
  updateCommentPost,
  deleteCommentPost,
  deletePost,
  updatePost,
  toggleSavePost,
  getSavedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getPosts);
router.get("/saved", protectRoute, getSavedPosts);
router.post("/", protectRoute, createPost);

// Sub-resource routes (must be placed before generic /:id routes)
router.put("/:id/comment/:commentId", protectRoute, updateCommentPost);
router.post("/:id/comment/:commentId", protectRoute, updateCommentPost);
router.delete("/:id/comment/:commentId", protectRoute, deleteCommentPost);
router.post("/:id/comment", protectRoute, addCommentPost);
router.post("/:id/like", protectRoute, toggleLikePost);
router.post("/:id/save", protectRoute, toggleSavePost);
router.put("/:id/save", protectRoute, toggleSavePost);

// Generic post routes
router.get("/:id", protectRoute, getPostById);
router.put("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);

export default router;
