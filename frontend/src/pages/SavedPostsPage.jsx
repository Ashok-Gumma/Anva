import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSavedPosts, toggleSavePost, toggleLikePost, addCommentPost } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Bookmark,
  BookmarkCheck,
  Heart,
  MessageSquare,
  Clock,
  FileText,
  Download,
  Eye,
  BookOpen,
  ArrowLeft,
  X,
  Maximize2,
  Send,
} from "lucide-react";

const SavedPostsPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);

  // Fetch saved posts
  const { data, isLoading } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
  });

  const posts = data?.posts || [];

  // Toggle save mutation
  const saveMutation = useMutation({
    mutationFn: toggleSavePost,
    onSuccess: (resData) => {
      toast.success(resData.message || "Saved collection updated.");
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update bookmark.");
    },
  });

  // Toggle like mutation
  const likeMutation = useMutation({
    mutationFn: toggleLikePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: addCommentPost,
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

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
        className="bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-content/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-minimal relative z-10"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline uppercase tracking-wider mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight flex items-center gap-3">
            Saved <span className="font-curly italic text-primary font-bold tracking-wide">Bookmarks</span>
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 font-medium">
            Your personal collection of saved educational posts, study diagrams, and attached PDF notes.
          </p>
        </div>

        <div className="px-4 py-2.5 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-2 shrink-0">
          <BookmarkCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary">{posts.length} Saved Posts</span>
        </div>
      </motion.div>

      {/* ── SAVED POSTS LIST ── */}
      <div className="space-y-5 font-minimal relative z-10">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-semibold text-base-content/50 animate-pulse">
            Loading your saved collection...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-base-100 p-12 rounded-3xl border border-base-content/10 text-center space-y-4 shadow-sm font-minimal relative z-10">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="font-curly text-3xl font-bold text-base-content">No Saved Posts Yet</h3>
            <p className="text-xs text-base-content/60 font-medium max-w-md mx-auto">
              Whenever you see a helpful study note, diagram, or PDF in EduFeed, click the bookmark icon to save it here for quick access!
            </p>
            <Link
              to="/edu-feed"
              className="inline-flex items-center gap-2 btn btn-primary btn-sm rounded-2xl font-bold text-xs uppercase px-6 cursor-pointer shadow-md mt-2"
            >
              <BookOpen className="w-4 h-4" /> Explore EduFeed
            </Link>
          </div>
        ) : (
          posts.map((post) => {
            const isLiked = post.likes?.some(
              (id) => (id?._id || id)?.toString() === authUser?._id?.toString()
            );
            const showComments = activeCommentPostId === post._id;

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4 font-minimal relative z-10"
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

                    <button
                      onClick={() => saveMutation.mutate(post._id)}
                      className="btn btn-ghost btn-xs text-error rounded-xl cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Caption Content */}
                <p className="text-xs sm:text-sm text-base-content/90 font-medium whitespace-pre-line leading-relaxed">
                  {post.caption}
                </p>

                {/* Image Attachment */}
                {post.image && (
                  <div
                    onClick={() => setLightboxImage(post.image)}
                    className="relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-200 cursor-pointer group max-h-96"
                  >
                    <img
                      src={post.image}
                      alt="Saved Study Content"
                      className="w-full h-full object-cover max-h-96 group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs">
                      <Maximize2 className="w-5 h-5" /> Click to Enlarge
                    </div>
                  </div>
                )}

                {/* PDF File Attachment Card */}
                {post.pdfUrl && (
                  <div className="p-4 bg-base-200/80 border border-base-content/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 bg-secondary/15 text-secondary rounded-xl shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-base-content truncate">
                          {post.pdfName || "Study Document.pdf"}
                        </h5>
                        <p className="text-[10px] text-base-content/60 font-medium">
                          PDF Document Attachment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setActivePdfModal(post)}
                        className="px-3 py-1.5 bg-secondary text-secondary-content rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> View PDF
                      </button>

                      <a
                        href={post.pdfUrl}
                        download={post.pdfName || "Study_Notes.pdf"}
                        className="px-3 py-1.5 bg-base-100 hover:bg-base-300 text-base-content border border-base-content/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-base-content/10">
                  <div className="flex items-center gap-2 sm:gap-3">
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

                    <button
                      onClick={() => saveMutation.mutate(post._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <BookmarkCheck className="w-4 h-4 fill-primary/20" />
                      <span>Saved</span>
                    </button>
                  </div>
                </div>

                {/* Comments Drawer */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-base-content/10 space-y-3 font-minimal"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Write a constructive comment..."
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

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {post.comments?.length === 0 ? (
                          <div className="text-[11px] text-base-content/50 italic text-center py-2">
                            No comments yet.
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
                alt="Enlarged Study Image"
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

export default SavedPostsPage;
