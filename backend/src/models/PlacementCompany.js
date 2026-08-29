import mongoose from "mongoose";

const placementCompanySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    tier: {
      type: String,
      enum: ["FAANG / Top Product", "Product Giant", "IT & Consulting Leader", "Fintech & Startups"],
      default: "Product Giant",
    },
    hiringRoles: [
      {
        type: String,
      },
    ],
    rounds: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ["Online Assessment", "Technical Interview", "System Design", "HR / Behavioral", "Managerial"], default: "Technical Interview" },
        category: { type: String, enum: ["aptitude", "english", "technical", "coding", "interview"], default: "technical" },
        description: { type: String, default: "" },
        duration: { type: String, default: "60 mins" },
      },
    ],
    popular: {
      type: Boolean,
      default: false,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    stats: {
      totalQuestions: { type: Number, default: 0 },
      totalCoding: { type: Number, default: 0 },
      avgPackage: { type: String, default: "12-25 LPA" },
      difficulty: { type: String, enum: ["Easy-Medium", "Medium", "Medium-Hard", "Hard"], default: "Medium" },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

placementCompanySchema.index({ popular: 1, order: 1 });

const PlacementCompany = mongoose.model("PlacementCompany", placementCompanySchema);

export default PlacementCompany;
