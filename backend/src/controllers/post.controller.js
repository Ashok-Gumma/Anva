import Post from "../models/Post.js";
import User from "../models/User.js";
import { checkTextSafetyAI, checkMediaSafety } from "../lib/contentSafety.js";

// Fetch all posts (or filter by subject or userId)
export async function getPosts(req, res) {
  try {
    const { subject, userId } = req.query;

    if (subject === "Saved Posts") {
      return getSavedPosts(req, res);
    }

    const query = {};
    if (subject && subject !== "All") query.subject = subject;
    if (userId) query.user = userId;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "fullName profilePic role")
      .populate("comments.user", "fullName profilePic")
      .lean();

    // Enrich posts with boolean flags while retaining image and pdfUrl for immediate feed rendering
    const enrichedPosts = posts.map((p) => ({
      ...p,
      hasImage: !!p.image,
      hasPdf: !!p.pdfUrl,
    }));

    res.status(200).json({ success: true, posts: enrichedPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts." });
  }
}

// Fetch a single post with full content (image / pdfUrl included)
export async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "fullName profilePic role")
      .populate("comments.user", "fullName profilePic")
      .lean();

    if (!post) return res.status(404).json({ message: "Post not found." });
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post." });
  }
}

// Create a new educational post with PDF support and content moderation
export async function createPost(req, res) {
  try {
    const { caption, image, pdfUrl, pdfName, subject } = req.body;

    if (!caption || !caption.trim()) {
      return res.status(400).json({ message: "Post caption is required." });
    }

    // ── Content Safety & AI Moderation Inspection ──
    const textCheck = await checkTextSafetyAI(caption);
    if (!textCheck.isValid) {
      return res.status(400).json({ message: textCheck.reason });
    }

    if (image) {
      const imageCheck = checkMediaSafety(image);
      if (!imageCheck.isValid) {
        return res.status(400).json({ message: imageCheck.reason });
      }
    }

    if (pdfUrl) {
      const pdfCheck = checkMediaSafety(pdfUrl, pdfName);
      if (!pdfCheck.isValid) {
        return res.status(400).json({ message: pdfCheck.reason });
      }
    }

    const post = await Post.create({
      user: req.user._id,
      caption: caption.trim(),
      image: image || "",
      pdfUrl: pdfUrl || "",
      pdfName: pdfName || "",
      subject: subject || "General",
      likes: [],
      comments: [],
    });

    await post.populate("user", "fullName email profilePic role");

    res.status(201).json({
      success: true,
      message: "Educational post published successfully!",
      post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post." });
  }
}

// Toggle like on a post
export async function toggleLikePost(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((likedUserId) => likedUserId.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    await post.populate("user", "fullName email profilePic role");
    await post.populate("comments.user", "fullName email profilePic");

    res.status(200).json({
      success: true,
      message: isLiked ? "Post unliked." : "Post liked!",
      post,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Failed to update like." });
  }
}

// Add a comment to a post
export async function addCommentPost(req, res) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty." });
    }

    const commentSafety = await checkTextSafetyAI(text);
    if (!commentSafety.isValid) {
      return res.status(400).json({ message: commentSafety.reason });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({
      user: req.user._id,
      text: text.trim(),
    });

    await post.save();
    await post.populate("user", "fullName email profilePic role");
    await post.populate("comments.user", "fullName email profilePic");

    res.status(201).json({
      success: true,
      message: "Comment added!",
      post,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment." });
  }
}

// Delete a comment — allowed for: the comment author OR the post owner OR admin
export async function deleteCommentPost(req, res) {
  try {
    const { id, commentId } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isPostOwner    = post.user.toString()    === req.user._id.toString();
    const isAdmin        = req.user.role === "admin";

    if (!isCommentAuthor && !isPostOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this comment." });
    }

    // Atomically pull the comment from the array
    await Post.findByIdAndUpdate(id, { $pull: { comments: { _id: commentId } } });

    res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment." });
  }
}

// Update a comment — allowed for: comment author OR admin
export async function updateCommentPost(req, res) {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty." });
    }

    const commentSafety = await checkTextSafetyAI(text);
    if (!commentSafety.isValid) {
      return res.status(400).json({ message: commentSafety.reason });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCommentAuthor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to edit this comment." });
    }

    comment.text = text.trim();
    await post.save();
    await post.populate("user", "fullName email profilePic role");
    await post.populate("comments.user", "fullName email profilePic");

    res.status(200).json({
      success: true,
      message: "Comment updated!",
      post,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Failed to update comment." });
  }
}

// Delete a post (author or admin)
export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const isAuthor = post.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post." });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Failed to delete post." });
  }
}

// Update a post (author or admin)
export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { caption, subject } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const isAuthor = post.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to edit this post." });
    }

    if (caption) {
      const safetyCheck = await checkTextSafetyAI(caption);
      if (!safetyCheck.isValid) {
        return res.status(400).json({ message: safetyCheck.reason });
      }
      post.caption = caption;
    }

    if (subject) {
      post.subject = subject;
    }

    await post.save();
    const updatedPost = await Post.findById(id)
      .populate("user", "fullName email profilePic role")
      .populate("comments.user", "fullName email profilePic");

    res.status(200).json({
      success: true,
      message: "Post updated successfully!",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Failed to update post." });
  }
}

// Toggle saving/bookmarking a post for the authenticated user
export async function toggleSavePost(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found or has been deleted." });
    }

    if (!user.savedPosts) {
      user.savedPosts = [];
    }

    const isSaved = user.savedPosts.some(
      (savedId) => savedId.toString() === id.toString()
    );

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(
        (savedId) => savedId.toString() !== id.toString()
      );
    } else {
      user.savedPosts.push(id);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isSaved: !isSaved,
      savedPosts: user.savedPosts,
      message: !isSaved
        ? "Post bookmarked to your saved collection!"
        : "Post removed from your saved collection.",
    });
  } catch (error) {
    console.error("Error toggling save post:", error);
    res.status(500).json({ message: "Failed to save post." });
  }
}

// Fetch all posts saved by the authenticated user
export async function getSavedPosts(req, res) {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedPosts",
      populate: [
        { path: "user", select: "fullName email profilePic role" },
        { path: "comments.user", select: "fullName email profilePic" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Filter out null/deleted post references and reverse so recent saves appear first
    const posts = (user.savedPosts || []).filter(Boolean).reverse();

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ message: "Failed to fetch saved posts." });
  }
}

