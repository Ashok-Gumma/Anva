import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfile,
  getSavedPosts,
  getUserPosts,
  toggleSavePost,
  toggleLikePost,
  addCommentPost,
  updateCommentPost,
  deleteCommentPost,
  deletePost,
} from "../lib/api";
import { getLanguageIcon } from "../components/FriendCard";
import { capitalize } from "../lib/utils";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import {
  CameraIcon,
  SaveIcon,
  ShieldCheck,
  Bookmark,
  User,
  Heart,
  MessageSquare,
  Clock,
  FileText,
  Download,
  Eye,
  X,
  Maximize2,
  Send,
  Github,
  Linkedin,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Layers,
  Trash2,
  Pencil,
  Check,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useLogout from "../hooks/useLogout";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const { logoutMutation, isPending: isLoggingOut } = useLogout();

  // Active Tab State: "details" | "saved"
  const [activeTab, setActiveTab] = useState("details");

  // Profile Avatar & Cover Image States
  const [previewImage, setPreviewImage] = useState(authUser?.profilePic || "");
  const [base64Image, setBase64Image] = useState(null);

  const [previewBanner, setPreviewBanner] = useState(
    authUser?.bannerPic || localStorage.getItem("anva_bannerPic") || ""
  );
  const [base64Banner, setBase64Banner] = useState(null);

  const [githubUrl, setGithubUrl] = useState(authUser?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(authUser?.linkedinUrl || "");

  // Sync state with authUser when user data finishes loading or re-fetching
  useEffect(() => {
    if (authUser?.profilePic) {
      setPreviewImage(authUser.profilePic);
    }
    if (authUser?.bannerPic) {
      setPreviewBanner(authUser.bannerPic);
      localStorage.setItem("anva_bannerPic", authUser.bannerPic);
    }
    if (authUser?.githubUrl) {
      setGithubUrl(authUser.githubUrl);
    }
    if (authUser?.linkedinUrl) {
      setLinkedinUrl(authUser.linkedinUrl);
    }
  }, [authUser?.profilePic, authUser?.bannerPic, authUser?.githubUrl, authUser?.linkedinUrl]);

  // Saved Posts Interactive States
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);

  // Query for saved posts
  const { data: savedData, isLoading: isLoadingSaved } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
  });

  const savedPosts = savedData?.posts || [];

  // Query for user's own published posts
  const { data: myPostsData, isLoading: isLoadingMyPosts } = useQuery({
    queryKey: ["myPosts", authUser?._id],
    queryFn: () => getUserPosts(authUser?._id),
    enabled: activeTab === "posts" && !!authUser?._id,
  });

  const myPosts = myPostsData?.posts || [];

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete post.");
    },
  });

  // Mutation for updating profile
  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["authUser"], { user: updatedUser });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Profile & Banner updated successfully!");
      setBase64Image(null);
      setBase64Banner(null);

      if (updatedUser?.bannerPic) {
        setPreviewBanner(updatedUser.bannerPic);
        localStorage.setItem("anva_bannerPic", updatedUser.bannerPic);
      }
      if (updatedUser?.profilePic) {
        setPreviewImage(updatedUser.profilePic);
      }
    },
    onError: () => {
      toast.error("Failed to update profile.");
    },
  });

  // Toggle save post mutation with optimistic & dynamic cache updates
  const saveMutation = useMutation({
    mutationFn: toggleSavePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["authUser"] });
      const previousAuthData = queryClient.getQueryData(["authUser"]);

      if (previousAuthData?.user) {
        const currentSaved = previousAuthData.user.savedPosts || [];
        const isCurrentlySaved = currentSaved.some(
          (id) => (id?._id || id)?.toString() === postId?.toString()
        );

        const newSaved = isCurrentlySaved
          ? currentSaved.filter((id) => (id?._id || id)?.toString() !== postId?.toString())
          : [...currentSaved, postId];

        queryClient.setQueryData(["authUser"], {
          ...previousAuthData,
          user: {
            ...previousAuthData.user,
            savedPosts: newSaved,
          },
        });
      }

      return { previousAuthData };
    },
    onSuccess: (resData) => {
      toast.success(resData.message || "Bookmark updated.");
      if (resData?.savedPosts) {
        queryClient.setQueryData(["authUser"], (oldData) => {
          if (!oldData?.user) return oldData;
          return {
            ...oldData,
            user: {
              ...oldData.user,
              savedPosts: resData.savedPosts,
            },
          };
        });
      }
    },
    onError: (err, postId, context) => {
      if (context?.previousAuthData) {
        queryClient.setQueryData(["authUser"], context.previousAuthData);
      }
      toast.error(err.response?.data?.message || "Failed to save post.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  // Toggle like mutation with instant optimistic update
  const likeMutation = useMutation({
    mutationFn: toggleLikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const updatePostLikes = (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map((post) => {
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
      };
      queryClient.setQueriesData({ queryKey: ["posts"] }, updatePostLikes);
      queryClient.setQueriesData({ queryKey: ["myPosts"] }, updatePostLikes);
      queryClient.setQueriesData({ queryKey: ["savedPosts"] }, updatePostLikes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  // Add comment mutation with instant optimistic update
  const commentMutation = useMutation({
    mutationFn: addCommentPost,
    onMutate: async ({ postId, text }) => {
      setCommentText("");
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const tempComment = {
        _id: `temp-${Date.now()}`,
        user: {
          _id: authUser._id,
          fullName: authUser.fullName,
          profilePic: authUser.profilePic,
        },
        text,
        createdAt: new Date().toISOString(),
      };
      const updatePostComments = (oldPosts) => {
        if (!Array.isArray(oldPosts)) return oldPosts;
        return oldPosts.map((post) => {
          if (post._id === postId) {
            return { ...post, comments: [...(post.comments || []), tempComment] };
          }
          return post;
        });
      };
      queryClient.setQueriesData({ queryKey: ["posts"] }, updatePostComments);
      queryClient.setQueriesData({ queryKey: ["myPosts"] }, updatePostComments);
      queryClient.setQueriesData({ queryKey: ["savedPosts"] }, updatePostComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  // Edit & Delete comment state and mutations
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const updateCommentMutation = useMutation({
    mutationFn: updateCommentPost,
    onSuccess: () => {
      toast.success("Comment updated!");
      setEditingCommentId(null);
      setEditingCommentText("");
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update comment.");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentPost,
    onSuccess: () => {
      toast.success("Comment deleted.");
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete comment.");
    },
  });

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return;
    commentMutation.mutate({ id: postId, text: commentText });
  };

  // Avatar Image Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setBase64Image(reader.result);
      };
    } catch (error) {
      console.error("Avatar compression error:", error);
      toast.error("Failed to process profile avatar.");
    }
  };

  // Cover Banner Photo Upload (Ultra-Compact Compression for fast saving & persistence)
  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file for the cover banner.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setPreviewBanner(reader.result);
        setBase64Banner(reader.result);
        localStorage.setItem("anva_bannerPic", reader.result);
      };
    } catch (error) {
      console.error("Banner compression error:", error);
      toast.error("Failed to process cover banner photo.");
    }
  };

  const handleSave = () => {
    const payload = {
      githubUrl: githubUrl || "",
      linkedinUrl: linkedinUrl || "",
    };
    if (base64Image) payload.profilePic = base64Image;
    if (base64Banner) payload.bannerPic = base64Banner;

    updateProfileMutation(payload);
  };

  // Dynamic & Smart Completeness Calculation
  const completenessScore = useMemo(() => {
    let score = 0;
    const hasAvatar = authUser?.profilePic || previewImage;
    const hasBanner = authUser?.bannerPic || previewBanner || localStorage.getItem("anva_bannerPic");
    const hasNative = authUser?.nativeLanguage;
    const hasLearning = authUser?.learningLanguage;
    const hasLocation = authUser?.location;
    const hasGithub = authUser?.githubUrl || githubUrl;
    const hasLinkedin = authUser?.linkedinUrl || linkedinUrl;

    if (hasAvatar) score += 25;
    if (hasBanner) score += 20;
    if (hasNative) score += 20;
    if (hasLearning) score += 20;
    if (hasLocation) score += 15;

    // Bonus fallback for social links
    if (score < 100 && (hasGithub || hasLinkedin)) {
      score = Math.min(100, score + 10);
    }

    return Math.min(100, score);
  }, [authUser, previewImage, previewBanner, githubUrl, linkedinUrl]);

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

  const currentBanner = previewBanner || authUser?.bannerPic || localStorage.getItem("anva_bannerPic") || "";
  const currentAvatar = previewImage || authUser?.profilePic || "";

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 lg:p-8 space-y-6 font-minimal selection:bg-primary selection:text-primary-content">
      {/* ── 1. PERFECTLY ALIGNED HERO HEADER CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-xl overflow-hidden relative"
      >
        {/* Layer A: Cover Banner Area */}
        <div className="h-40 sm:h-52 w-full bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 relative overflow-hidden">
          {currentBanner ? (
            <img
              src={currentBanner}
              alt="Cover Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/25 via-secondary/15 to-transparent" />
          )}

          {/* Change Banner Button */}
          <label
            htmlFor="cover-banner-input"
            className="absolute top-4 right-4 px-3.5 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all z-20 border border-white/20"
          >
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            <span>{currentBanner ? "Change Cover" : "Add Cover"}</span>
          </label>
          <input
            type="file"
            id="cover-banner-input"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />
        </div>

        {/* Layer B: Avatar Overlap Container */}
        <div className="px-6 sm:px-8 -mt-14 sm:-mt-16 relative z-20 flex items-end justify-between">
          <div className="relative size-28 sm:size-32 rounded-3xl p-1 bg-gradient-to-tr from-primary via-secondary to-accent shadow-2xl border-4 border-base-100 group shrink-0">
            <div className="size-full rounded-[1.2rem] bg-base-100 text-base-content flex items-center justify-center font-black text-3xl overflow-hidden relative">
              <span className="absolute inset-0 flex items-center justify-center font-black text-primary">
                {authUser?.fullName?.charAt(0).toUpperCase()}
              </span>

              {currentAvatar && (
                <img
                  src={currentAvatar}
                  alt={authUser?.fullName}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              )}

              <label
                htmlFor="profile-avatar-input"
                className="absolute inset-0 z-20 bg-black/60 text-white flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
              >
                <CameraIcon className="size-6 mb-0.5" />
                <span className="text-[9px] font-extrabold uppercase tracking-wider">Change</span>
              </label>
              <input
                type="file"
                id="profile-avatar-input"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Banner Progress Pill Badge & Sign Out */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-xs font-extrabold text-primary flex items-center gap-1.5 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" /> Profile {completenessScore}% Complete
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to sign out?")) {
                  logoutMutation();
                }
              }}
              disabled={isLoggingOut}
              className="px-3.5 py-1.5 bg-error/10 hover:bg-error/20 border border-error/20 rounded-xl text-xs font-bold text-error flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>

        {/* Layer C: User Information & Language Flags Bar */}
        <div className="px-6 sm:px-8 pt-4 pb-6 space-y-4 relative z-10">
          {/* User Name & Email */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                {authUser?.fullName}
              </h1>
              <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10 shrink-0" />
              {authUser?.role === "admin" && (
                <span className="badge badge-primary text-[9px] font-extrabold uppercase py-0.5 shrink-0">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-base-content/60 font-medium">
              {authUser?.email}
            </p>
          </div>

          {/* Clean Horizontal Language Flag & Stat Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {authUser?.nativeLanguage && (
              <div className="px-3 py-1.5 bg-base-200/80 border border-base-content/10 rounded-xl text-xs font-bold text-base-content flex items-center gap-1.5">
                {getLanguageIcon(authUser.nativeLanguage)}
                <span>Native: <strong>{capitalize(authUser.nativeLanguage)}</strong></span>
              </div>
            )}

            {authUser?.learningLanguage && (
              <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary flex items-center gap-1.5">
                {getLanguageIcon(authUser.learningLanguage)}
                <span>Learning: <strong>{capitalize(authUser.learningLanguage)}</strong></span>
              </div>
            )}

            {authUser?.location && (
              <div className="px-3 py-1.5 bg-base-200/80 border border-base-content/10 rounded-xl text-xs font-bold text-base-content/70 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" /> {authUser.location}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── 2. ELEGANT 3-TAB CONTROLLER ── */}
      <div className="flex items-center justify-center p-1.5 bg-base-100 rounded-2xl border border-base-content/10 shadow-sm gap-1 font-minimal max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "details"
              ? "bg-primary text-primary-content shadow-md"
              : "text-base-content/70 hover:bg-base-200"
            }`}
        >
          <User className="w-4 h-4" /> Account Details
        </button>

        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "posts"
              ? "bg-primary text-primary-content shadow-md"
              : "text-base-content/70 hover:bg-base-200"
            }`}
        >
          <FileText className="w-4 h-4" /> My Posts ({myPosts.length})
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeTab === "saved"
              ? "bg-primary text-primary-content shadow-md"
              : "text-base-content/70 hover:bg-base-200"
            }`}
        >
          <Bookmark className="w-4 h-4" /> Saved ({savedPosts.length})
        </button>
      </div>

      {/* ── 3. TAB 1: ACCOUNT DETAILS ── */}
      {activeTab === "details" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-xl mx-auto font-minimal"
        >
          {/* Overview Info Card */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-base-content uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium">
              <div className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1">
                <span className="text-[10px] font-bold text-base-content/50 uppercase">Full Name</span>
                <p className="font-bold text-sm text-base-content">{authUser?.fullName}</p>
              </div>

              <div className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1">
                <span className="text-[10px] font-bold text-base-content/50 uppercase">Email Address</span>
                <p className="font-bold text-sm text-base-content truncate">{authUser?.email}</p>
              </div>

              <div className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1">
                <span className="text-[10px] font-bold text-base-content/50 uppercase">Location</span>
                <p className="font-bold text-sm text-base-content">{authUser?.location || "Not Set"}</p>
              </div>

              <div className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1">
                <span className="text-[10px] font-bold text-base-content/50 uppercase">Languages</span>
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary font-bold rounded-lg border border-secondary/20 flex items-center gap-1 text-[11px]">
                    {getLanguageIcon(authUser?.nativeLanguage)} Native: {capitalize(authUser?.nativeLanguage || "Not Set")}
                  </span>
                  <span className="px-2 py-0.5 bg-accent/10 text-accent font-bold rounded-lg border border-accent/20 flex items-center gap-1 text-[11px]">
                    {getLanguageIcon(authUser?.learningLanguage)} Target: {capitalize(authUser?.learningLanguage || "Not Set")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Form */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-base-content uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-secondary" /> Social Links
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-base-content/70 flex items-center gap-1.5 ml-1">
                  <Github className="w-3.5 h-3.5 text-base-content/80" /> GitHub Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-base-content/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-base-content/70 flex items-center gap-1.5 ml-1">
                  <Linkedin className="w-3.5 h-3.5 text-info" /> LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-base-content/40"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full btn btn-primary rounded-2xl font-bold gap-2 text-xs uppercase shadow-md cursor-pointer mt-1"
            >
              {isPending ? (
                "Saving Changes..."
              ) : (
                <>
                  <SaveIcon className="w-4 h-4" /> Save Profile Changes
                </>
              )}
            </button>
          </div>

          {/* Account & Security Card */}
          <div className="bg-base-100 p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base-content text-sm">Account & Security</h3>
              </div>
              <Link
                to="/blocked-users"
                className="px-3 py-1.5 text-xs font-semibold text-error bg-error/10 hover:bg-error/20 rounded-xl transition-colors"
              >
                Blocked Users
              </Link>
            </div>
            <p className="text-xs text-base-content/60 font-medium leading-relaxed">
              Authentication and security settings are safely synchronized via Clerk Account Management.
            </p>
            <div className="pt-2 border-t border-base-content/5 flex items-center justify-between gap-3">
              <div className="text-xs font-medium text-base-content/70">
                Sign out of this device
              </div>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to sign out?")) {
                    logoutMutation();
                  }
                }}
                disabled={isLoggingOut}
                className="px-4 py-2 bg-error/10 hover:bg-error text-error hover:text-error-content rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 4. TAB 2: MY POSTS ── */}
      {activeTab === "posts" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 max-w-2xl mx-auto font-minimal"
        >
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
              My Published Posts
            </span>
            <span className="badge badge-primary text-[10px] font-bold">
              {myPosts.length} Posts Published
            </span>
          </div>

          {isLoadingMyPosts ? (
            <div className="p-12 text-center text-xs font-semibold text-base-content/50 animate-pulse">
              Loading your published posts...
            </div>
          ) : myPosts.length === 0 ? (
            <div className="bg-base-100 p-12 rounded-3xl border border-base-content/10 text-center space-y-3 shadow-sm">
              <FileText className="w-12 h-12 text-base-content/30 mx-auto" />
              <h4 className="font-curly text-3xl font-bold text-base-content">No Posts Published Yet</h4>
              <p className="text-xs text-base-content/60 font-medium max-w-sm mx-auto">
                Share your first study notes, questions, images, or PDF documents on EduFeed!
              </p>
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 btn btn-primary btn-sm rounded-2xl font-bold text-xs uppercase px-6 cursor-pointer shadow-md mt-2"
              >
                Create First Post
              </Link>
            </div>
          ) : (
            myPosts.map((post) => {
              const isLiked = post.likes?.some(
                (id) => (id?._id || id)?.toString() === authUser?._id?.toString()
              );
              const showComments = activeCommentPostId === post._id;

              return (
                <div
                  key={post._id}
                  className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={authUser?.profilePic || "/avatar.png"}
                        alt={authUser?.fullName}
                        className="size-10 rounded-2xl object-cover border border-base-content/10"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-base-content">
                          {authUser?.fullName}
                        </h4>
                        <span className="text-[10px] text-base-content/50 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
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
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this post?")) {
                            deleteMutation.mutate(post._id);
                          }
                        }}
                        className="btn btn-ghost btn-xs text-error rounded-xl cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Post Caption */}
                  <p className="text-xs sm:text-sm text-base-content/90 font-medium whitespace-pre-line leading-relaxed">
                    {post.caption}
                  </p>

                  {/* Image Attachment */}
                  {post.image && (
                    <div
                      onClick={() => setLightboxImage(post.image)}
                      className="relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-200 cursor-pointer group max-h-80"
                    >
                      <img
                        src={post.image}
                        alt="Study Content"
                        className="w-full h-full object-cover max-h-80 group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs">
                        <Maximize2 className="w-5 h-5" /> Enlarge Image
                      </div>
                    </div>
                  )}

                  {/* PDF Attachment */}
                  {post.pdfUrl && (
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
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => setActivePdfModal(post)}
                          className="btn btn-secondary btn-xs font-bold gap-1 rounded-xl text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" /> Read PDF
                        </button>
                        <a
                          href={post.pdfUrl}
                          download={post.pdfName || "Document.pdf"}
                          className="btn btn-ghost btn-xs font-bold gap-1 rounded-xl text-[11px]"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Post Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-base-content/10 text-xs font-bold">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => likeMutation.mutate(post._id)}
                        className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-error" : "text-base-content/60 hover:text-error"
                          }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "fill-error" : ""}`} />
                        <span>{post.likes?.length || 0}</span>
                      </button>

                      <button
                        onClick={() =>
                          setActiveCommentPostId(showComments ? null : post._id)
                        }
                        className="flex items-center gap-1.5 text-base-content/60 hover:text-primary transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </motion.div>
      )}

      {/* ── 5. TAB 3: SAVED BOOKMARKS ── */}
      {activeTab === "saved" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 max-w-2xl mx-auto font-minimal"
        >
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
              Saved Collection
            </span>
            <span className="badge badge-primary text-[10px] font-bold">
              {savedPosts.length} Items Saved
            </span>
          </div>

          {isLoadingSaved ? (
            <div className="p-12 text-center text-xs font-semibold text-base-content/50 animate-pulse">
              Loading your saved bookmarks...
            </div>
          ) : savedPosts.length === 0 ? (
            <div className="bg-base-100 p-12 rounded-3xl border border-base-content/10 text-center space-y-3 shadow-sm">
              <Bookmark className="w-12 h-12 text-base-content/30 mx-auto" />
              <h4 className="font-curly text-3xl font-bold text-base-content">No Saved Posts Yet</h4>
              <p className="text-xs text-base-content/60 font-medium max-w-sm mx-auto">
                Click the bookmark icon on any post in EduFeed to save study notes, diagrams, and PDFs here!
              </p>
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 btn btn-primary btn-sm rounded-2xl font-bold text-xs uppercase px-6 cursor-pointer shadow-md mt-2"
              >
                Browse EduFeed
              </Link>
            </div>
          ) : (
            savedPosts.map((post) => {
              const isLiked = post.likes?.some(
                (id) => (id?._id || id)?.toString() === authUser?._id?.toString()
              );
              const showComments = activeCommentPostId === post._id;

              return (
                <div
                  key={post._id}
                  className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4"
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
                        <h4 className="font-bold text-sm text-base-content">
                          {post.user?.fullName}
                        </h4>
                        <span className="text-[10px] text-base-content/50 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
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

                  {/* Caption */}
                  <p className="text-xs sm:text-sm text-base-content/90 font-medium whitespace-pre-line leading-relaxed">
                    {post.caption}
                  </p>

                  {/* Image Attachment */}
                  {post.image && (
                    <div
                      onClick={() => setLightboxImage(post.image)}
                      className="relative rounded-2xl overflow-hidden border border-base-content/10 bg-base-200 cursor-pointer group max-h-80"
                    >
                      <img
                        src={post.image}
                        alt="Study Content"
                        className="w-full h-full object-cover max-h-80 group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-bold text-xs">
                        <Maximize2 className="w-5 h-5" /> Enlarge Image
                      </div>
                    </div>
                  )}

                  {/* PDF Attachment */}
                  {post.pdfUrl && (
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
                          onClick={() => setActivePdfModal(post)}
                          className="px-3 py-1.5 bg-secondary text-secondary-content rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" /> View PDF
                        </button>
                        <a
                          href={post.pdfUrl}
                          download={post.pdfName || "Document.pdf"}
                          className="px-3 py-1.5 bg-base-100 hover:bg-base-300 text-base-content rounded-xl text-xs font-bold border border-base-content/10 flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
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
                      Bookmarked Post
                    </span>
                  </div>

                  {/* Comments Drawer */}
                  <AnimatePresence>
                    {showComments && (
                      <div className="pt-3 border-t border-base-content/10 space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddComment(post._id);
                            }}
                            className="flex-1 px-3.5 py-2 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs"
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            disabled={commentMutation.isPending}
                            className="btn btn-primary btn-sm rounded-xl"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {post.comments?.map((c, i) => {
                            const isCommentAuthor = (c.user?._id || c.user)?.toString() === authUser?._id?.toString();
                            const isPostOwner = (post.user?._id || post.user)?.toString() === authUser?._id?.toString();
                            const canDelete = isCommentAuthor || isPostOwner;
                            const isEditingThisComment = editingCommentId === c._id;

                            return (
                              <div key={c._id || i} className="group p-3 bg-base-200/60 rounded-xl text-xs space-y-0.5">
                                <div className="flex items-start gap-1.5">
                                  <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 overflow-hidden">
                                    {c.user?.profilePic ? (
                                      <img src={c.user.profilePic} alt={c.user.fullName} className="size-full object-cover" />
                                    ) : (
                                      <span>{c.user?.fullName?.charAt(0)?.toUpperCase() || "U"}</span>
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

                                      <div className="flex items-center gap-1 ml-auto">
                                        {isCommentAuthor && !isEditingThisComment && (
                                          <button
                                            onClick={() => {
                                              setEditingCommentId(c._id);
                                              setEditingCommentText(c.text);
                                            }}
                                            className="p-1 rounded-lg text-base-content/40 hover:text-primary hover:bg-primary/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                                            title="Edit comment"
                                          >
                                            <Pencil className="w-3 h-3" />
                                          </button>
                                        )}

                                        {canDelete && !isEditingThisComment && (
                                          <button
                                            onClick={() =>
                                              deleteCommentMutation.mutate({
                                                postId: post._id,
                                                commentId: c._id,
                                              })
                                            }
                                            disabled={deleteCommentMutation.isPending}
                                            className="p-1 rounded-lg text-base-content/30 hover:text-error hover:bg-error/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
                                            title="Delete comment"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {isEditingThisComment ? (
                                      <div className="flex items-center gap-1.5 mt-1.5">
                                        <input
                                          type="text"
                                          value={editingCommentText}
                                          onChange={(e) => setEditingCommentText(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              if (!editingCommentText.trim()) return;
                                              updateCommentMutation.mutate({
                                                postId: post._id,
                                                commentId: c._id,
                                                text: editingCommentText,
                                              });
                                            } else if (e.key === "Escape") {
                                              setEditingCommentId(null);
                                            }
                                          }}
                                          className="flex-1 px-2.5 py-1 bg-base-100 text-base-content border border-primary/40 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                                          autoFocus
                                        />
                                        <button
                                          onClick={() => {
                                            if (!editingCommentText.trim()) return;
                                            updateCommentMutation.mutate({
                                              postId: post._id,
                                              commentId: c._id,
                                              text: editingCommentText,
                                            });
                                          }}
                                          disabled={updateCommentMutation.isPending}
                                          className="p-1 rounded-lg bg-primary text-primary-content hover:bg-primary/90 transition-all cursor-pointer"
                                          title="Save comment"
                                        >
                                          <Check className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => setEditingCommentId(null)}
                                          className="p-1 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-200 transition-all cursor-pointer"
                                          title="Cancel"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <p className="text-base-content/80 font-medium break-words mt-0.5">{c.text}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </motion.div>
      )}

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

export default ProfilePage;
