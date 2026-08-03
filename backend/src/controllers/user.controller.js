import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { upsertStreamUser, blockStreamUser, unblockStreamUser } from "../lib/stream.js";

export async function updateProfile(req, res) {
  try {
    const { profilePic, githubUrl, linkedinUrl } = req.body;
    const userId = req.user.id;

    // Build update object dynamically
    const updateData = {};
    if (profilePic !== undefined) updateData.profilePic = profilePic;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sync with Stream Chat
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic,
      });
      console.log(`Stream user updated for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error syncing Stream user:", streamError);
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await user.matchPassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save(); 

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const existingRequests = await FriendRequest.find({
      $or: [{ sender: currentUserId }, { recipient: currentUserId }],
    });

    const userIdsWithRequests = existingRequests.map((r) =>
      r.sender.toString() === currentUserId ? r.recipient : r.sender
    );

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { _id: { $nin: userIdsWithRequests } }, // exclude users with existing requests
        { _id: { $nin: currentUser.blockedUsers } }, // exclude users blocked by current user
        { blockedUsers: { $ne: currentUserId } }, // exclude users who blocked current user
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends blockedUsers")
      .populate(
        "friends",
        "fullName profilePic location bio nativeLanguage learningLanguage blockedUsers lastActive"
      );

    // Filter out friends I have blocked OR who have blocked me
    const activeFriends = user.friends.filter(friend => {
      const isBlockedByMe = user.blockedUsers.some(blockedId => blockedId.toString() === friend._id.toString());
      const hasBlockedMe = friend.blockedUsers && friend.blockedUsers.some(blockedId => blockedId.toString() === req.user.id.toString());
      return !isBlockedByMe && !hasBlockedMe;
    });

    res.status(200).json(activeFriends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if either user has blocked the other
    const currentUser = await User.findById(myId);
    if (currentUser.blockedUsers.includes(recipientId)) {
      return res.status(400).json({ message: "You have blocked this user" });
    }
    if (recipient.blockedUsers.includes(myId)) {
      return res.status(400).json({ message: "This user has blocked you" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function cancelFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    const friendRequest = await FriendRequest.findOneAndDelete({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
      status: "pending",
    });

    res.status(200).json({
      message: friendRequest
        ? "Friend request un-sent successfully"
        : "Friend request removed",
    });
  } catch (error) {
    console.error("Error in cancelFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password -friends");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function unfriend(req, res) {
  try {
    const myId = req.user.id;
    const { id: friendId } = req.params;

    // Remove each from other's friends list
    await User.findByIdAndUpdate(myId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: myId } });

    // Delete any existing friend requests (accepted or pending)
    await FriendRequest.deleteMany({
      $or: [
        { sender: myId, recipient: friendId },
        { sender: friendId, recipient: myId },
      ],
    });

    res.status(200).json({ message: "Unfriended successfully" });
  } catch (error) {
    console.error("Error in unfriend controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function blockUser(req, res) {
  try {
    const myId = req.user.id;
    const { id: targetId } = req.params;

    if (myId === targetId) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const user = await User.findById(myId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add to blockedUsers if not already there
    if (!user.blockedUsers.includes(targetId)) {
      user.blockedUsers.push(targetId);
    }

    // Delete only PENDING friend requests
    // We keep 'accepted' ones to preserve the friendship history
    await FriendRequest.deleteMany({
      $or: [
        { sender: myId, recipient: targetId, status: "pending" },
        { sender: targetId, recipient: myId, status: "pending" },
      ],
    });

    await user.save();

    // Sync with Stream Chat
    await blockStreamUser(myId, targetId);

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Error in blockUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function unblockUser(req, res) {
  try {
    const myId = req.user.id;
    const { id: targetId } = req.params;

    const user = await User.findById(myId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blockedUsers = user.blockedUsers.filter(uid => uid.toString() !== targetId.toString());

    await user.save();

    // Sync with Stream Chat
    await unblockStreamUser(myId, targetId);

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error("Error in unblockUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getBlockedUsers(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("blockedUsers")
      .populate("blockedUsers", "fullName profilePic location bio nativeLanguage learningLanguage");

    res.status(200).json(user.blockedUsers);
  } catch (error) {
    console.error("Error in getBlockedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
