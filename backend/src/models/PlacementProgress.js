import mongoose from "mongoose";

const solvedQuestionSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlacementQuestion",
    required: true,
  },
  category: {
    type: String,
    enum: ["aptitude", "english", "technical", "coding", "interview"],
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  userChoice: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  code: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: "",
  },
  companySlug: {
    type: String,
    default: "",
    lowercase: true,
    trim: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

const mockTestResultSchema = new mongoose.Schema({
  companySlug: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    default: "",
  },
  score: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  timeTakenSeconds: {
    type: Number,
    default: 0,
  },
  categoryBreakdown: {
    aptitude: { score: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    english: { score: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    technical: { score: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
    coding: { score: { type: Number, default: 0 }, total: { type: Number, default: 0 } },
  },
  weakTopics: [
    {
      type: String,
    },
  ],
  recommendations: [
    {
      type: String,
    },
  ],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const placementProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    solvedQuestions: [solvedQuestionSchema],
    bookmarkedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlacementQuestion",
      },
    ],
    mockTestHistory: [mockTestResultSchema],
  },
  { timestamps: true }
);

placementProgressSchema.index({ "solvedQuestions.questionId": 1 });

const PlacementProgress = mongoose.model("PlacementProgress", placementProgressSchema);

export default PlacementProgress;
