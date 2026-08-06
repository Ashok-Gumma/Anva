import SupportTicket from "../models/SupportTicket.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// Helper to resolve user by ID, email, or name flexibly
async function findUserByIdentifier(identifier) {
  if (!identifier) return null;

  let cleaned = identifier.replace(/^👤\s*/, "").trim();

  if (mongoose.Types.ObjectId.isValid(cleaned)) {
    const user = await User.findById(cleaned);
    if (user) return user;
  }

  // Extract email if formatted as "John Doe (john@gmail.com)"
  const emailMatch = cleaned.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
  if (emailMatch) {
    const userByEmail = await User.findOne({ email: emailMatch[1] });
    if (userByEmail) return userByEmail;
  }

  // Clean name without email parenthetical part
  const nameOnly = cleaned.replace(/\s*\([^)]*\)/g, "").trim();

  if (!nameOnly) return null;

  // Escape special regex chars for safety
  const safeSearch = nameOnly.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return await User.findOne({
    $or: [
      { email: { $regex: safeSearch, $options: "i" } },
      { fullName: { $regex: safeSearch, $options: "i" } },
    ],
  });
}

// Get all complaints / support tickets for admin view
export async function getComplaints(req, res) {
  try {
    const { status, category, search } = req.query;

    let filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    let tickets = await SupportTicket.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "fullName email profilePic role createdAt friends");

    if (search) {
      const s = search.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.subject?.toLowerCase().includes(s) ||
          t.message?.toLowerCase().includes(s) ||
          t.user?.fullName?.toLowerCase().includes(s) ||
          t.user?.email?.toLowerCase().includes(s) ||
          t.reportedUserAccount?.toLowerCase().includes(s)
      );
    }

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching admin complaints:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update complaint status, priority, or admin notes & send notification to user
export async function updateComplaint(req, res) {
  try {
    const { id } = req.params;
    const { status, priority, adminNotes } = req.body;

    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === "Resolved") {
        updateData.resolvedAt = new Date();
      }
    }
    if (priority) updateData.priority = priority;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const ticket = await SupportTicket.findByIdAndUpdate(id, updateData, { new: true })
      .populate("user", "fullName email profilePic");

    if (!ticket) {
      return res.status(404).json({ message: "Complaint ticket not found." });
    }

    // Automatically send notification to the user about their complaint status / admin response
    if (ticket.user) {
      const recipientId = ticket.user._id || ticket.user;
      const notifTitle = `Support Complaint Update: ${ticket.subject}`;
      const notifMessage = status
        ? `Status changed to "${status}". ${adminNotes ? `Admin note: "${adminNotes}"` : ""}`
        : `Admin Response: "${adminNotes}"`;

      try {
        await Notification.create({
          recipient: recipientId,
          sender: req.user._id,
          type: status === "Resolved" ? "complaint_resolution" : "support_update",
          title: notifTitle,
          message: notifMessage,
          ticketId: ticket._id,
          isRead: false,
        });
      } catch (notifErr) {
        console.error("Failed to create notification for user:", notifErr);
      }
    }

    res.status(200).json({ success: true, message: "Complaint updated & user notified successfully", ticket });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Send official warning notification to reported offender
