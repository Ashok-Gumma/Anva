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
} from "lucide-react";
import toast from "react-hot-toast";
import { capitalize } from "../lib/utils";
import FriendCard, { getLanguageIcon } from "../components/FriendCard";
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

  /* ── Interactive State (XP) ── */
  const [xp, setXp] = useState(() => Number(localStorage.getItem("anva_xp") || "1240"));

  /* ── Daily Challenge State ── */
  const BRAIN_TEASERS = [
    {
      topic: "React Hooks Quiz",
      code: "// Fix React loop:\nuseEffect(() => {\n  fetchData().then(d => setD(d));\n});",
      options: ["A) Add [d] as dependency", "B) Add [] dependency", "C) Use useState instead", "D) Change variables"],
      answerIndex: 1,
      explanation: "Dependency array [] ensures the effect runs only once on mount."
    },
    {
      topic: "JS Closures",
      code: "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 1);\n}\n// What prints?",
      options: ["A) 0, 1, 2", "B) 3, 3, 3", "C) 1, 2, 3", "D) undefined"],
      answerIndex: 1,
      explanation: "var is function-scoped. By the time setTimeout runs, the loop has finished and i is 3."
    },
    {
      topic: "CSS Specificity",
      code: "<div id=\"box\" class=\"box\"></div>\n#box { color: red; }\n.box { color: blue; }\n// What color?",
      options: ["A) blue", "B) red", "C) black", "D) inherit"],
      answerIndex: 1,
      explanation: "ID selectors (#box) have higher specificity than class selectors (.box)."
    },
    {
      topic: "Array Mutation",
      code: "const arr = [1, 2, 3];\narr[10] = 99;\nconsole.log(arr.length);\n// Output?",
      options: ["A) 4", "B) 3", "C) 11", "D) Error"],
      answerIndex: 2,
      explanation: "JavaScript arrays are sparse. Setting index 10 changes the length to 11."
    },
    {
      topic: "Promise Execution",
      code: "console.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');",
      options: ["A) A, B, C", "B) A, C, B", "C) C, A, B", "D) B, A, C"],
      answerIndex: 1,
      explanation: "Microtasks (Promises) run after the current synchronous macrotask finishes (A, C, then B)."
    }
  ];

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const teaserIndex = dayOfYear % BRAIN_TEASERS.length;
  const todayTeaser = BRAIN_TEASERS[teaserIndex];
  const challengeKey = `anva_challenge_solved_${dayOfYear}`;

  const [challengeSolved, setChallengeSolved] = useState(() => localStorage.getItem(challengeKey) === "true");
  const [selectedTeaserOption, setSelectedTeaserOption] = useState(null);
  const [_teaserError, setTeaserError] = useState(false);

  const [challenges, setChallenges] = useState([
    { id: 1, text: "Practice Spanish vocabulary for 5 mins", completed: false, xp: 50 },
    { id: 2, text: "Send a friendly message to a study peer", completed: false, xp: 75 },
    { id: 3, text: "Check grammar on 1 sentence", completed: false, xp: 40 },
  ]);

  const toggleChallenge = (id, rewardXp) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextState = !c.completed;
          if (nextState) {
            setXp((curr) => {
              const updated = curr + rewardXp;
              localStorage.setItem("anva_xp", String(updated));
              return updated;
            });
            toast.success(`Challenge complete! +${rewardXp} XP 🎉`);
          } else {
            setXp((curr) => {
              const updated = Math.max(0, curr - rewardXp);
              localStorage.setItem("anva_xp", String(updated));
              return updated;
            });
          }
          return { ...c, completed: nextState };
        }
        return c;
      })
    );
  };

  /* ── Random Motivational Quote ── */
  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }, []);

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

  // Daily Teaser Answer Handler
  const handleTeaserOptionClick = (optionIndex) => {
    if (challengeSolved) return;
    setSelectedTeaserOption(optionIndex);
    
    if (optionIndex === todayTeaser.answerIndex) {
      const newXp = xp + 20;
      setXp(newXp);
      setChallengeSolved(true);
      setTeaserError(false);
      localStorage.setItem("anva_xp", newXp.toString());
      localStorage.setItem(challengeKey, "true");
      toast.success(`🎉 Correct! ${todayTeaser.explanation} +20 XP awarded!`);
    } else {
      setTeaserError(true);
      toast.error("Oops! That's not right. Try again!");
    }
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
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/5 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-secondary/5 blur-[50px] pointer-events-none" />
          
          <div className="relative z-10 space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
              <BrainCircuit className="size-3.5" />
              Intelligence Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight text-base-content">
              Welcome back,<br/>
              <span className="font-curly font-bold italic text-primary text-4xl sm:text-5xl">{authUser.fullName?.split(" ")[0]}! 👋</span>
            </h1>
            <p className="text-sm text-base-content/60 leading-relaxed font-medium max-w-md">
              Your compiler is hot. Let's write code and <span className="font-curly font-bold italic text-secondary text-base">connect with peers</span> today!
            </p>
          </div>

          {/* Clean Quick Shortcuts */}
          <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { to: "/feed", icon: ImageIcon, label: "EduFeed", color: "text-rose-500", bg: "bg-rose-500/10" },
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

        {/* ── 4. ACTIVE CONNECTIONS TILE (Spans full width 4 cols) ── */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4 bg-base-100 rounded-[2rem] border border-base-content/10 overflow-hidden shadow-lg flex flex-col group hover:border-primary/20 transition-colors h-full min-h-[200px]">
          <div className="p-6 border-b border-base-content/5 flex items-center justify-between bg-base-200/30">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                <UsersIcon className="size-5" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-base-content leading-tight">
                  Active Connections
                </h2>
                <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">
                  Your Study Network
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/notifications"
                className="btn btn-ghost btn-xs font-bold uppercase tracking-widest text-[9px] hover:bg-base-200 rounded-lg hidden sm:flex h-8 px-3"
              >
                Requests <span className="ml-1 bg-primary text-primary-content px-1.5 rounded-md">{friendRequests?.incomingReqs?.length || 0}</span>
              </Link>
              <Link
                to="/friends"
                className="btn btn-primary btn-xs font-black uppercase tracking-widest text-[9px] px-4 shadow-md rounded-lg h-8 hover:scale-105 transition-transform"
              >
                View Network
              </Link>
            </div>
          </div>

          <div className="p-6 bg-base-100 flex-1 flex items-center justify-between gap-6">
            <div className="flex items-center min-w-[40%]">
              {loadingFriends ? (
                <div className="flex -space-x-4">
                  {[...Array(5)].map((_, i) => <div key={i} className="size-14 rounded-full bg-base-300 border-2 border-base-100 animate-pulse" />)}
                </div>
              ) : friends.length === 0 ? (
                <p className="text-sm font-medium text-base-content/40 w-full text-center">No active connections yet. Find some below!</p>
              ) : (
                <div className="flex -space-x-4 pl-4 pt-4 pb-4">
                  {friends.slice(0, 6).map((friend) => (
                    <Link key={friend._id} to={`/user/${friend._id}`} className="relative group/avatar hover:z-10 transition-transform hover:scale-110">
                      <div className="size-14 rounded-full border-4 border-base-100 bg-base-300 overflow-hidden shadow-sm">
                        {friend.profilePic ? (
                          <img src={friend.profilePic} alt={friend.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-lg font-black text-base-content/50 uppercase">
                            {friend.fullName?.charAt(0)}
                          </span>
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral text-neutral-content text-[10px] font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {friend.fullName}
                      </div>
                    </Link>
                  ))}
                  {friends.length > 6 && (
                    <div className="size-14 rounded-full border-4 border-base-100 bg-base-200 flex items-center justify-center text-xs font-black text-base-content/50 z-0">
                      +{friends.length - 6}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Motivational Quote */ }
            <div className="flex-1 hidden sm:flex flex-col justify-center items-end text-right border-l border-base-content/10 pl-6 my-2">
              <p className="text-sm font-medium text-base-content/60 italic leading-relaxed">
                "{dailyQuote.split(" – ")[0]}"
              </p>
              {dailyQuote.includes(" – ") && (
                <span className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mt-2">
                  — {dailyQuote.split(" – ")[1]}
                </span>
              )}
            </div>
          </div>
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
