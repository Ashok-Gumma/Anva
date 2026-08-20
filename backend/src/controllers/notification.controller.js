import Notification from "../models/Notification.js";

// Fetch user notifications sorted by newest first
export async function getUserNotifications(req, res) {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .populate("sender", "fullName email profilePic role")
        .populate("ticketId", "subject status category priority")
        .lean()
        .exec(),
      Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      }),
    ]);

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// Mark single notification as read
export async function markNotificationRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("Error marking notification read:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Mark all notifications as read for current user
export async function markAllNotificationsRead(req, res) {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete single notification
export async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Clear all notifications for current user
export async function clearAllNotifications(req, res) {
  try {
    await Notification.deleteMany({ recipient: req.user._id });

    res.status(200).json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


