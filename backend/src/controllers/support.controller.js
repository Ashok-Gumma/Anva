import SupportTicket from "../models/SupportTicket.js";

// Create a new support ticket / complaint with category-specific details
export async function createSupportTicket(req, res) {
  try {
    const {
      subject,
      category,
      message,
      priority,
      reportedUserAccount,
      abuseType,
      accountIssueType,
      affectedFeature,
      deviceInfo,
      featureImpact,
    } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and description message are required." });
    }

    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject,
      category: category || "Bug",
      message,
      priority: priority || "Medium",
      status: "Pending",
      reportedUserAccount: reportedUserAccount || "",
      abuseType: abuseType || "",
      accountIssueType: accountIssueType || "",
      affectedFeature: affectedFeature || "",
      deviceInfo: deviceInfo || "",
      featureImpact: featureImpact || "",
    });

    await ticket.populate("user", "fullName email profilePic");

    res.status(201).json({
      success: true,
      message: "Complaint ticket submitted successfully. Our team will review it shortly.",
      ticket,
    });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get tickets submitted by the logged-in user
export async function getUserTickets(req, res) {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "fullName email profilePic");

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