export async function sendWarningNotification(req, res) {
  try {
    const { targetUserIdentifier, ticketId, warningTitle, warningMessage } = req.body;

    if (!targetUserIdentifier || !warningMessage) {
      return res.status(400).json({ message: "Target user and warning message are required." });
    }

    const targetUser = await findUserByIdentifier(targetUserIdentifier);

    if (!targetUser) {
      return res.status(400).json({ message: `Could not find registered user matching "${targetUserIdentifier}". Please select or enter a valid user account.` });
    }

    const notif = await Notification.create({
      recipient: targetUser._id,
      sender: req.user._id,
      type: "admin_warning",
      title: warningTitle || "⚠️ Official Administrative Warning",
      message: warningMessage,
      ticketId: ticketId || null,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      message: `Official Warning delivered to OFFENDER: ${targetUser.fullName} (${targetUser.email})!`,
      notification: notif,
    });
  } catch (error) {
    console.error("Error sending warning notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Suspend offender by identifier (name / email / ID)
export async function toggleSuspendOffender(req, res) {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "Offender name, email, or ID is required." });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return res.status(400).json({ message: `Could not find registered offender account for "${identifier}".` });
    }

    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "You cannot suspend your own admin account!" });
    }

    if (user.isSuspended) {
      user.isSuspended = false;
      user.suspendedAt = null;
      user.suspendedUntil = null;
    } else {
      user.isSuspended = true;
      user.suspendedAt = new Date();
      user.suspendedUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 Days
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isSuspended
        ? `Offender account for ${user.fullName} (${user.email}) SUSPENDED for 15 Days!`
        : `Offender account for ${user.fullName} (${user.email}) RESTORED.`,
      isSuspended: user.isSuspended,
      user,
    });
  } catch (error) {
    console.error("Error toggling offender suspension:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete offender by identifier (name / email / ID)
export async function deleteOffender(req, res) {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "Offender name, email, or ID is required." });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user) {
      return res.status(400).json({ message: `Could not find registered offender account for "${identifier}".` });
    }

    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account!" });
    }

    await User.findByIdAndDelete(user._id);
    await SupportTicket.deleteMany({ user: user._id });
    await Notification.deleteMany({ recipient: user._id });

    res.status(200).json({
      success: true,
      message: `Offender profile for ${user.fullName} (${user.email}) DELETED permanently!`,
    });
  } catch (error) {
    console.error("Error deleting offender profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete complaint ticket
export async function deleteComplaint(req, res) {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: "Complaint ticket not found." });
    }

    res.status(200).json({ success: true, message: "Complaint ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get admin stats overview
export async function getAdminStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await SupportTicket.countDocuments();
    const pendingComplaints = await SupportTicket.countDocuments({ status: "Pending" });
    const inProgressComplaints = await SupportTicket.countDocuments({ status: "In Progress" });
    const resolvedComplaints = await SupportTicket.countDocuments({ status: "Resolved" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
      },
    });
  } catch (error) {
    console.error("Error getting admin stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get all registered users for user management
export async function getUsers(req, res) {
  try {
    const { search } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update any user's profile details by Admin
export async function updateUserDetails(req, res) {
  try {
    const { id } = req.params;
    const { fullName, email, role, bio, location, nativeLanguage, learningLanguage, isOnboarded, isSuspended } = req.body;

    const allowedUpdates = {};
    if (fullName !== undefined) allowedUpdates.fullName = fullName;
    if (email !== undefined) allowedUpdates.email = email;
    if (role !== undefined && ["user", "admin"].includes(role)) allowedUpdates.role = role;
    if (bio !== undefined) allowedUpdates.bio = bio;
    if (location !== undefined) allowedUpdates.location = location;
    if (nativeLanguage !== undefined) allowedUpdates.nativeLanguage = nativeLanguage;
    if (learningLanguage !== undefined) allowedUpdates.learningLanguage = learningLanguage;
    if (isOnboarded !== undefined) allowedUpdates.isOnboarded = isOnboarded;
    if (isSuspended !== undefined) {
      allowedUpdates.isSuspended = isSuspended;
      if (isSuspended) {
        allowedUpdates.suspendedAt = new Date();
        allowedUpdates.suspendedUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 Days
      } else {
        allowedUpdates.suspendedAt = null;
        allowedUpdates.suspendedUntil = null;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, allowedUpdates, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ success: true, message: "User details updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Toggle suspend user account by admin (by ID)
export async function toggleSuspendUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot suspend your own admin account!" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isSuspended) {
      user.isSuspended = false;
      user.suspendedAt = null;
      user.suspendedUntil = null;
    } else {
      user.isSuspended = true;
      user.suspendedAt = new Date();
      user.suspendedUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 Days
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isSuspended
        ? `Account for ${user.fullName} suspended for 15 Days`
        : `Account for ${user.fullName} restored`,
      isSuspended: user.isSuspended,
      user,
    });
  } catch (error) {
    console.error("Error toggling user suspension:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Change user role (admin <-> user)
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ success: true, message: `User role updated to ${role}`, user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete user account by admin (by ID)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: "You cannot delete your own admin account!" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Cleanup complaints from this user
    await SupportTicket.deleteMany({ user: id });
    await Notification.deleteMany({ recipient: id });

    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Promote user to Admin by email
export async function promoteToAdmin(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User with this email was not found." });

    user.role = "admin";
    await user.save();

    res.status(200).json({ success: true, message: `${user.fullName} (${user.email}) is now an Admin!`, user });
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
