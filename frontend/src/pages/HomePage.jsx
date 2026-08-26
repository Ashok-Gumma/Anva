import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  getStreamToken,
} from "../lib/api";
import { StreamChat } from "stream-chat";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useNavigate } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  SearchIcon,
  Brain,
  BrainCircuit,
  Terminal,
  BookOpen,
  Flame,
  Zap,
  Undo2,
  Image as ImageIcon,
  User,
  Sparkles,
  Check,
  Target,
  Quote,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { capitalize } from "../lib/utils";
import FriendCard from "../components/FriendCard";
import { getLanguageIcon } from "../lib/languageUtils";
import NoFriendsFound from "../components/NoFriendsFound";
import { motion } from "framer-motion";
import ProgressDashboard from "../components/ProgressDashboard";
import SkeletonCard from "../components/SkeletonCard";
import { MOTIVATIONAL_QUOTES } from "../lib/quotes";
import CommunityFeedSection from "../components/CommunityFeedSection";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const HomePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Random Motivational Quote ── */
  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }, []);

  const { quoteText, quoteAuthor } = useMemo(() => {
    const parts = (dailyQuote || "").split(" – ");
    return {
      quoteText: parts[0] || dailyQuote,
      quoteAuthor: parts[1] || "Daily Inspiration",
    };
  }, [dailyQuote]);

  /* ── Notifications popup ── */
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  /* ── Real-time StreamChat message listener on Homepage ── */
  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
    let isSubscribed = true;

    const connectAndListen = async () => {
      try {
        if (client.userID !== authUser._id) {
          if (client.userID) await client.disconnectUser();
          await client.connectUser({ id: authUser._id, name: authUser.fullName }, tokenData.token);
        }

        const handleMessageNew = (event) => {
          if (!isSubscribed) return;
          if (event.message?.user?.id === authUser._id) return;

          const senderName = event.message?.user?.name || "A peer";
          const snippet = event.message?.text || "Sent a message";
          const senderId = event.message?.user?.id;

          toast(
            (t) => (
              <div
                className="flex flex-col gap-1 cursor-pointer select-none"
                onClick={() => {
                  toast.dismiss(t.id);
                  if (senderId) navigate(`/chat/${senderId}`);
                }}
              >
                <div className="font-extrabold text-xs text-primary flex items-center gap-1">
                  💬 New message from {senderName}
                </div>
                <p className="text-xs font-medium text-base-content/90 line-clamp-2">{snippet}</p>
              </div>
            ),
            { duration: 6000 }
          );

          queryClient.invalidateQueries({ queryKey: ["streamChannels"] });
          queryClient.invalidateQueries({ queryKey: ["streamUnreadCount"] });
        };

        client.on("message.new", handleMessageNew);

        return () => {
          client.off("message.new", handleMessageNew);
        };
      } catch (err) {
        console.error("Stream notification listener error:", err);
      }
    };

    connectAndListen();

    return () => {
      isSubscribed = false;
    };
  }, [tokenData, authUser, navigate, queryClient]);

  useEffect(() => {
    if (!authUser) return;
    const hasShownPopups = sessionStorage.getItem("hasShownHomePagePopups");
    if (hasShownPopups === "true") return;
    if (friendRequests === undefined || tokenData === undefined) return;

    const showPopups = async () => {
      const incomingReqs = friendRequests?.incomingReqs?.filter((req) => req?.sender) || [];
      if (incomingReqs.length > 0) {
        toast(`You have ${incomingReqs.length} pending friend request${incomingReqs.length > 1 ? "s" : ""}!`, {
          icon: "👋",
          duration: 6000,
        });
      }
      if (tokenData?.token) {
        try {
          const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
          if (client.userID !== authUser._id) {
            if (client.userID) await client.disconnectUser();
            await client.connectUser({ id: authUser._id, name: authUser.fullName }, tokenData.token);
          }
          const unreadCount = client.user?.total_unread_count || 0;
          if (unreadCount > 0) {
            setTimeout(() => {
              toast(`You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}!`, {
                icon: "💬",
                duration: 6000,
              });
            }, 800);
          }
        } catch (err) {
          console.error("Failed to fetch unread stream messages:", err);
        }
      }
      sessionStorage.setItem("hasShownHomePagePopups", "true");
    };
    showPopups();
  }, [friendRequests, tokenData, authUser]);

  /* ── Friends ── */
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  /* ── Recommended Users ── */
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    enabled: !!authUser,
  });

  /* ── Outgoing Requests ── */
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    enabled: !!authUser,
  });

  /* ── Derived ── */
  const outgoingRequestsIds = useMemo(() => {
    const ids = new Set();
    outgoingFriendReqs.forEach((req) => {
      if (req?.recipient?._id) ids.add(req.recipient._id);
    });
    return ids;
  }, [outgoingFriendReqs]);

  /* ── Filtered recommended users ── */
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return recommendedUsers;
    const q = searchQuery.toLowerCase();
    return recommendedUsers.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.nativeLanguage?.toLowerCase().includes(q) ||
        u.learningLanguage?.toLowerCase().includes(q) ||
        u.location?.toLowerCase().includes(q)
    );
  }, [recommendedUsers, searchQuery]);

  /* ── Friend Request Mutation ── */
  const [loadingIds, setLoadingIds] = useState(new Set());

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.setQueryData(["outgoingFriendReqs"], (old = []) => [
        ...old,
        { recipient: { _id: userId } },
      ]);
    },
    onError: (err, userId) => {
      setLoadingIds((prev) => { const n = new Set(prev); n.delete(userId); return n; });
      toast.error(err.response?.data?.message || "Failed to send friend request");
    },
    onSuccess: (data, userId) => {
      setLoadingIds((prev) => { const n = new Set(prev); n.delete(userId); return n; });
      toast.success("Friend request sent 🚀");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleSendRequest = (userId) => {
    if (loadingIds.has(userId)) return;
    setLoadingIds((prev) => new Set(prev).add(userId));
    sendRequestMutation(userId);
  };

  const { mutate: cancelRequestMutation } = useMutation({
    mutationFn: cancelFriendRequest,
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.setQueryData(["outgoingFriendReqs"], (old = []) =>
        old.filter((req) => req?.recipient?._id !== userId)
      );
    },
    onError: (err, userId) => {
      setLoadingIds((prev) => { const n = new Set(prev); n.delete(userId); return n; });
      toast.error(err.response?.data?.message || "Failed to unsend request");
    },
    onSuccess: (data, userId) => {
      setLoadingIds((prev) => { const n = new Set(prev); n.delete(userId); return n; });
      toast.success("Request unsent ↩️");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleCancelRequest = (userId) => {
    if (loadingIds.has(userId)) return;
    setLoadingIds((prev) => new Set(prev).add(userId));
    cancelRequestMutation(userId);
  };

  if (!authUser) return null;

  return (
    <div className="p-3 sm:p-6 lg:p-8 bg-base-200 min-h-[calc(100dvh-4rem)] text-base-content font-sans">
      <motion.div
        className="container mx-auto max-w-[1400px] px-2 sm:px-4 py-4 sm:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-min"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ── 1. HERO TILE (Spans 3 cols) ── */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 lg:col-span-3 relative bg-base-100 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-base-content/10 overflow-hidden flex flex-col justify-between shadow-lg text-base-content group h-full min-h-[280px]"
        >
          {/* Subtle Modern Ambient Lighting & Glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-primary/10 blur-[70px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 rounded-full bg-secondary/10 blur-[60px] pointer-events-none" />
          
          {/* Top Section with Greeting and 3D Visual */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary backdrop-blur-md">
                <BrainCircuit className="size-3.5" />
                Intelligence Hub
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight text-base-content">
                Welcome back,<br/>
                <span className="font-curly font-bold italic text-primary text-4xl sm:text-5xl">{authUser.fullName?.split(" ")[0]}! 👋</span>
              </h1>
              <p className="text-sm text-base-content/70 leading-relaxed font-medium">
                Your compiler is hot. Let&apos;s write code and <span className="font-curly font-bold italic text-secondary text-base">connect with peers</span> today!
              </p>
            </div>

            {/* 💬 Daily Motivational Quote Card on Top Right */}
            <div className="hidden sm:flex flex-col justify-between relative shrink-0 max-w-xs lg:max-w-sm p-4 sm:p-5 rounded-2xl bg-base-200/60 border border-base-content/10 shadow-xs backdrop-blur-md hover:border-primary/30 transition-all duration-300 group/quote">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="size-3.5" />
                  Daily Inspiration
                </div>
                <Quote className="size-4 text-base-content/30 group-hover/quote:text-primary transition-colors" />
              </div>
              <p className="text-xs sm:text-[13px] italic font-medium text-base-content/85 leading-relaxed">
                &ldquo;{quoteText}&rdquo;
              </p>
              <div className="mt-2.5 flex items-center justify-end text-[10px] font-black uppercase tracking-wider text-base-content/50">
                — {quoteAuthor}
              </div>
            </div>
          </div>

          {/* Clean Quick Shortcuts */}
          <div className="relative z-10 grid grid-cols-3 sm:grid-cols-7 gap-2">
            {[
              { to: "/placement", icon: Target, label: "Placement", color: "text-amber-500", bg: "bg-amber-500/10" },
              { to: "/chat", icon: MessageSquare, label: "Peers Chat", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { to: "/compiler", icon: Terminal, label: "Compiler", color: "text-blue-500", bg: "bg-blue-500/10" },
              { to: "/assistant", icon: Brain, label: "AI Chat", color: "text-purple-500", bg: "bg-purple-500/10" },
              { to: "/flashcards", icon: BookOpen, label: "Decks", color: "text-green-500", bg: "bg-green-500/10" },
              { to: "/friends", icon: UsersIcon, label: "Peers", color: "text-orange-500", bg: "bg-orange-500/10" },
              { to: "/profile", icon: User, label: "Profile", color: "text-pink-500", bg: "bg-pink-500/10" },
            ].map((shortcut, idx) => (
              <Link 
                key={idx}
                to={shortcut.to} 
                className="p-3 bg-base-200/50 hover:bg-base-200 border border-base-content/5 hover:border-base-content/10 rounded-2xl flex flex-col items-center text-center group/btn transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className={`size-10 rounded-xl flex items-center justify-center mb-2 group-hover/btn:scale-110 transition-transform duration-300 ${shortcut.bg} ${shortcut.color}`}>
                  <shortcut.icon className="size-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-base-content/70 group-hover/btn:text-base-content">{shortcut.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── 2. PROGRESS TILE (Spans 1 col — fills right top corner) ── */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1 h-full min-h-[300px]">
          <ProgressDashboard />
        </motion.div>

        {/* ── 5. DISCOVER PARTNERS TILE (Spans full 4 cols on the third row) ── */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4 bg-base-100 rounded-[2rem] border border-base-content/10 overflow-hidden shadow-lg flex flex-col h-full group hover:border-secondary/20 transition-colors">
          <div className="p-6 border-b border-base-content/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-200/30">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20 shrink-0">
                <UsersIcon className="size-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-base-content leading-tight">
                  Discover Partners
                </h2>
                <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">
                  Recommended Matches ({filteredUsers.length})
                </span>
              </div>
            </div>
            
            <div className="relative w-full sm:w-64 shrink-0">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
              <input
                type="text"
                placeholder="Search name, language…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-base-100 border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary/30 font-medium text-base-content placeholder:text-base-content/30 shadow-inner transition-all"
              />
            </div>
          </div>

          <div className="p-6 bg-base-100 flex-1 overflow-x-auto custom-scrollbar">
            {loadingUsers ? (
              <div className="flex gap-4 min-w-max pb-2">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-bold text-sm text-base-content">
                    {searchQuery ? "No results found" : "No recommendations"}
                  </h3>
                  <p className="text-xs text-base-content/40 mt-1 font-medium">
                    {searchQuery ? "Try checking spelling or search terms." : "Check back later for new learners."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-5 min-w-max pb-2">
                {filteredUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                  return (
                    <div
                      key={user._id}
                      className="w-68 shrink-0 bg-base-100/90 backdrop-blur-md rounded-[2rem] border border-base-content/10 hover:border-secondary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="p-5 flex flex-col justify-between h-full space-y-4">
                        {/* User Header */}
                        <div className="flex items-center gap-3">
                          {/* Gradient Avatar Border */}
                          <div className="size-14 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <div className="size-full rounded-[0.9rem] bg-base-100 text-base-content flex items-center justify-center font-black text-lg overflow-hidden relative">
                              <span className="absolute inset-0 flex items-center justify-center font-black text-secondary">
                                {user.fullName?.charAt(0).toUpperCase()}
                              </span>
                              {user.profilePic && (
                                <img
                                  src={user.profilePic}
                                  alt={user.fullName}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-extrabold text-sm text-base-content group-hover:text-secondary transition-colors truncate tracking-tight">
                              {user.fullName}
                            </h3>
                            {user.location ? (
                              <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-base-content/50 mt-0.5 truncate">
                                <MapPinIcon className="size-3 mr-1 shrink-0 text-secondary" />
                                <span className="truncate">{user.location}</span>
                              </div>
                            ) : (
                              <div className="text-[10px] font-semibold text-base-content/40 mt-0.5">
                                Learner
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          {/* Languages */}
                          <div className="flex flex-col gap-1.5 mb-4">
                            <span className="px-3 py-1.5 bg-base-200/50 text-base-content/70 text-[10px] font-extrabold rounded-xl border border-base-content/5 flex items-center gap-1.5 uppercase tracking-widest shadow-xs">
                              <span className="text-base-content/30 font-black">N</span> {getLanguageIcon(user.nativeLanguage)} {capitalize(user.nativeLanguage)}
                            </span>
                            <span className="px-3 py-1.5 bg-secondary/10 text-secondary text-[10px] font-extrabold rounded-xl border border-secondary/15 flex items-center gap-1.5 uppercase tracking-widest shadow-xs">
                              <span className="text-secondary/50 font-black">L</span> {getLanguageIcon(user.learningLanguage)} {capitalize(user.learningLanguage)}
                            </span>
                          </div>

                          {/* Action Button */}
                          {hasRequestBeenSent ? (
                            <button
                              className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer bg-error/10 text-error hover:bg-error/20 border border-error/20"
                              onClick={() => handleCancelRequest(user._id)}
                              disabled={loadingIds.has(user._id)}
                            >
                              {loadingIds.has(user._id) ? (
                                <>
                                  <span className="w-3.5 h-3.5 border-2 border-error/30 border-t-error rounded-full animate-spin mr-1.5" />
                                  Unsending
                                </>
                              ) : (
                                <>
                                  <Undo2 className="size-3.5 mr-1.5" />
                                  Unsend
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer bg-primary text-primary-content hover:scale-[1.02] hover:shadow-md"
                              onClick={() => handleSendRequest(user._id)}
                              disabled={loadingIds.has(user._id)}
                            >
                              {loadingIds.has(user._id) ? (
                                <>
                                  <span className="w-3.5 h-3.5 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin mr-1.5" />
                                  Sending
                                </>
                              ) : (
                                <>
                                  <UserPlusIcon className="size-3.5 mr-1.5" />
                                  Connect
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── 6. COMMUNITY POSTS & FEED SECTION (Spans full width right below Discover Partners) ── */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4 mt-4">
          <CommunityFeedSection
            title="Community Posts & Feed"
            subtitle="Share notes, ask questions, and engage directly from your homepage"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
