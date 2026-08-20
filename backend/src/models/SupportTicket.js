import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Bug", "Account", "Account Appeal", "Feature Request", "Abuse/Harassment", "Spam / Abuse", "General Support", "Other"],
      default: "Bug",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    // Category-specific details
    reportedUserAccount: {
      type: String,
      default: "",
    },
    abuseType: {
      type: String,
      default: "",
    },
    accountIssueType: {
      type: String,
      default: "",
    },
    affectedFeature: {
      type: String,
      default: "",
    },
    deviceInfo: {
      type: String,
      default: "",
    },
    featureImpact: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ── Performance Indexes ──
supportTicketSchema.index({ status: 1, createdAt: -1 });
supportTicketSchema.index({ category: 1, createdAt: -1 });
supportTicketSchema.index({ user: 1, createdAt: -1 });
supportTicketSchema.index({ createdAt: -1 });

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);

export default SupportTicket;

