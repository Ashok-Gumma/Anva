import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  getPostById,
  createPost,
  toggleLikePost,
  addCommentPost,
  deleteCommentPost,
  deletePost,
  updatePost,
  toggleSavePost,
} from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { checkCaptionSafety, checkFileSafety } from "../lib/contentModerator";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Image as ImageIcon,
  Heart,
  MessageSquare,
  Trash2,
  Pencil,
  Send,
  Sparkles,
  BookOpen,
  X,
  Clock,
  Maximize2,
  FileText,
  Bookmark,
  BookmarkCheck,
  Download,
  Eye,
  PlusCircle,
  Users,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router";

const CommunityFeedSection = ({ title = "Community Feed", subtitle = "Recent posts and study notes from learners" }) => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [pdfPreview, setPdfPreview] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);
  const [loadingMediaPostId, setLoadingMediaPostId] = useState(null);

  // Edit Post States
  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");

  const COMMON_EMOJIS = [
    "😊","😂","🔥","❤️","👍","🎉","🤔","😍","🙌","💡",
    "✨","🚀","👏","😎","🤩","💪","🙏","😅","🥳","💯",
    "📚","🧠","💻","⭐","🎯","✅","❌","🤝","😢","👀",
  ];

  // Lazy-load high-res image on click
  const handleViewImage = async (post) => {
    if (post.image) {
      setLightboxImage(post.image);
      return;
    }
    setLoadingMediaPostId(post._id);
    try {
      const full = await getPostById(post._id);
      if (full?.image) {
        setLightboxImage(full.image);
      }
    } catch {
      toast.error("Failed to load image");
    } finally {
      setLoadingMediaPostId(null);
    }
  };

  // Lazy-load PDF on click
  const handleViewPdf = async (post) => {
    if (post.pdfUrl) {
      setActivePdfModal({ url: post.pdfUrl, name: post.pdfFileName || "Shared Document.pdf" });
      return;
    }
    setLoadingMediaPostId(post._id);
    try {
      const full = await getPostById(post._id);
      if (full?.pdfUrl) {
        setActivePdfModal({ url: full.pdfUrl, name: full.pdfFileName || "Shared Document.pdf" });
      }
    } catch {
      toast.error("Failed to load PDF");
    } finally {
      setLoadingMediaPostId(null);
    }
  };

  // Fetch community feed posts
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts("All"),
    refetchInterval: 15_000,
  });

  const posts = data?.posts || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setCaption("");
      setImagePreview("");
      setPdfPreview("");
      setPdfFileName("");
      toast.success("Post published!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to publish post.");
    },
  });

  const likeMutation = useMutation({
    mutationFn: toggleLikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      const updatePostLikes = (oldData) => {
        const postList = Array.isArray(oldData) ? oldData : oldData?.posts;
        if (!Array.isArray(postList)) return oldData;

        const updated = postList.map((post) => {
          if (post._id === postId) {
            const userIdStr = authUser?._id?.toString();
            const currentLikes = post.likes || [];
            const isLiked = currentLikes.some(
              (id) => (id?._id || id)?.toString() === userIdStr
            );
            const updatedLikes = isLiked
              ? currentLikes.filter((id) => (id?._id || id)?.toString() !== userIdStr)
              : [...currentLikes, authUser._id];
            return { ...post, likes: updatedLikes };
          }
          return post;
        });

        return Array.isArray(oldData) ? updated : { ...oldData, posts: updated };
      };

      queryClient.setQueriesData({ queryKey: ["posts"] }, updatePostLikes);
      queryClient.setQueriesData({ queryKey: ["myPosts"] }, updatePostLikes);
      queryClient.setQueriesData({ queryKey: ["savedPosts"] }, updatePostLikes);

      return { previousPosts };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error("Failed to update like.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: toggleSavePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: addCommentPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setCommentText("");
      toast.success("Comment added!");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted.");
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, data: postData }) => updatePost(postId, postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setEditingPost(null);
      toast.success("Post updated!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update post.");
    },
  });

  // Media File Handlers
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!checkFileSafety(file)) {
      toast.error("Unsafe file detected.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF document.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDF size must be under 10MB.");
      return;
    }
    setPdfFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setPdfPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim() && !imagePreview && !pdfPreview) {
      toast.error("Post content cannot be empty.");
      return;
    }
    if (!checkCaptionSafety(caption)) {
      toast.error("Content violates community guidelines.");
      return;
    }
    createMutation.mutate({
      caption,
      image: imagePreview,
      pdfUrl: pdfPreview,
    });
  };

  const handleCommentSubmit = (postId) => {
    if (!commentText.trim()) return;
    if (!checkCaptionSafety(commentText)) {
      toast.error("Comment contains restricted words.");
      return;
    }
    commentMutation.mutate({ postId, text: commentText });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-base-100 p-6 rounded-[2rem] border border-base-content/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
            <MessageCircle className="size-5" />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-base-content leading-tight">
              {title}
            </h2>
            <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider block">
              {subtitle}
            </span>
          </div>
        </div>

        <Link
          to="/feed"
          className="btn btn-primary btn-xs font-black uppercase tracking-widest text-[9px] px-4 shadow-md rounded-lg h-8 hover:scale-105 transition-transform shrink-0 self-start sm:self-auto"
        >
          View All Posts ({posts.length})
        </Link>
      </div>

      {/* CREATE POST CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 p-5 sm:p-6 rounded-[2rem] border border-base-content/10 shadow-lg space-y-4 relative z-10"
      >
        <div className="flex items-center gap-3">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt={authUser?.fullName}
            className="size-10 rounded-xl object-cover border border-base-content/10 shadow-sm"
          />
          <div>
            <h3 className="font-bold text-sm text-base-content flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-primary" /> Create New Post
            </h3>
            <p className="text-[11px] text-base-content/50 font-medium">
              Share a thought or study note as <strong className="text-base-content">{authUser?.fullName}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateSubmit} className="space-y-3.5">
          <textarea
            rows={3}
            placeholder="What's on your mind? Share an update, question, or document..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-3 bg-base-200/50 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-base-content/40"
            required
          />

          {/* Media Previews */}
          <div className="space-y-3">
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-200 max-h-60">
                <img src={imagePreview} alt="Upload preview" className="w-full h-full object-cover max-h-60" />
                <button
                  type="button"
                  onClick={() => setImagePreview("")}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-error transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {pdfPreview && (
              <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-secondary text-secondary-content rounded-xl shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-base-content truncate">{pdfFileName || "Document.pdf"}</p>
                    <span className="text-[10px] text-secondary font-semibold uppercase">Ready for sharing</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setPdfPreview(""); setPdfFileName(""); }}
                  className="p-1.5 text-base-content/60 hover:text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3.5 py-2 bg-base-200/50 hover:bg-base-200 border border-base-content/10 rounded-xl text-xs font-bold text-base-content cursor-pointer transition-all">
                <ImageIcon className="w-4 h-4 text-primary shrink-0" />
                <span>{imagePreview ? "Change Image" : "Add Image"}</span>
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </label>

              <label className="flex items-center gap-1.5 px-3.5 py-2 bg-base-200/50 hover:bg-base-200 border border-base-content/10 rounded-xl text-xs font-bold text-base-content cursor-pointer transition-all">
                <FileText className="w-4 h-4 text-secondary shrink-0" />
                <span>{pdfFileName ? "Change PDF" : "Add PDF"}</span>
                <input type="file" accept="application/pdf" onChange={handlePdfFileChange} className="hidden" />
              </label>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs uppercase px-5 cursor-pointer shadow-md ml-auto"
            >
              {createMutation.isPending ? "Publishing..." : <><Send className="w-3.5 h-3.5" /> Publish</>}
            </button>
          </div>
        </form>
      </motion.div>

      {/* FEED POSTS LIST */}
      <div className="space-y-5">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-semibold text-base-content/50 animate-pulse bg-base-100 rounded-[2rem] border border-base-content/10">
            Loading community feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-base-100 p-12 rounded-[2rem] border border-base-content/10 text-center space-y-3 shadow-sm">
            <BookOpen className="w-12 h-12 text-base-content/30 mx-auto" />
            <h3 className="font-bold text-lg text-base-content">No Posts Yet</h3>
            <p className="text-xs text-base-content/60 font-medium max-w-sm mx-auto">
              Be the first to share an update with the community!
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const isOwner =
              (post.user?._id || post.user)?.toString() === authUser?._id?.toString() ||
              authUser?.role === "admin";

            const isLiked = post.likes?.some(
              (id) => (id?._id || id)?.toString() === authUser?._id?.toString()
            );

            const isSaved = authUser?.savedPosts?.some(
              (id) => (id?._id || id)?.toString() === post._id?.toString()
            );

            const showComments = activeCommentPostId === post._id;

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 p-5 sm:p-6 rounded-[2rem] border border-base-content/10 shadow-lg space-y-4"
              >
                {/* Author Bar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Link to={`/user/${post.user?._id}`}>
                      <img
                        src={post.user?.profilePic || "/avatar.png"}
                        alt={post.user?.fullName}
                        className="size-11 rounded-2xl object-cover border border-base-content/10 shadow-sm hover:scale-105 transition-transform"
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/user/${post.user?._id}`}
                        className="font-bold text-sm text-base-content hover:text-primary transition-colors block"
                      >
                        {post.user?.fullName || "Community Member"}
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] text-base-content/40 font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Bookmark Button */}
                    <button
                      onClick={() => saveMutation.mutate(post._id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isSaved
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-base-200/50 text-base-content/50 border-base-content/10 hover:text-amber-500"
                      }`}
                      title={isSaved ? "Saved to Bookmarks" : "Save Post"}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    {/* Owner controls */}
                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setEditCaption(post.caption);
                          }}
                          className="p-2 text-base-content/50 hover:text-primary hover:bg-base-200 rounded-xl transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePostMutation.mutate(post._id)}
                          className="p-2 text-base-content/50 hover:text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Caption or Inline Edit Box */}
                {editingPost?._id === post._id ? (
                  <div className="space-y-2 p-3 bg-base-200/60 rounded-2xl border border-primary/20">
                    <textarea
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full p-3 rounded-xl bg-base-100 text-xs sm:text-sm focus:outline-primary border border-base-content/10 font-medium resize-none"
                      rows={3}
                      placeholder="Edit your post caption..."
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setEditingPost(null)}
                        className="btn btn-ghost btn-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!editCaption.trim()) {
                            toast.error("Caption cannot be empty.");
                            return;
                          }
                          updatePostMutation.mutate({ postId: post._id, data: { caption: editCaption } });
                        }}
                        disabled={updatePostMutation.isPending}
                        className="btn btn-primary btn-xs font-bold"
                      >
                        {updatePostMutation.isPending ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-base-content/80 font-medium leading-relaxed whitespace-pre-wrap">
                    {post.caption}
                  </p>
                )}

                {/* Image Media Preview */}
                {(post.image || post.hasImage) && (
                  <div className="relative rounded-2xl overflow-hidden border border-base-content/10 max-h-96 bg-base-200 group">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt="Post media"
                        className="w-full h-full object-cover max-h-96 cursor-pointer group-hover:scale-102 transition-transform duration-300"
                        onClick={() => handleViewImage(post)}
                      />
                    ) : (
                      <div
                        onClick={() => handleViewImage(post)}
                        className="p-8 text-center cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-base-300/50 transition-colors"
                      >
                        {loadingMediaPostId === post._id ? (
                          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Maximize2 className="w-6 h-6 text-primary" />
                            <span className="text-xs font-bold text-base-content/70">Click to load image</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* PDF Document Preview */}
                {(post.pdfUrl || post.hasPdf) && (
                  <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 bg-secondary text-secondary-content rounded-xl shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-base-content truncate">{post.pdfFileName || "Shared Document.pdf"}</p>
                        <span className="text-[10px] text-secondary font-semibold uppercase">PDF Study Guide</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewPdf(post)}
                      className="px-3 py-1.5 bg-secondary text-secondary-content rounded-xl text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                    >
                      {loadingMediaPostId === post._id ? (
                        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> View PDF
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Footer Reactions & Comment toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-base-content/5">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button
                      onClick={() => likeMutation.mutate(post._id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        isLiked ? "text-error" : "text-base-content/60 hover:text-error"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    {/* Comments toggle button */}
                    <button
                      onClick={() => setActiveCommentPostId(showComments ? null : post._id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-base-content/60 hover:text-primary transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section Drawer */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 space-y-3 border-t border-base-content/10"
                    >
                      {/* Comments List */}
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {post.comments?.length === 0 ? (
                          <p className="text-[11px] text-base-content/40 font-medium text-center py-2">
                            No comments yet. Start the conversation!
                          </p>
                        ) : (
                          post.comments?.map((c) => (
                            <div key={c._id} className="p-3 bg-base-200/50 rounded-2xl flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2.5 min-w-0">
                                <img
                                  src={c.user?.profilePic || "/avatar.png"}
                                  alt={c.user?.fullName}
                                  className="size-7 rounded-xl object-cover shrink-0 mt-0.5"
                                />
                                <div className="min-w-0">
                                  <span className="text-xs font-bold text-base-content block truncate">
                                    {c.user?.fullName || "Learner"}
                                  </span>
                                  <p className="text-xs text-base-content/80 font-medium leading-normal whitespace-pre-wrap">
                                    {c.text}
                                  </p>
                                </div>
                              </div>
                              {((c.user?._id || c.user)?.toString() === authUser?._id?.toString() || authUser?.role === "admin") && (
                                <button
                                  onClick={() => deleteCommentMutation.mutate({ postId: post._id, commentId: c._id })}
                                  className="text-base-content/30 hover:text-error transition-colors p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(post._id)}
                          className="flex-1 px-4 py-2 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={() => handleCommentSubmit(post._id)}
                          disabled={commentMutation.isPending}
                          className="btn btn-primary btn-xs rounded-xl font-bold px-3 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <img src={lightboxImage} alt="Expanded view" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Modal */}
      <AnimatePresence>
        {activePdfModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-base-100 w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-base-content/10">
              <div className="p-4 bg-base-200 border-b border-base-content/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  <span className="font-bold text-sm text-base-content truncate">
                    {activePdfModal.pdfFileName || "Document.pdf"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={activePdfModal.pdfUrl}
                    download={activePdfModal.pdfFileName || "Document.pdf"}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-xs rounded-xl font-bold gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  <button onClick={() => setActivePdfModal(null)} className="p-1.5 hover:bg-base-300 rounded-xl cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <iframe src={activePdfModal.pdfUrl} className="w-full flex-1 border-none" title="PDF Document Viewer" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityFeedSection;
