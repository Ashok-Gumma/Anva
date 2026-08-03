import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserFriends, getRecommendedUsers, getOutgoingFriendReqs, sendFriendRequest, cancelFriendRequest } from "../lib/api";
import FriendCard, { getLanguageIcon } from "../components/FriendCard";
import { motion, AnimatePresence } from "framer-motion";
import { UsersIcon, UserPlusIcon, SearchIcon, MapPinIcon, Globe, Send, Undo2, Compass, X, MessageSquare } from "lucide-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { capitalize } from "../lib/utils";
import { Link, useSearchParams } from "react-router";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } },
};

const SkeletonUserCard = () => (
  <div className="bg-base-100/60 rounded-[2rem] p-5 border border-base-content/5 shadow-sm space-y-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="size-16 rounded-2xl bg-base-200/80 shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-3/4 bg-base-200/80 rounded-lg" />
        <div className="h-3 w-1/2 bg-base-200/60 rounded-lg" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-24 bg-base-200/60 rounded-lg" />
      <div className="h-6 w-24 bg-base-200/60 rounded-lg" />
    </div>
    <div className="h-10 w-full bg-base-200/50 rounded-xl" />
    <div className="h-11 w-full bg-base-200/80 rounded-xl" />
  </div>
);

const Friends = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");

  const activeTab = useMemo(() => {
    if (tabFromUrl === "explore" || tabFromUrl === "sent" || tabFromUrl === "network") {
      return tabFromUrl;
    }
    return "network";
  }, [tabFromUrl]);

  const handleTabChange = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [loadingIds, setLoadingIds] = useState(new Set());

  /* ── 1. Fetch Friends ── */
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  /* ── 2. Fetch Non-Friend Users ── */
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  /* ── 3. Fetch Outgoing Requests ── */
  const { data: outgoingFriendReqs = [], isLoading: loadingOutgoing } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const outgoingRequestsIds = useMemo(() => {
    const ids = new Set();
    outgoingFriendReqs.forEach((req) => {
      if (req?.recipient?._id) ids.add(req.recipient._id);
    });
    return ids;
  }, [outgoingFriendReqs]);

  /* ── Send Friend Request Mutation ── */
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

  /* ── Cancel / Unsend Friend Request Mutation ── */
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
      toast.success("Friend request unsent ↩️");
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

  const handleCancelRequest = (userId) => {
    if (loadingIds.has(userId)) return;
    setLoadingIds((prev) => new Set(prev).add(userId));
    cancelRequestMutation(userId);
  };

  /* ── Filtered Lists ── */
  const validFriends = useMemo(() => {
    return friends.filter((friend) => friend && friend._id);
  }, [friends]);

  const filteredFriends = useMemo(() => {
    return validFriends.filter((friend) => {
      const matchesSearch = 
        friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.nativeLanguage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.learningLanguage?.toLowerCase().includes(searchQuery.toLowerCase());

      const isOnline = friend.lastActive && (new Date() - new Date(friend.lastActive)) <= 5 * 60 * 1000;
      const matchesOnline = !onlineOnly || isOnline;

      return matchesSearch && matchesOnline;
    });
  }, [validFriends, searchQuery, onlineOnly]);

  const filteredExploreUsers = useMemo(() => {
    return recommendedUsers.filter((user) => {
      const matchesSearch =
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.nativeLanguage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.learningLanguage?.toLowerCase().includes(searchQuery.toLowerCase());

      const isOnline = user.lastActive && (new Date() - new Date(user.lastActive)) <= 5 * 60 * 1000;
      const matchesOnline = !onlineOnly || isOnline;

      return matchesSearch && matchesOnline;
    });
  }, [recommendedUsers, searchQuery, onlineOnly]);

  const filteredSentUsers = useMemo(() => {
    return outgoingFriendReqs
      .map((req) => req.recipient)
      .filter((user) => user && user._id)
      .filter((user) => {
        const matchesSearch =
          user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.nativeLanguage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.learningLanguage?.toLowerCase().includes(searchQuery.toLowerCase());

        const isOnline = user.lastActive && (new Date() - new Date(user.lastActive)) <= 5 * 60 * 1000;
        const matchesOnline = !onlineOnly || isOnline;

        return matchesSearch && matchesOnline;
      });
  }, [outgoingFriendReqs, searchQuery, onlineOnly]);

  const isLoading =
    activeTab === "network"
      ? loadingFriends
      : activeTab === "explore"
      ? loadingUsers
      : loadingOutgoing;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-300/40 min-h-screen">
      <motion.div 
        className="container mx-auto max-w-7xl space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ── TOP HEADER BANNER ── */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-base-100 via-base-100 to-base-200/50 p-6 rounded-[2rem] border border-base-content/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Compass className="size-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">Community Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              Peer Network & Discovery
            </h1>
            <p className="text-xs font-medium text-base-content/60 max-w-lg">
              Connect with language partners around the world, send study requests, and grow your learning network.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="px-4 py-2 bg-base-200/80 rounded-2xl border border-base-content/10 text-center">
              <span className="text-[10px] font-black uppercase text-base-content/40 block">Friends</span>
              <span className="text-lg font-black text-primary">{validFriends.length}</span>
            </div>
            <div className="px-4 py-2 bg-base-200/80 rounded-2xl border border-base-content/10 text-center">
              <span className="text-[10px] font-black uppercase text-base-content/40 block">Learners</span>
              <span className="text-lg font-black text-secondary">{recommendedUsers.length}</span>
            </div>
            <div className="px-4 py-2 bg-base-200/80 rounded-2xl border border-base-content/10 text-center">
              <span className="text-[10px] font-black uppercase text-base-content/40 block">Sent</span>
              <span className="text-lg font-black text-accent">{outgoingFriendReqs.length}</span>
            </div>
          </div>
        </motion.div>

        {/* ── CONTROLS BAR: TABS & SEARCH ── */}
        <motion.div variants={itemVariants} className="bg-base-100/80 backdrop-blur-xl rounded-[2rem] p-3 border border-base-content/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Segmented Tab Switcher */}
          <div className="flex items-center p-1 bg-base-200/60 rounded-2xl border border-base-content/5 w-full md:w-auto">
            <button
              onClick={() => handleTabChange("network")}
              className={`relative px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 flex-1 md:flex-none cursor-pointer ${
                activeTab === "network" ? "text-primary-content font-black shadow-md" : "text-base-content/60 hover:text-base-content"
              }`}
            >
              {activeTab === "network" && (
                <motion.div layoutId="activeTabPill" className="absolute inset-0 bg-primary rounded-xl -z-0" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <UsersIcon className="size-4 z-10" />
              <span className="z-10">My Network</span>
              <span className={`z-10 px-2 py-0.5 rounded-md text-[10px] font-bold ${activeTab === "network" ? "bg-base-100/25 text-white" : "bg-base-300 text-base-content/60"}`}>
                {validFriends.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("explore")}
              className={`relative px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 flex-1 md:flex-none cursor-pointer ${
                activeTab === "explore" ? "text-secondary-content font-black shadow-md" : "text-base-content/60 hover:text-base-content"
              }`}
            >
              {activeTab === "explore" && (
                <motion.div layoutId="activeTabPill" className="absolute inset-0 bg-secondary rounded-xl -z-0" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <Globe className="size-4 z-10" />
              <span className="z-10">Explore Learners</span>
              <span className={`z-10 px-2 py-0.5 rounded-md text-[10px] font-bold ${activeTab === "explore" ? "bg-base-100/25 text-white" : "bg-base-300 text-base-content/60"}`}>
                {recommendedUsers.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("sent")}
              className={`relative px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 flex-1 md:flex-none cursor-pointer ${
                activeTab === "sent" ? "text-accent-content font-black shadow-md" : "text-base-content/60 hover:text-base-content"
              }`}
            >
              {activeTab === "sent" && (
                <motion.div layoutId="activeTabPill" className="absolute inset-0 bg-accent rounded-xl -z-0" transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              )}
              <Send className="size-4 z-10" />
              <span className="z-10">Sent Requests</span>
              <span className={`z-10 px-2 py-0.5 rounded-md text-[10px] font-bold ${activeTab === "sent" ? "bg-base-100/25 text-white" : "bg-base-300 text-base-content/60"}`}>
                {outgoingFriendReqs.length}
              </span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Online Filter */}
            <label className="flex items-center gap-2 px-3 py-2 bg-base-200/50 rounded-xl border border-base-content/5 cursor-pointer select-none shrink-0 hover:bg-base-200 transition-colors">
              <input 
                type="checkbox" 
                checked={onlineOnly} 
                onChange={(e) => setOnlineOnly(e.target.checked)} 
                className="checkbox checkbox-primary checkbox-xs rounded-md" 
              />
              <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/70">Online Only</span>
            </label>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="text"
                placeholder={
                  activeTab === "network"
                    ? "Search network..."
                    : activeTab === "explore"
                    ? "Search name, language..."
                    : "Search sent requests..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs font-semibold bg-base-200/60 border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-base-content/30"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-0.5 rounded-full"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── CARDS GRID & CONTENT ── */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonUserCard key={i} />
              ))}
            </div>
          ) : activeTab === "network" ? (
            /* TAB 1: CONNECTED FRIENDS */
            filteredFriends.length === 0 ? (
              <motion.div 
                key="empty-network" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="p-12 text-center bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-sm max-w-md mx-auto my-8 space-y-4"
              >
                <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-inner">
                  <UsersIcon className="size-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-base-content">
                    {searchQuery || onlineOnly ? "No matching friends" : "Your network is quiet"}
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium mt-1">
                    {searchQuery || onlineOnly
                      ? "Try clearing search keywords or toggles."
                      : "Start discovering learners and build your study network today!"}
                  </p>
                </div>
                {!searchQuery && !onlineOnly && (
                  <button
                    onClick={() => handleTabChange("explore")}
                    className="btn btn-primary btn-sm font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-md"
                  >
                    <UserPlusIcon className="size-4 mr-1.5" />
                    Explore Learners & Connect
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="network-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredFriends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </motion.div>
            )
          ) : activeTab === "explore" ? (
            /* TAB 2: EXPLORE USERS */
            filteredExploreUsers.length === 0 ? (
              <motion.div 
                key="empty-explore" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="p-12 text-center bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-sm max-w-md mx-auto my-8 space-y-4"
              >
                <div className="size-16 rounded-3xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto border border-secondary/20 shadow-inner">
                  <Globe className="size-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-base-content">
                    {searchQuery ? "No matching learners found" : "All caught up!"}
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium mt-1">
                    {searchQuery
                      ? "Try checking your spelling or search terms."
                      : "You have connected with or sent requests to all active community learners!"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="explore-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredExploreUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                  const isUserOnline = user.lastActive && (new Date() - new Date(user.lastActive)) <= 5 * 60 * 1000;

                  return (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      className="bg-base-100/90 backdrop-blur-md rounded-[2rem] border border-base-content/10 hover:border-secondary/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      <div className="p-5 flex flex-col justify-between h-full space-y-4">
                        {/* User Header with Avatar Ring */}
                        <div className="flex items-center gap-4">
                          <Link to={`/user/${user._id}`} className="relative shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {/* Gradient Avatar Border */}
                            <div className="size-16 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-md">
                              <div className="size-full rounded-[0.9rem] bg-base-100 text-base-content flex items-center justify-center font-black text-xl overflow-hidden relative">
                                <span className="absolute inset-0 flex items-center justify-center font-black text-secondary">
                                  {user.fullName?.charAt(0)?.toUpperCase()}
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
                            {isUserOnline && (
                              <span className="absolute -bottom-1 -right-1 z-10 size-4 rounded-full bg-emerald-500 ring-2 ring-base-100 shadow-sm animate-pulse" title="Online" />
                            )}
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link to={`/user/${user._id}`} className="font-extrabold text-base sm:text-lg text-base-content tracking-tight group-hover:text-secondary transition-colors truncate block">
                              {user.fullName}
                            </Link>
                            {user.location ? (
                              <div className="flex items-center text-xs font-semibold text-base-content/50 gap-1 mt-0.5 truncate">
                                <MapPinIcon className="size-3.5 text-secondary shrink-0" />
                                <span className="truncate">{user.location}</span>
                              </div>
                            ) : (
                              <div className="text-[11px] font-semibold text-base-content/40 mt-0.5">
                                Community Learner
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages Badges */}
                        <div className="flex flex-wrap gap-2">
                          {user.nativeLanguage && (
                            <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 text-[11px] font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs">
                              {getLanguageIcon(user.nativeLanguage)}
                              Native: {capitalize(user.nativeLanguage)}
                            </span>
                          )}
                          {user.learningLanguage && (
                            <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 text-[11px] font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs">
                              {getLanguageIcon(user.learningLanguage)}
                              Learning: {capitalize(user.learningLanguage)}
                            </span>
                          )}
                        </div>

                        {/* Bio Box */}
                        {user.bio ? (
                          <p className="text-xs font-medium text-base-content/70 line-clamp-2 bg-base-200/40 p-3 rounded-xl border border-base-content/5 group-hover:border-base-content/10 transition-colors italic">
                            "{user.bio}"
                          </p>
                        ) : (
                          <div className="text-xs font-medium text-base-content/30 italic p-2">
                            No bio added yet.
                          </div>
                        )}

                        {/* Action Button: Send or Unsend Request */}
                        <div className="pt-2 mt-auto">
                          {hasRequestBeenSent ? (
                            <button
                              className="w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-error/10 text-error hover:bg-error hover:text-error-content border border-error/20 transition-all shadow-sm cursor-pointer"
                              onClick={() => handleCancelRequest(user._id)}
                              disabled={loadingIds.has(user._id)}
                            >
                              {loadingIds.has(user._id) ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                                  <span>Unsending...</span>
                                </>
                              ) : (
                                <>
                                  <Undo2 className="size-4" />
                                  <span>Unsend Request</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              className="w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-primary-content hover:brightness-110 shadow-md hover:shadow-primary/20 transition-all cursor-pointer"
                              onClick={() => handleSendRequest(user._id)}
                              disabled={loadingIds.has(user._id)}
                            >
                              {loadingIds.has(user._id) ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                                  <span>Sending Request...</span>
                                </>
                              ) : (
                                <>
                                  <UserPlusIcon className="size-4" />
                                  <span>Send Friend Request</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )
          ) : (
            /* TAB 3: SENT REQUESTS */
            filteredSentUsers.length === 0 ? (
              <motion.div 
                key="empty-sent" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0 }}
                className="p-12 text-center bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-sm max-w-md mx-auto my-8 space-y-4"
              >
                <div className="size-16 rounded-3xl bg-accent/10 text-accent flex items-center justify-center mx-auto border border-accent/20 shadow-inner">
                  <Send className="size-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-base-content">
                    {searchQuery ? "No matching sent requests" : "No pending sent requests"}
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium mt-1">
                    {searchQuery ? "Try checking your search query." : "You haven't sent any pending friend requests."}
                  </p>
                </div>
                {!searchQuery && (
                  <button
                    onClick={() => handleTabChange("explore")}
                    className="btn btn-secondary btn-sm font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-md"
                  >
                    <Globe className="size-4 mr-1.5" />
                    Explore Learners & Connect
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="sent-grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredSentUsers.map((user) => {
                  const isUserOnline = user.lastActive && (new Date() - new Date(user.lastActive)) <= 5 * 60 * 1000;

                  return (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      className="bg-base-100/90 backdrop-blur-md rounded-[2rem] border border-base-content/10 hover:border-accent/30 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      <div className="p-5 flex flex-col justify-between h-full space-y-4">
                        {/* User Header */}
                        <div className="flex items-center gap-4">
                          <Link to={`/user/${user._id}`} className="relative shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <div className="size-16 rounded-2xl bg-gradient-to-tr from-accent to-secondary p-0.5 shadow-md">
                              <div className="size-full rounded-[0.9rem] bg-base-100 text-base-content flex items-center justify-center font-black text-xl overflow-hidden relative">
                                <span className="absolute inset-0 flex items-center justify-center font-black text-accent">
                                  {user.fullName?.charAt(0)?.toUpperCase()}
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
                            {isUserOnline && (
                              <span className="absolute -bottom-1 -right-1 z-10 size-4 rounded-full bg-emerald-500 ring-2 ring-base-100 shadow-sm animate-pulse" title="Online" />
                            )}
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link to={`/user/${user._id}`} className="font-extrabold text-base sm:text-lg text-base-content tracking-tight group-hover:text-accent transition-colors truncate block">
                              {user.fullName}
                            </Link>
                            {user.location ? (
                              <div className="flex items-center text-xs font-semibold text-base-content/50 gap-1 mt-0.5 truncate">
                                <MapPinIcon className="size-3.5 text-accent shrink-0" />
                                <span className="truncate">{user.location}</span>
                              </div>
                            ) : (
                              <div className="text-[11px] font-semibold text-base-content/40 mt-0.5">
                                Pending Partner
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages Badges */}
                        <div className="flex flex-wrap gap-2">
                          {user.nativeLanguage && (
                            <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 text-[11px] font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs">
                              {getLanguageIcon(user.nativeLanguage)}
                              Native: {capitalize(user.nativeLanguage)}
                            </span>
                          )}
                          {user.learningLanguage && (
                            <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 text-[11px] font-extrabold rounded-xl flex items-center gap-1.5 shadow-xs">
                              {getLanguageIcon(user.learningLanguage)}
                              Learning: {capitalize(user.learningLanguage)}
                            </span>
                          )}
                        </div>

                        {/* Unsend Request Button */}
                        <div className="pt-2 mt-auto">
                          <button
                            className="w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-error/10 text-error hover:bg-error hover:text-error-content border border-error/20 transition-all shadow-sm cursor-pointer"
                            onClick={() => handleCancelRequest(user._id)}
                            disabled={loadingIds.has(user._id)}
                          >
                            {loadingIds.has(user._id) ? (
                              <>
                                <span className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                                <span>Unsending...</span>
                              </>
                            ) : (
                              <>
                                <Undo2 className="size-4" />
                                <span>Unsend Request</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Friends;
