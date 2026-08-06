import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  createPost,
  toggleLikePost,
  addCommentPost,
  deletePost,
} from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Image as ImageIcon,
  Heart,
  MessageSquare,
  Trash2,
  Send,
  Sparkles,
  BookOpen,
  X,
  Upload,
  Clock,
  Filter,
  Maximize2,
  Code,
  Brain,
  Atom,
  Languages,
} from "lucide-react";

const SUBJECTS = [
  "All",
  "Computer Science",
  "Mathematics",
  "Languages",
  "Science",
  "Study Tips",
  "General",
];

const EduFeedPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [selectedSubject, setSelectedSubject] = useState("All");
  const [caption, setCaption] = useState("");
  const [subject, setSubject] = useState("General");
  const [imagePreview, setImagePreview] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);

  // Fetch educational feed posts
  const { data, isLoading } = useQuery({
    queryKey: ["posts", selectedSubject],
    queryFn: () => getPosts(selectedSubject),
  });

  const posts = data?.posts || [];

  // Create post mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Educational post published!");
      setCaption("");
      setImagePreview("");
      setSubject("General");
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

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: addCommentPost,
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to post comment.");
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

  // Handle Image File Upload -> Base64
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim()) {
      toast.error("Please enter a caption or description for your post.");
      return;
    }

    createMutation.mutate({
      caption,
      image: imagePreview,
      subject,
    });
  };

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;
    commentMutation.mutate({ id: postId, text: commentText });
  };

  const getSubjectBadgeColor = (subj) => {
    switch (subj) {
      case "Computer Science":
        return "bg-primary/10 text-primary border-primary/20";
      case "Mathematics":
        return "bg-info/10 text-info border-info/20";
      case "Languages":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Science":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Study Tips":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-base-200 text-base-content/70 border-base-content/10";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 font-minimal selection:bg-primary selection:text-primary-content">
      {/* ── HEADER BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-content/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-minimal"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <BookOpen className="w-4 h-4" /> EduFeed & Study Community
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            Educational <span className="font-curly italic text-primary font-bold tracking-wide">Community Feed</span>
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 font-medium">
            Share study notes, educational diagrams, problem-solving code snippets, and learning resources with your peers.
          </p>
        </div>

        <div className="px-4 py-2.5 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-2 shrink-0">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-bold text-primary">{posts.length} Study Posts</span>
        </div>
      </motion.div>

      {/* ── CREATE POST CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4 font-minimal"
      >
        <div className="flex items-center gap-3">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt={authUser?.fullName}
            className="size-10 rounded-2xl object-cover border border-base-content/10 shadow-sm"
          />
          <div>
            <h3 className="font-curly text-xl font-bold text-base-content">
              Share Educational Content
            </h3>
            <p className="text-[11px] text-base-content/60 font-medium">
              Posting as <strong className="text-base-content">{authUser?.fullName}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Subject Category
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {SUBJECTS.filter((s) => s !== "All").map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Upload Study Image / Diagram
              </label>
              <label className="flex items-center gap-2 px-3.5 py-2 bg-base-200 hover:bg-base-300 border border-base-content/10 rounded-2xl text-xs font-bold text-base-content cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-primary" />
                <span>{imagePreview ? "Change Image" : "Choose Image File..."}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Write an educational tip, question, problem explanation, or study notes..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:font-normal"
            required
          />

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

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-base-content/50 font-medium">
              💡 Tip: High-quality study diagrams get more community upvotes!
            </span>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn btn-primary btn-sm rounded-2xl font-bold gap-2 text-xs uppercase px-6 cursor-pointer shadow-md"
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

      {/* ── SUBJECT FILTER BAR ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-minimal">
        <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {SUBJECTS.map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedSubject === subj
                ? "bg-primary text-primary-content shadow-sm"
                : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* ── FEED POSTS LIST ── */}
      <div className="space-y-5 font-minimal">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-semibold text-base-content/50 animate-pulse">
            Loading educational feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-base-100 p-12 rounded-3xl border border-base-content/10 text-center space-y-3 shadow-sm font-minimal">
            <BookOpen className="w-12 h-12 text-base-content/30 mx-auto" />
            <h3 className="font-curly text-3xl font-bold text-base-content">No Posts Found</h3>
            <p className="text-xs text-base-content/60 font-medium">
              Be the first to share an educational image or study note in this subject!
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const isLiked = post.likes?.some(
              (id) => (id?._id || id)?.toString() === authUser?._id?.toString()
            );
            const isAuthor = post.user?._id === authUser?._id;
            const isAdmin = authUser?.role === "admin";
            const showComments = activeCommentPostId === post._id;

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4 font-minimal"
              >
                {/* Header: Author & Subject */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.user?.profilePic || "/avatar.png"}
                      alt={post.user?.fullName}
                      className="size-11 rounded-2xl object-cover border border-base-content/10 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-base-content">
                          {post.user?.fullName}
                        </h4>
                        {post.user?.role === "admin" && (
                          <span className="badge badge-primary text-[9px] font-extrabold uppercase py-0.5">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-base-content/50 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getSubjectBadgeColor(
                        post.subject
                      )}`}
                    >
                      {post.subject}
                    </span>

                    {(isAuthor || isAdmin) && (
                      <button
                        onClick={() => {
                          if (window.confirm("Delete this educational post?")) {
                            deleteMutation.mutate(post._id);
                          }
                        }}
                        className="btn btn-ghost btn-xs text-error rounded-xl cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Caption Content */}
                <p className="text-xs sm:text-sm text-base-content/90 font-medium whitespace-pre-line leading-relaxed">
                  {post.caption}
                </p>

                {/* Educational Image (if present) */}
                {post.image && (
                  <div
                    onClick={() => setLightboxImage(post.image)}
                    className="relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-200 cursor-pointer group max-h-96"
                  >
                    <img
                      src={post.image}
                      alt="Study Content"
                      className="w-full h-full object-cover max-h-96 group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs">
                      <Maximize2 className="w-5 h-5" /> Click to Enlarge
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-base-content/10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => likeMutation.mutate(post._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isLiked
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
                      onClick={() =>
                        setActiveCommentPostId(showComments ? null : post._id)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-base-200/70 hover:bg-base-200 text-base-content/70 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-base-content/50 font-semibold">
                    {post.likes?.length || 0} Upvotes
                  </span>
                </div>

                {/* ── COMMENTS DRAWER ── */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-base-content/10 space-y-3 font-minimal"
                    >
                      {/* Comments Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Write a constructive study comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post._id);
                          }}
                          className="flex-1 px-4 py-2 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={() => handleAddComment(post._id)}
                          disabled={commentMutation.isPending}
                          className="btn btn-primary btn-sm rounded-xl font-bold cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Comment List */}
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {post.comments?.length === 0 ? (
                          <div className="text-[11px] text-base-content/50 italic text-center py-2">
                            No comments yet. Start the conversation!
                          </div>
                        ) : (
                          post.comments?.map((comment, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-base-200/60 rounded-2xl border border-base-content/5 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={comment.user?.profilePic || "/avatar.png"}
                                    alt={comment.user?.fullName}
                                    className="size-5 rounded-full object-cover"
                                  />
                                  <span className="font-bold text-base-content">
                                    {comment.user?.fullName}
                                  </span>
                                </div>
                                <span className="text-[10px] text-base-content/40">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-base-content/80 font-medium pl-7">
                                {comment.text}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── LIGHTBOX FULL-SCREEN MODAL ── */}
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
                alt="Enlarged Study Image"
                className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl border border-white/20"
              />
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-error transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EduFeedPage;
