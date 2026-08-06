import Post from "../models/Post.js";

// Fetch all posts with populated user & comments
export async function getPosts(req, res) {
  try {
    const { subject } = req.query;
    const query = subject && subject !== "All" ? { subject } : {};

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "fullName email profilePic role")
      .populate("comments.user", "fullName email profilePic");

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts." });
  }
}

// Create a new educational post
export async function createPost(req, res) {
  try {
    const { caption, image, subject } = req.body;

    if (!caption || !caption.trim()) {
      return res.status(400).json({ message: "Post caption is required." });
    }

    const post = await Post.create({
      user: req.user._id,
      caption,
      image: image || "",
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
