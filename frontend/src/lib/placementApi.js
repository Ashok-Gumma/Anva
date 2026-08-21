import { axiosInstance } from "./axios";

/**
 * Fetch list of all active placement companies with user progress & readiness
 */
export const getPlacementCompanies = async () => {
  const response = await axiosInstance.get("/placement/companies");
  return response.data;
};

/**
 * Fetch single company dashboard info with category breakdowns and recommendations
 */
export const getCompanyPlacementDetails = async (slug) => {
  const response = await axiosInstance.get(`/placement/companies/${slug}`);
  return response.data;
};

/**
 * Fetch questions with multi-criteria filters (category, topic, difficulty, search, page)
 */
export const getPlacementQuestions = async (params = {}) => {
  const response = await axiosInstance.get("/placement/questions", { params });
  return response.data;
};

/**
 * Fetch a single question by ID (with hints, testcases, solution)
 */
export const getPlacementQuestionById = async (id) => {
  const response = await axiosInstance.get(`/placement/questions/${id}`);
  return response.data;
};

/**
 * Submit user answer for MCQ (Aptitude, English, Technical)
 */
export const submitPlacementAnswer = async (data) => {
  const response = await axiosInstance.post("/placement/submit-answer", data);
  return response.data;
};

/**
 * Run code against sample test cases or custom input
 */
export const runPlacementCode = async (data) => {
  const response = await axiosInstance.post("/placement/run-code", data);
  return response.data;
};

/**
 * Submit code solution against all test cases (including hidden)
 */
export const submitPlacementCode = async (data) => {
  const response = await axiosInstance.post("/placement/submit-code", data);
  return response.data;
};

/**
 * Toggle bookmark status for a question
 */
export const togglePlacementBookmark = async (questionId) => {
  const response = await axiosInstance.post("/placement/bookmark", { questionId });
  return response.data;
};

/**
 * Fetch user's bookmarked questions
 */
export const getPlacementBookmarks = async () => {
  const response = await axiosInstance.get("/placement/bookmarks");
  return response.data;
};

/**
 * Fetch user's overall placement preparation progress & weak topic analytics
 */
export const getPlacementUserProgress = async () => {
  const response = await axiosInstance.get("/placement/progress");
  return response.data;
};

/**
 * Start a balanced mock OA assessment
 */
export const startPlacementMockTest = async (companySlug) => {
  const response = await axiosInstance.post("/placement/mock-test/start", { companySlug });
  return response.data;
};

/**
 * Submit mock OA test results for grading & report generation
 */
export const submitPlacementMockTest = async (data) => {
  const response = await axiosInstance.post("/placement/mock-test/submit", data);
  return response.data;
};
