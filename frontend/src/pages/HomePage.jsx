import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  getFriendRequests,
  getStreamToken,
} from "../lib/api";
import { StreamChat } from "stream-chat";
import useAuthUser from "../hooks/useAuthUser";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  SearchIcon,
  Sparkles,
  Brain,
  Terminal,
  BookOpen,
  Flame
} from "lucide-react";
import toast from "react-hot-toast";
import { capitalize } from "../lib/utils";
import FriendCard, { getLanguageIcon } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { motion } from "framer-motion";
import ProgressDashboard from "../components/ProgressDashboard";
import SkeletonCard from "../components/SkeletonCard";

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
  const { authUser } = useAuthUser();
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Interactive State (XP) ── */
  const [xp, setXp] = useState(() => Number(localStorage.getItem("anva_xp") || "1240"));

  /* ── Daily Challenge State ── */
  const [challengeSolved, setChallengeSolved] = useState(() => localStorage.getItem("anva_challenge_solved") === "true");
  const [selectedTeaserOption, setSelectedTeaserOption] = useState(null);
  const [teaserError, setTeaserError] = useState(false);

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
  });

  /* ── Recommended Users ── */
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  /* ── Outgoing Requests ── */
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
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

  // Daily Teaser Answer Handler
  const handleTeaserOptionClick = (optionIndex) => {
    if (challengeSolved) return;
    setSelectedTeaserOption(optionIndex);
    
    if (optionIndex === 1) { // B is correct
      const newXp = xp + 20;
      setXp(newXp);
      setChallengeSolved(true);
      setTeaserError(false);
      localStorage.setItem("anva_xp", newXp.toString());
      localStorage.setItem("anva_challenge_solved", "true");
      toast.success("🎉 Correct! Dependency array [] ensures the effect runs only once on mount. +20 XP awarded!");
    } else {
      setTeaserError(true);
      toast.error("Oops! That causes another loop or error. Check the state updater carefully.");
    }
  };



  if (!authUser) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-200 min-h-[calc(100vh-4rem)] text-base-content font-sans">
      <motion.div
        className="container mx-auto space-y-8 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ── 1. GREETING HERO BANNER ── */}
        <motion.div 
          variants={itemVariants}
          className="relative bg-gradient-to-r from-primary/10 via-accent/5 to-base-100 p-6 sm:p-8 rounded-3xl border border-base-content/10 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Intelligence Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {authUser.fullName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 leading-relaxed font-medium">
              Your compiler is hot. Let's write some code and connect with peers today!
            </p>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 md:max-w-md w-full">
            <Link 
              to="/compiler" 
              className="p-3 bg-base-100 hover:bg-base-200 border border-base-content/5 rounded-2xl flex flex-col items-center text-center group transition-all cursor-pointer shadow-sm"
            >
              <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Terminal className="size-4" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide">Compiler</span>
            </Link>
            
            <Link 
              to="/assistant" 
              className="p-3 bg-base-100 hover:bg-base-200 border border-base-content/5 rounded-2xl flex flex-col items-center text-center group transition-all cursor-pointer shadow-sm"
            >
              <div className="size-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Brain className="size-4" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide">AI Chat</span>
            </Link>

            <Link 
              to="/flashcards" 
              className="p-3 bg-base-100 hover:bg-base-200 border border-base-content/5 rounded-2xl flex flex-col items-center text-center group transition-all cursor-pointer shadow-sm"
            >
              <div className="size-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="size-4" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide">Decks</span>
            </Link>

            <Link 
              to="/friends" 
              className="p-3 bg-base-100 hover:bg-base-200 border border-base-content/5 rounded-2xl flex flex-col items-center text-center group transition-all cursor-pointer shadow-sm"
            >
              <div className="size-8 rounded-xl bg-success/10 text-success flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <UsersIcon className="size-4" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wide">Peers</span>
            </Link>
          </div>
        </motion.div>

        {/* ── 2. DYNAMIC PROGRESS METRICS ── */}
        <motion.div variants={itemVariants}>
          <ProgressDashboard />
        </motion.div>

        {/* ── 3. WORKSPACE COLUMNS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Exchange & Network (Friends & Matchmaker) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Active Connections */}
            <motion.div variants={itemVariants} className="bg-base-100 rounded-3xl border border-base-content/10 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-base-content/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <UsersIcon className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-base-content leading-tight">
                      Active Connections
                    </h2>
                    <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">
                      Study Network
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/notifications"
                    className="btn btn-ghost btn-xs font-bold uppercase tracking-widest text-[9px] hover:bg-base-200 rounded-lg"
                  >
                    Requests ({friendRequests?.incomingReqs?.length || 0})
                  </Link>
                  <Link
                    to="/friends"
                    className="btn btn-primary btn-xs font-black uppercase tracking-widest text-[9px] px-3 shadow-md rounded-lg"
                  >
                    View All
                  </Link>
                </div>
              </div>

              <div className="p-6 bg-base-100/40">
                {loadingFriends ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : friends.length === 0 ? (
                  <NoFriendsFound />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {friends.slice(0, 4).map((friend) => (
                      <FriendCard key={friend._id} friend={friend} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Discover Partners */}
            <motion.div variants={itemVariants} className="bg-base-100 rounded-3xl border border-base-content/10 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-base-content/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20">
                    <Sparkles className="size-4 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-wider text-base-content leading-tight">
                      Discover Exchange Partners
                    </h2>
                    <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">
                      Recommended Matches
                    </span>
                  </div>
                </div>
                
                <div className="relative w-full sm:w-64 shrink-0">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-base-content/35" />
                  <input
                    type="text"
                    placeholder="Search name, language…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-base-200 border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 font-medium text-base-content placeholder:text-base-content/30"
                  />
                </div>
              </div>

              <div className="p-6 bg-base-100/40">
                {loadingUsers ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-8 text-center bg-base-100 rounded-2xl border border-base-content/5">
                    <h3 className="font-semibold text-sm text-base-content">
                      {searchQuery ? "No results found" : "No recommendations available"}
                    </h3>
                    <p className="text-xs text-base-content/50 mt-1 font-medium">
                      {searchQuery ? "Try checking spelling or search terms." : "Check back later for new learners."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filteredUsers.slice(0, 4).map((user) => {
                      const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                      return (
                        <div
                          key={user._id}
                          className="bg-base-100 rounded-2xl border border-base-content/10 hover:border-primary/20 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                        >
                          <div className="p-5 flex flex-col gap-4">
                            {/* User Header */}
                            <div className="flex items-center gap-3">
                              <div className="relative size-11 rounded-xl bg-primary text-primary-content flex items-center justify-center font-extrabold text-base overflow-hidden shadow-inner shrink-0">
                                <span className="absolute inset-0 flex items-center justify-center">
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

                              <div className="min-w-0">
                                <h3 className="font-bold text-xs text-base-content truncate">
                                  {user.fullName}
                                </h3>
                                {user.location && (
                                  <div className="flex items-center text-[9px] font-black uppercase tracking-wider text-base-content/45 mt-0.5 truncate">
                                    <MapPinIcon className="size-3 mr-0.5 text-base-content/40 shrink-0" />
                                    {user.location}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Languages */}
                            <div className="flex flex-wrap gap-1.5">
                              <span className="px-2 py-0.5 bg-secondary/15 text-secondary text-[9px] font-black rounded border border-secondary/10 flex items-center gap-1 uppercase tracking-wide">
                                {getLanguageIcon(user.nativeLanguage)}
                                {capitalize(user.nativeLanguage)}
                              </span>
                              <span className="px-2 py-0.5 bg-accent/15 text-accent text-[9px] font-black rounded border border-accent/10 flex items-center gap-1 uppercase tracking-wide">
                                {getLanguageIcon(user.learningLanguage)}
                                {capitalize(user.learningLanguage)}
                              </span>
                            </div>

                            {/* Action Button */}
                            <button
                              className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                                hasRequestBeenSent
                                  ? "bg-base-200 text-base-content/35 cursor-not-allowed border border-base-content/5"
                                  : "bg-primary text-primary-content hover:opacity-95 active:scale-[0.98]"
                              }`}
                              onClick={() => handleSendRequest(user._id)}
                              disabled={hasRequestBeenSent || loadingIds.has(user._id)}
                            >
                              {hasRequestBeenSent ? (
                                <>
                                  <CheckCircleIcon className="size-3.5 mr-1" />
                                  Sent
                                </>
                              ) : loadingIds.has(user._id) ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin mr-1" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <UserPlusIcon className="size-3.5 mr-1" />
                                  Connect
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Interactive Widgets (Timer, Quiz, Logs) */}
          <div className="lg:col-span-5 space-y-8">
            


            {/* 2. Daily Brain Teaser */}
            <motion.div 
              variants={itemVariants}
              className="bg-base-100 rounded-3xl border border-base-content/10 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2.5 border-b border-base-content/5 pb-3">
                <div className="size-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center border border-accent/20">
                  <Brain className="size-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-base-content">
                    Daily Brain Teaser
                  </h3>
                  <span className="text-[9px] text-base-content/40 font-bold uppercase tracking-wider">
                    React Hooks Quiz
                  </span>
                </div>
                {challengeSolved && (
                  <span className="badge badge-success badge-sm font-black uppercase tracking-wider text-[9px] ml-auto">
                    Solved (+20 XP)
                  </span>
                )}
              </div>

              {/* Code block */}
              <div className="bg-base-300/70 p-4 rounded-xl border border-base-content/5 text-[11px] font-mono leading-relaxed text-base-content/90 overflow-x-auto text-left whitespace-pre">
                {`// Fix React loop bug:\nuseEffect(() => {\n  fetchData().then(data => setData(data));\n}); // missing dependency?`}
              </div>

              {/* Multiple choices */}
              <div className="space-y-2">
                {[
                  "A) Add [data] as dependency array",
                  "B) Add empty dependency array []",
                  "C) Replace useEffect with useState",
                  "D) Change fetch call to use let variables"
                ].map((option, index) => {
                  const isSelected = selectedTeaserOption === index;
                  let btnStyle = "bg-base-200 hover:bg-base-300/70 border-base-content/5 text-base-content/90";
                  
                  if (challengeSolved && index === 1) {
                    btnStyle = "bg-success/15 border-success/30 text-success font-semibold";
                  } else if (isSelected && index !== 1) {
                    btnStyle = "bg-error/15 border-error/30 text-error font-semibold";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleTeaserOptionClick(index)}
                      disabled={challengeSolved}
                      className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {challengeSolved && index === 1 && <span className="text-[10px] font-bold">✓</span>}
                      {isSelected && index !== 1 && <span className="text-[10px] font-bold">✗</span>}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* 3. Recent Activity Log */}
            <motion.div 
              variants={itemVariants}
              className="bg-base-100 rounded-3xl border border-base-content/10 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2.5 border-b border-base-content/5 pb-3">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Flame className="size-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-base-content">
                    Activity Stream
                  </h3>
                  <span className="text-[9px] text-base-content/40 font-bold uppercase tracking-wider">
                    Recent Logs
                  </span>
                </div>
              </div>

              <div className="space-y-3.5">
                {[
                  {
                    app: "Compiler",
                    desc: "Solved Binary Search in JavaScript Compiler",
                    time: "10 min ago",
                    icon: Terminal,
                    color: "text-primary bg-primary/10"
                  },
                  {
                    app: "Study Decks",
                    desc: "Reviewed 15 terms in Japanese Vocabulary Deck",
                    time: "2 hours ago",
                    icon: BookOpen,
                    color: "text-accent bg-accent/10"
                  },
                  {
                    app: "AI Assistant",
                    desc: "Asked doubt on React state updates",
                    time: "Yesterday",
                    icon: Brain,
                    color: "text-secondary bg-secondary/10"
                  }
                ].map((act, idx) => {
                  const ActIcon = act.icon;
                  return (
                    <div key={idx} className="flex gap-3 text-left">
                      <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                        <ActIcon className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-base-content tracking-tight leading-snug">
                          {act.desc}
                        </p>
                        <p className="text-[9px] text-base-content/40 font-black uppercase tracking-wider mt-0.5">
                          {act.app} • {act.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};

export default HomePage;
