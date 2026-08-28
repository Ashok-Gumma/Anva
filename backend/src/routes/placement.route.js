import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCompanies,
  getCompanyDetails,
  getQuestions,
  getQuestionById,
  submitAnswer,
  runCodingTest,
  submitCodingSolution,
  toggleBookmark,
  getBookmarks,
  getUserProgress,
  startMockTest,
  submitMockTest,
  resetProgress,
  askPlacementAiCopilot,
} from "../controllers/placement.controller.js";

const router = express.Router();

// Company listings & specific details
router.get("/companies", protectRoute, getCompanies);
router.get("/companies/:slug", protectRoute, getCompanyDetails);

// Questions (Aptitude, English, Technical, Coding, Interview)
router.get("/questions", protectRoute, getQuestions);
router.get("/questions/:id", protectRoute, getQuestionById);

// Practice & Submissions
router.post("/submit-answer", protectRoute, submitAnswer);
router.post("/reset-progress", protectRoute, resetProgress);
router.post("/run-code", protectRoute, runCodingTest);
router.post("/submit-code", protectRoute, submitCodingSolution);

// AI Copilot for AI-Assisted Coding (Strictly mentor clues, never full answers)
router.post("/ai-copilot", protectRoute, askPlacementAiCopilot);

// Bookmarks
router.post("/bookmark", protectRoute, toggleBookmark);
router.get("/bookmarks", protectRoute, getBookmarks);

// Progress & Recommendations
router.get("/progress", protectRoute, getUserProgress);

// Mock Assessments
router.post("/mock-test/start", protectRoute, startMockTest);
router.post("/mock-test/submit", protectRoute, submitMockTest);

export default router;
