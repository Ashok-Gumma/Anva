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
  Smile,
} from "lucide-react";

const EduFeedPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [pdfPreview, setPdfPreview] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [emojiPickerPostId, setEmojiPickerPostId] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);
  const [loadingMediaPostId, setLoadingMediaPostId] = useState(null);

  const COMMON_EMOJIS = [
    "😊","😂","🔥","❤️","👍","🎉","🤔","😍","🙌","💡",
    "✨","🚀","👏","😎","🤩","💪","🙏","😅","🥳","💯",
    "📚","🧠","💻","⭐","🎯","✅","❌","🤝","😢","👀",
  ];

  // Fetch full post (with image/pdfUrl) on demand when user clicks
  const handleViewImage = async (post) => {
    if (post.image) { setLightboxImage(post.image); return; }
    setLoadingMediaPostId(post._id);
    try {
      const { post: full } = await getPostById(post._id);
      setLightboxImage(full.image);
    } catch { /* silent */ } finally {
      setLoadingMediaPostId(null);
    }
  };

  const handleViewPdf = async (post) => {
    if (post.pdfUrl) { setActivePdfModal(post); return; }
    setLoadingMediaPostId(post._id);
    try {
      const { post: full } = await getPostById(post._id);
      setActivePdfModal(full);
    } catch { /* silent */ } finally {
      setLoadingMediaPostId(null);
    }
  };

  // Edit Post States
  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editSubject, setEditSubject] = useState("General");

  // Fetch community feed posts
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts("All"),
  });

  const posts = data?.posts || [];

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post published successfully!");
      setCaption("");
      setImagePreview("");
      setPdfPreview("");
      setPdfFileName("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to publish post.");
    },
  });

  // Toggle like mutation
  const likeMutation = useMutation({
    mutationFn: toggleLikePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Toggle save post mutation
  const saveMutation = useMutation({
    mutationFn: toggleSavePost,
    onSuccess: (resData) => {
      toast.success(resData.message || "Bookmark updated.");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save post.");
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: addCommentPost,
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentPost,
    onSuccess: () => {
      toast.success("Comment deleted.");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete comment.");
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted.");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Update post mutation
  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      toast.success("Post updated successfully!");
      setEditingPost(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update post.");
    },
  });

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setEditCaption(post.caption || "");
    setEditSubject(post.subject || "General");
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editCaption.trim()) {
      toast.error("Caption cannot be empty.");
      return;
    }
    const safetyCheck = checkCaptionSafety(editCaption);
    if (!safetyCheck.isValid) {
      toast.error(safetyCheck.reason);
      return;
    }
    updateMutation.mutate({
      id: editingPost._id,
      caption: editCaption,
      subject: editSubject,
    });
  };

  // Handle Image File Upload -> Base64 with Content Safety Pre-check
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant Client Safety Inspector
    const safetyCheck = checkFileSafety(file);
    if (!safetyCheck.isValid) {
      toast.error(safetyCheck.reason);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle PDF File Upload -> Base64 with Content Safety Pre-check
  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Instant Client Safety Inspector
    const safetyCheck = checkFileSafety(file);
    if (!safetyCheck.isValid) {
      toast.error(safetyCheck.reason);
      return;
    }

    setPdfFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPdfPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      toast.error("Please enter a caption for your post.");
      return;
    }

    // ── Instant Client Content Moderation Check ──
    const captionCheck = checkCaptionSafety(caption);
    if (!captionCheck.isValid) {
      toast.error(captionCheck.reason);
      return;
    }

    createMutation.mutate({
      caption,
      image: imagePreview,
      pdfUrl: pdfPreview,
      pdfName: pdfFileName,
      subject: "General",
    });
  };

  const handleAddComment = (postId) => {
    if (!commentText.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    const commentCheck = checkCaptionSafety(commentText);
    if (!commentCheck.isValid) {
      toast.error(commentCheck.reason);
      return;
    }

    setCommentError("");
    setEmojiPickerPostId(null);
    commentMutation.mutate({ id: postId, text: commentText });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-minimal selection:bg-primary selection:text-primary-content">
      {/* ── HEADER BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-content/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-minimal relative z-10"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <BookOpen className="w-4 h-4" /> Anva Community Feed
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Community <span className="font-curly italic text-primary font-bold tracking-wide">Feed</span>
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 font-medium">
            Share updates, images, study notes, and PDF documents with your peers.
          </p>
        </div>
      </motion.div>

      {/* ── CREATE POST CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4 font-minimal relative z-10"
      >
        <div className="flex items-center gap-3">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt={authUser?.fullName}
            className="size-10 rounded-2xl object-cover border border-base-content/10 shadow-sm"
          />
          <div>
            <h3 className="font-curly text-xl font-bold text-base-content flex items-center gap-1.5">
              <PlusCircle className="w-5 h-5 text-primary" /> Create New Post
            </h3>
            <p className="text-[11px] text-base-content/60 font-medium">
              Posting as <strong className="text-base-content">{authUser?.fullName}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <textarea
            rows={3}
            placeholder="What's on your mind? Share an update, note, or document..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:font-normal"
            required
          />

          {/* Media Attachments Preview Boxes */}
          <div className="space-y-3">
            {/* Image Preview Box */}
            {imagePreview && (
              <div className="relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-200 max-h-60 group">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-full object-cover max-h-60"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview("")}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-error transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PDF File Preview Box */}
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
                  onClick={() => {
                    setPdfPreview("");
                    setPdfFileName("");
                  }}
                  className="p-1.5 text-base-content/60 hover:text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Image Selector */}
              <label className="flex items-center gap-1.5 px-3.5 py-2 bg-base-200 hover:bg-base-300 border border-base-content/10 rounded-xl text-xs font-bold text-base-content cursor-pointer transition-all">
                <ImageIcon className="w-4 h-4 text-primary shrink-0" />
                <span>{imagePreview ? "Change Image" : "Add Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {/* PDF File Selector */}
              <label className="flex items-center gap-1.5 px-3.5 py-2 bg-base-200 hover:bg-base-300 border border-base-content/10 rounded-xl text-xs font-bold text-base-content cursor-pointer transition-all">
                <FileText className="w-4 h-4 text-secondary shrink-0" />
                <span>{pdfFileName ? "Change PDF" : "Add PDF"}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary btn-sm rounded-2xl font-bold gap-2 text-xs uppercase px-6 cursor-pointer shadow-md ml-auto"
            >
              {createMutation.isPending ? (
                "Publishing..."
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── FEED POSTS LIST ── */}
      <div className="space-y-5 font-minimal relative z-10">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-semibold text-base-content/50 animate-pulse">
            Loading feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-base-100 p-12 rounded-3xl border border-base-content/10 text-center space-y-3 shadow-sm font-minimal relative z-10">
            <BookOpen className="w-12 h-12 text-base-content/30 mx-auto" />
            <h3 className="font-curly text-3xl font-bold text-base-content">
              No Posts Yet
            </h3>
            <p className="text-xs text-base-content/60 font-medium max-w-sm mx-auto">
              Be the first to share a post with the community!
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4 relative z-10"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.user?.profilePic || "/avatar.png"}
                      alt={post.user?.fullName}
                      className="size-10 rounded-2xl object-cover border border-base-content/10"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-base-content flex items-center gap-1.5">
                        {post.user?.fullName}
                      </h4>
                      <span className="text-[10px] text-base-content/50 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Bookmark Toggle Button */}
                    <button
                      onClick={() => saveMutation.mutate(post._id)}
                      className={`btn btn-ghost btn-xs rounded-xl cursor-pointer ${isSaved ? "text-primary fill-primary/20" : "text-base-content/50 hover:text-primary"
                        }`}
                      title={isSaved ? "Remove Bookmark" : "Save Post"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    {/* Edit Post Button */}
                    {isOwner && (
                      <button
                        onClick={() => handleOpenEditModal(post)}
                        className="btn btn-ghost btn-xs text-primary hover:bg-primary/10 rounded-xl cursor-pointer"
                        title="Edit Post"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Post Button */}
                    {isOwner && (
                      <button
                        onClick={() => deleteMutation.mutate(post._id)}
                        disabled={deleteMutation.isPending}
                        className="btn btn-ghost btn-xs text-error hover:bg-error/10 rounded-xl cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Caption */}
                <p className="text-xs sm:text-sm text-base-content/90 font-medium whitespace-pre-line leading-relaxed">
                  {post.caption}
                </p>

                {/* Image Attachment */}
                {(post.image || post.hasImage) && (
                  <div
                    onClick={() => handleViewImage(post)}
                    className="relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-200 cursor-pointer group max-h-80"
                  >
                    {post.image ? (
                      <img
                        src={post.image}
                        alt="Content"
                        className="w-full h-full object-cover max-h-80 group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-24 text-base-content/40 gap-2 text-xs font-semibold">
                        {loadingMediaPostId === post._id ? (
                          <span className="loading loading-spinner loading-sm" />
                        ) : (
                          <><ImageIcon className="w-5 h-5" /> Click to load image</>
                        )}
                      </div>
                    )}
                    {post.image && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs">
                        <Maximize2 className="w-5 h-5" /> Enlarge Image
                      </div>
                    )}
                  </div>
                )}

                {/* PDF Attachment */}
                {(post.pdfUrl || post.hasPdf) && (
                  <div className="p-3.5 bg-base-200/80 border border-base-content/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-6 h-6 text-secondary shrink-0" />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-base-content truncate">
                          {post.pdfName || "Document.pdf"}
                        </h5>
                        <span className="text-[10px] text-base-content/60 font-medium">PDF Document</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewPdf(post)}
                        disabled={loadingMediaPostId === post._id}
                        className="px-3 py-1.5 bg-secondary text-secondary-content rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
                      >
                        {loadingMediaPostId === post._id ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                        View PDF
                      </button>
                      {post.pdfUrl && (
                        <a
                          href={post.pdfUrl}
                          download={post.pdfName || "Document.pdf"}
                          className="px-3 py-1.5 bg-base-100 hover:bg-base-300 text-base-content rounded-xl text-xs font-bold border border-base-content/10 flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-base-content/10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => likeMutation.mutate(post._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isLiked
                          ? "bg-error/10 text-error border border-error/20"
                          : "bg-base-200/70 text-base-content/70 hover:bg-base-200"
                        }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-error text-error" : ""}`}
                      />
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveCommentPostId(showComments ? null : post._id);
                        setCommentText("");
                        setCommentError("");
                        setEmojiPickerPostId(null);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-base-200/70 hover:bg-base-200 text-base-content/70 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </button>
                  </div>
                </div>

                {/* Comments Drawer */}
                <AnimatePresence>
                  {showComments && (
                    <div className="pt-3 border-t border-base-content/10 space-y-3">
                      {/* Comment Input Row */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 relative">
                          {/* Emoji Picker Button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setEmojiPickerPostId(
                                  emojiPickerPostId === post._id ? null : post._id
                                )
                              }
                              className="p-2 rounded-xl text-base-content/50 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                              title="Add emoji"
                            >
                              <Smile className="w-4 h-4" />
                            </button>

                            {/* Emoji Popover */}
                            <AnimatePresence>
                              {emojiPickerPostId === post._id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute bottom-full left-0 mb-2 z-50 bg-base-100 border border-base-content/10 rounded-2xl shadow-xl p-2 w-56"
                                >
                                  <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wide px-1 pb-1.5">Pick an emoji</p>
                                  <div className="grid grid-cols-6 gap-0.5">
                                    {COMMON_EMOJIS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => {
                                          setCommentText((prev) => prev + emoji);
                                          setCommentError("");
                                          setEmojiPickerPostId(null);
                                        }}
                                        className="text-lg p-1.5 rounded-xl hover:bg-base-200 transition-colors cursor-pointer leading-none"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Comment Input */}
                          <input
                            type="text"
                            placeholder="Write a comment..." 
                            value={commentText}
                            onChange={(e) => {
                              setCommentText(e.target.value);
                              if (e.target.value.trim()) setCommentError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddComment(post._id);
                              if (e.key === "Escape") setEmojiPickerPostId(null);
                            }}
                            onFocus={() => setEmojiPickerPostId(null)}
                            className={`flex-1 px-3.5 py-2 bg-base-200 text-base-content border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
                              commentError
                                ? "border-error/50 focus:ring-error/40"
                                : "border-base-content/10"
                            }`}
                          />

                          {/* Send Button */}
                          <button
                            onClick={() => handleAddComment(post._id)}
                            disabled={commentMutation.isPending}
                            className="btn btn-primary btn-sm rounded-xl shrink-0"
                            title="Send comment"
                          >
                            {commentMutation.isPending ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {/* Required Error */}
                        {commentError && activeCommentPostId === post._id && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] text-error font-semibold flex items-center gap-1 pl-1"
                          >
                            <span>⚠</span> {commentError}
                          </motion.p>
                        )}
                      </div>

                      {/* Existing Comments List */}
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {post.comments?.length === 0 && (
                          <p className="text-[10px] text-base-content/40 text-center py-2 font-medium">No comments yet. Be the first!</p>
                        )}
                        {post.comments?.map((c) => {
                          const isCommentAuthor = c.user?._id === authUser?._id;
                          const isPostOwner = post.user?._id === authUser?._id;
                          const canDelete = isCommentAuthor || isPostOwner;

                          return (
                            <div key={c._id || c.text} className="group p-3 bg-base-200/60 rounded-xl text-xs space-y-0.5">
                              <div className="flex items-start gap-1.5">
                                {/* Avatar */}
                                <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 overflow-hidden">
                                  {c.user?.profilePic ? (
                                    <img src={c.user.profilePic} alt={c.user.fullName} className="size-full object-cover" />
                                  ) : (
                                    <span>{c.user?.fullName?.charAt(0)?.toUpperCase()}</span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-base-content">{c.user?.fullName}</span>
                                    {isCommentAuthor && (
                                      <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-wide">You</span>
                                    )}
                                    {c.createdAt && (
                                      <span className="text-[9px] text-base-content/40 font-medium ml-auto">
                                        {new Date(c.createdAt).toLocaleDateString()}
                                      </span>
                                    )}

                                    {/* Delete Button — visible to comment author or post owner */}
                                    {canDelete && (
                                      <button
                                        onClick={() =>
                                          deleteCommentMutation.mutate({
                                            postId: post._id,
                                            commentId: c._id,
                                          })
                                        }
                                        disabled={deleteCommentMutation.isPending}
                                        className="ml-auto p-1 rounded-lg text-base-content/30 hover:text-error hover:bg-error/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                                        title="Delete comment"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-base-content/80 font-medium break-words mt-0.5">{c.text}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Lightbox Image Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
            >
              <img
                src={lightboxImage}
                alt="Enlarged Content Image"
                className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl border border-white/20"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-error transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── EDIT POST MODAL ── */}
      <AnimatePresence>
        {editingPost && (
          <div
            onClick={() => setEditingPost(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-base-100 w-full max-w-lg rounded-3xl border border-base-content/10 shadow-2xl overflow-hidden font-minimal"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 bg-base-200/60">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <h3 className="font-curly text-xl font-bold text-base-content">Edit Post</h3>
                </div>
                <button
                  onClick={() => setEditingPost(null)}
                  className="p-1.5 rounded-xl text-base-content/50 hover:text-base-content hover:bg-base-300 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                {/* Caption */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-base-content/70 uppercase tracking-wide">
                    Caption
                  </label>
                  <textarea
                    rows={4}
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Update your post caption..."
                    className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-base-content/40"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="btn btn-ghost btn-sm rounded-2xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="btn btn-primary btn-sm rounded-2xl font-bold gap-2 text-xs uppercase px-6 cursor-pointer shadow-md"
                  >
                    {updateMutation.isPending ? (
                      "Saving..."
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Modal Viewer */}
      <AnimatePresence>
        {activePdfModal && (
          <div
            onClick={() => setActivePdfModal(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-base-100 w-full max-w-4xl h-[85vh] rounded-3xl border border-base-content/10 shadow-2xl flex flex-col overflow-hidden relative z-50 font-minimal"
            >
              <div className="p-4 bg-base-200/80 border-b border-base-content/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-secondary text-secondary-content rounded-xl shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-base-content truncate">
                      {activePdfModal.pdfName || "PDF Document"}
                    </h4>
                    <span className="text-[10px] text-base-content/60 font-medium">
                      Attached by {activePdfModal.user?.fullName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activePdfModal.pdfUrl}
                    download={activePdfModal.pdfName || "Document.pdf"}
                    className="btn btn-secondary btn-xs rounded-xl font-bold gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  <button
                    onClick={() => setActivePdfModal(null)}
                    className="p-1.5 bg-base-300 hover:bg-error hover:text-white text-base-content rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-slate-900 overflow-hidden">
                <iframe
                  src={activePdfModal.pdfUrl}
                  title={activePdfModal.pdfName || "PDF Viewer"}
                  className="w-full h-full border-none"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EduFeedPage;
