import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String, default: "" },
});

const placementQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["aptitude", "english", "technical", "coding", "interview"],
      index: true,
    },
    type: {
      type: String,
      enum: ["mcq", "coding", "interview", "reading_comprehension"],
      default: "mcq",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
      index: true,
    },
    companies: [
      {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
      },
    ],
    topics: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    frequency: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "High",
      index: true,
    },
    source: {
      type: String,
      default: "Reported in placement/OA/interview preparation sources",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    lastReviewed: {
      type: String,
      default: "2026",
    },

    // ── MCQ / Aptitude / English / Technical fields ──
    description: {
      type: String,
      default: "",
    },
    passage: {
      type: String,
      default: "", // For Reading Comprehension
    },
    options: [
      {
        type: String,
      },
    ],
    correctAnswer: {
      type: Number, // 0-based index of the correct option in options array
      default: 0,
    },
    explanation: {
      type: String,
      default: "",
    },
    formula: {
      type: String,
      default: "",
    },

    // ── Coding specific fields ──
    problemDescription: {
      type: String,
      default: "",
    },
    examples: [exampleSchema],
    constraints: [
      {
        type: String,
      },
    ],
    starterCode: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" },
      cpp: { type: String, default: "" },
      java: { type: String, default: "" },
    },
    testCases: [testCaseSchema],
    hints: [
      {
        type: String,
      },
    ],
    approach: {
      type: String,
      default: "",
    },
    solutionCode: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" },
      cpp: { type: String, default: "" },
      java: { type: String, default: "" },
    },
    timeComplexity: {
      type: String,
      default: "O(n)",
    },
    spaceComplexity: {
      type: String,
      default: "O(1)",
    },

    // ── Interview specific fields ──
    interviewCategory: {
      type: String,
      enum: ["Technical", "HR", "Project"],
      default: "Technical",
    },
    question: {
      type: String,
      default: "",
    },
    whatInterviewerExpects: [
      {
        type: String,
      },
    ],
    importantPoints: [
      {
        type: String,
      },
    ],
    sampleAnswer: {
      type: String,
      default: "",
    },
    tips: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

placementQuestionSchema.index({ category: 1, companies: 1, difficulty: 1 });
placementQuestionSchema.index({ category: 1, topics: 1 });
placementQuestionSchema.index({ companies: 1, category: 1, frequency: 1, createdAt: -1 });
placementQuestionSchema.index({ category: 1, difficulty: 1 });
placementQuestionSchema.index({ title: "text", description: "text" });

const PlacementQuestion = mongoose.model("PlacementQuestion", placementQuestionSchema);

export default PlacementQuestion;
