import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserFriends,
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
  cancelFriendRequest,
} from "../lib/api";
import FriendCard from "../components/FriendCard";
import { getLanguageIcon } from "../lib/languageUtils";
import { motion, AnimatePresence } from "framer-motion";
import {
  UsersIcon,
  UserPlusIcon,
  SearchIcon,
  MapPinIcon,
  Globe,
  Send,
  Undo2,
  Compass,
  X,
  User,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { capitalize } from "../lib/utils";
import { LANGUAGES, LANGUAGE_TO_FLAG, LANGUAGE_TO_ICON } from "../constants";
import { Link, useSearchParams } from "react-router";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } },
};

const SkeletonUserCard = () => (
  <div className="bg-base-100 rounded-3xl p-5 border border-base-content/10 shadow-2xs space-y-4 animate-pulse h-[270px] flex flex-col justify-between">
    <div className="flex items-center gap-3.5 h-14">
      <div className="size-14 rounded-2xl bg-base-200 shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <div className="h-4 w-3/4 bg-base-200 rounded-md" />
        <div className="h-3 w-1/2 bg-base-200 rounded-md" />
      </div>
    </div>
    <div className="h-9 w-full bg-base-200/60 rounded-xl" />
    <div className="h-12 w-full bg-base-200/40 rounded-xl" />
    <div className="h-10 w-full bg-base-200 rounded-xl mt-auto" />
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

  // Language multi-select filters (explore tab only)
  const [filterLearning, setFilterLearning] = useState([]);  // learning language filter
  const [filterNative, setFilterNative] = useState([]);      // native/known language filter
  const [filterOpen, setFilterOpen] = useState(false);       // filter panel open/close

  /* ── 1. Fetch Friends ── */
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    refetchInterval: 15_000,
  });

  /* ── 2. Fetch Non-Friend Users ── */
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    refetchInterval: 15_000,
  });

  /* ── 3. Fetch Outgoing Requests ── */
  const { data: outgoingFriendReqs = [], isLoading: loadingOutgoing } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
    refetchInterval: 15_000,
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
      setLoadingIds((prev) => {
        const n = new Set(prev);
        n.delete(userId);
        return n;
      });
      toast.error(err.response?.data?.message || "Failed to send request");
    },
    onSuccess: (data, userId) => {
      setLoadingIds((prev) => {
        const n = new Set(prev);
        n.delete(userId);
        return n;
      });
      toast.success("Friend request sent");
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
      setLoadingIds((prev) => {
        const n = new Set(prev);
        n.delete(userId);
        return n;
      });
      toast.error(err.response?.data?.message || "Failed to unsend request");
    },
    onSuccess: (data, userId) => {
      setLoadingIds((prev) => {
        const n = new Set(prev);
        n.delete(userId);
        return n;
      });
      toast.success("Friend request unsent");
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

  const validOutgoingReqs = useMemo(() => {
    return outgoingFriendReqs.filter((req) => req?.recipient?._id);
  }, [outgoingFriendReqs]);

  const filteredFriends = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return validFriends.filter((friend) => {
      const matchesSearch =
        !q ||
        (friend.fullName && friend.fullName.toLowerCase().includes(q)) ||
        (friend.location && friend.location.toLowerCase().includes(q)) ||
        (friend.nativeLanguage && friend.nativeLanguage.toLowerCase().includes(q)) ||
        (friend.learningLanguage && friend.learningLanguage.toLowerCase().includes(q));

      const isOnline =
        friend.lastActive && new Date() - new Date(friend.lastActive) <= 5 * 60 * 1000;
      const matchesOnline = !onlineOnly || isOnline;

      return matchesSearch && matchesOnline;
    });
  }, [validFriends, searchQuery, onlineOnly]);

  const filteredExploreUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return recommendedUsers.filter((user) => {
      if (!user || !user._id) return false;
      const matchesSearch =
        !q ||
        (user.fullName && user.fullName.toLowerCase().includes(q)) ||
        (user.location && user.location.toLowerCase().includes(q)) ||
        (user.nativeLanguage && user.nativeLanguage.toLowerCase().includes(q)) ||
        (user.learningLanguage && user.learningLanguage.toLowerCase().includes(q));

      const isOnline =
        user.lastActive && new Date() - new Date(user.lastActive) <= 5 * 60 * 1000;
      const matchesOnline = !onlineOnly || isOnline;

      // Multi-select language filters
      const userLearning = (user.learningLanguage || "").toLowerCase();
      const userNative = (user.nativeLanguage || "").toLowerCase();
      const matchesLearning =
        filterLearning.length === 0 ||
        filterLearning.some((l) => l.toLowerCase() === userLearning);
      const matchesNative =
        filterNative.length === 0 ||
        filterNative.some((l) => l.toLowerCase() === userNative);

      return matchesSearch && matchesOnline && matchesLearning && matchesNative;
    });
  }, [recommendedUsers, searchQuery, onlineOnly, filterLearning, filterNative]);

  const filteredSentUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (Array.isArray(validOutgoingReqs) ? validOutgoingReqs : [])
      .map((req) => req?.recipient)
      .filter((user) => {
        if (!user) return false;
        const matchesSearch =
          !q ||
          (user.fullName && user.fullName.toLowerCase().includes(q)) ||
          (user.location && user.location.toLowerCase().includes(q)) ||
          (user.nativeLanguage && user.nativeLanguage.toLowerCase().includes(q)) ||
          (user.learningLanguage && user.learningLanguage.toLowerCase().includes(q));

        const isOnline =
          user.lastActive && new Date() - new Date(user.lastActive) <= 5 * 60 * 1000;
        const matchesOnline = !onlineOnly || isOnline;

        return matchesSearch && matchesOnline;
      });
  }, [validOutgoingReqs, searchQuery, onlineOnly]);

  const isLoading =
    activeTab === "network"
      ? loadingFriends
      : activeTab === "explore"
      ? loadingUsers
      : loadingOutgoing;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen font-minimal selection:bg-base-content selection:text-base-100">
      <motion.div
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* ── 1. HEADER BANNER ── */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-base-100 via-base-100 to-base-200/50 p-6 sm:p-8 rounded-[2.5rem] border border-base-content/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Peer Discovery & Network
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
              Community <span className="font-curly italic text-primary font-bold tracking-wide">Network</span>
            </h1>

            <p className="text-xs sm:text-sm text-base-content/60 font-medium max-w-xl">
              Connect with fellow learners, exchange study insights, and build your collaborative educational network.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
            <div className="flex-1 md:flex-initial px-4 py-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-center min-w-[95px] shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">
                Friends
              </span>
              <span className="text-xl font-curly font-bold text-primary">
                {validFriends.length}
              </span>
            </div>

            <div className="flex-1 md:flex-initial px-4 py-2.5 bg-secondary/10 rounded-2xl border border-secondary/20 text-center min-w-[95px] shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-secondary block">
                Learners
              </span>
              <span className="text-xl font-curly font-bold text-secondary">
                {recommendedUsers.length}
              </span>
            </div>

            <div className="flex-1 md:flex-initial px-4 py-2.5 bg-accent/10 rounded-2xl border border-accent/20 text-center min-w-[95px] shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent block">
                Pending
              </span>
              <span className="text-xl font-curly font-bold text-accent">
                {validOutgoingReqs.length}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── 2. CONTROL RIBBON BAR ── */}
        <motion.div
          variants={itemVariants}
          className="bg-base-100/90 backdrop-blur-xl p-2.5 rounded-[2rem] border border-base-content/10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3.5 relative z-10"
        >
          {/* Segmented Ribbon Tab Switcher */}
          <div className="flex items-center p-1.5 bg-base-200/60 rounded-2xl border border-base-content/5 w-full lg:w-auto overflow-x-auto gap-1">
            <button
              onClick={() => handleTabChange("network")}
              className={`px-4 h-10 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 flex-1 lg:flex-none cursor-pointer ${
                activeTab === "network"
                  ? "bg-primary text-primary-content shadow-md shadow-primary/20 scale-[1.01]"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-200/80"
              }`}
            >
              <UsersIcon className="size-4 shrink-0" />
              <span>My Network</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-colors ${
                  activeTab === "network"
                    ? "bg-primary-content/20 text-primary-content"
                    : "bg-base-300/80 text-base-content/70"
                }`}
              >
                {validFriends.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("explore")}
              className={`px-4 h-10 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 flex-1 lg:flex-none cursor-pointer ${
                activeTab === "explore"
                  ? "bg-primary text-primary-content shadow-md shadow-primary/20 scale-[1.01]"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-200/80"
              }`}
            >
              <Globe className="size-4 shrink-0" />
              <span>Explore Learners</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-colors ${
                  activeTab === "explore"
                    ? "bg-primary-content/20 text-primary-content"
                    : "bg-base-300/80 text-base-content/70"
                }`}
              >
                {recommendedUsers.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("sent")}
              className={`px-4 h-10 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 flex-1 lg:flex-none cursor-pointer ${
                activeTab === "sent"
                  ? "bg-primary text-primary-content shadow-md shadow-primary/20 scale-[1.01]"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-200/80"
              }`}
            >
              <Send className="size-4 shrink-0" />
              <span>Sent Requests</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-colors ${
                  activeTab === "sent"
                    ? "bg-primary-content/20 text-primary-content"
                    : "bg-base-300/80 text-base-content/70"
                }`}
              >
                {validOutgoingReqs.length}
              </span>
            </button>
          </div>

          {/* Search & Online Filters Bar */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
            {/* ONLINE ONLY Toggle Pill Button */}
            <button
              type="button"
              onClick={() => setOnlineOnly(!onlineOnly)}
              className={`h-10 px-4 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold tracking-wide cursor-pointer select-none shrink-0 ${
                onlineOnly
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-2xs"
                  : "bg-base-200/60 hover:bg-base-200 border-base-content/10 text-base-content/70"
              }`}
            >
              <span className="relative flex size-2.5">
                {onlineOnly && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex size-2.5 rounded-full ${
                    onlineOnly ? "bg-emerald-500" : "bg-base-content/30"
                  }`}
                />
              </span>
              <span>Online Only</span>
            </button>

            {/* Language Filter Toggle — only on explore tab */}
            {activeTab === "explore" && (
              <button
                type="button"
                onClick={() => setFilterOpen((p) => !p)}
                className={`h-10 px-4 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold tracking-wide cursor-pointer select-none shrink-0 ${
                  filterOpen || filterLearning.length > 0 || filterNative.length > 0
                    ? "bg-primary/10 text-primary border-primary/30 shadow-2xs"
                    : "bg-base-200/60 hover:bg-base-200 border-base-content/10 text-base-content/70"
                }`}
              >
                <SlidersHorizontal className="size-3.5" />
                <span>Filters</span>
                {(filterLearning.length + filterNative.length) > 0 && (
                  <span className="flex items-center justify-center size-4 rounded-full bg-primary text-primary-content text-[9px] font-black">
                    {filterLearning.length + filterNative.length}
                  </span>
                )}
                <ChevronDown
                  className={`size-3 transition-transform duration-200 ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}

            {/* Search Input Box */}
            <div className="relative w-full md:w-64 h-10">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="text"
                placeholder={
                  activeTab === "network"
                    ? "Search friends..."
                    : activeTab === "explore"
                    ? "Search learners..."
                    : "Search sent requests..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full pl-10 pr-9 text-xs font-semibold bg-base-200/70 border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-base-100 transition-all placeholder:text-base-content/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content p-0.5 rounded-full cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── LANGUAGE FILTER PANEL (explore tab only) ── */}
        <AnimatePresence>
          {activeTab === "explore" && filterOpen && (
            <motion.div
              key="filter-panel"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="bg-base-100/90 backdrop-blur-xl p-5 rounded-[2rem] border border-base-content/10 shadow-sm space-y-4 relative z-10">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-base-content/70">Language Filters</span>
                  </div>
                  {(filterLearning.length > 0 || filterNative.length > 0) && (
                    <button
                      type="button"
                      onClick={() => { setFilterLearning([]); setFilterNative([]); }}
                      className="text-[10px] font-bold text-error/70 hover:text-error flex items-center gap-1 cursor-pointer"
                    >
                      <X className="size-3" /> Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Learning Language multi-select */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-accent">
                      🎯 Learning Language
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                      {LANGUAGES.map((lang) => {
                        const selected = filterLearning.includes(lang);
                        const key = lang.toLowerCase();
                        const flag = LANGUAGE_TO_FLAG[key];
                        const icon = LANGUAGE_TO_ICON[key];
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() =>
                              setFilterLearning((prev) =>
                                selected
                                  ? prev.filter((l) => l !== lang)
                                  : [...prev, lang]
                              )
                            }
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                              selected
                                ? "bg-accent text-accent-content border-accent shadow-sm"
                                : "bg-base-200/70 text-base-content/70 border-base-content/10 hover:border-accent/40 hover:text-accent"
                            }`}
                          >
                            {flag ? (
                              <img
                                src={`https://flagcdn.com/16x12/${flag}.png`}
                                alt={lang}
                                className="rounded-[2px] shrink-0"
                                width={14}
                                height={10}
                              />
                            ) : icon ? (
                              <img src={icon} alt={lang} className="size-3 shrink-0" />
                            ) : null}
                            {lang}
                            {selected && <X className="size-2.5 ml-0.5 opacity-70" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Native/Known Language multi-select */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-secondary">
                      💬 Known Language
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                      {LANGUAGES.map((lang) => {
                        const selected = filterNative.includes(lang);
                        const key = lang.toLowerCase();
                        const flag = LANGUAGE_TO_FLAG[key];
                        const icon = LANGUAGE_TO_ICON[key];
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() =>
                              setFilterNative((prev) =>
                                selected
                                  ? prev.filter((l) => l !== lang)
                                  : [...prev, lang]
                              )
                            }
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                              selected
                                ? "bg-secondary text-secondary-content border-secondary shadow-sm"
                                : "bg-base-200/70 text-base-content/70 border-base-content/10 hover:border-secondary/40 hover:text-secondary"
                            }`}
                          >
                            {flag ? (
                              <img
                                src={`https://flagcdn.com/16x12/${flag}.png`}
                                alt={lang}
                                className="rounded-[2px] shrink-0"
                                width={14}
                                height={10}
                              />
                            ) : icon ? (
                              <img src={icon} alt={lang} className="size-3 shrink-0" />
                            ) : null}
                            {lang}
                            {selected && <X className="size-2.5 ml-0.5 opacity-70" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Active filter summary chips */}
                {(filterLearning.length > 0 || filterNative.length > 0) && (
                  <div className="pt-3 border-t border-base-content/10 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-base-content/50 mr-1">Active:</span>
                    {filterLearning.map((l) => (
                      <span key={`l-${l}`} className="flex items-center gap-1 px-2.5 py-1 bg-accent/15 text-accent border border-accent/25 rounded-xl text-[10px] font-bold">
                        🎯 {l}
                        <button onClick={() => setFilterLearning((p) => p.filter((x) => x !== l))} className="cursor-pointer opacity-60 hover:opacity-100">
                          <X className="size-2.5" />
                        </button>
                      </span>
                    ))}
                    {filterNative.map((l) => (
                      <span key={`n-${l}`} className="flex items-center gap-1 px-2.5 py-1 bg-secondary/15 text-secondary border border-secondary/25 rounded-xl text-[10px] font-bold">
                        💬 {l}
                        <button onClick={() => setFilterNative((p) => p.filter((x) => x !== l))} className="cursor-pointer opacity-60 hover:opacity-100">
                          <X className="size-2.5" />
                        </button>
                      </span>
                    ))}
                    <span className="text-[10px] text-base-content/50 ml-auto font-semibold">
                      {filteredExploreUsers.length} result{filteredExploreUsers.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 3. PERFECTLY ALIGNED MONOCHROME GRID ── */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <SkeletonUserCard key={i} />
              ))}
            </div>
          ) : activeTab === "network" ? (
            /* TAB 1: MY NETWORK */
            filteredFriends.length === 0 ? (
              <motion.div
                key="empty-network"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 text-center bg-base-100 rounded-3xl border border-base-content/10 shadow-2xs max-w-md mx-auto my-8 space-y-4"
              >
                <div className="size-16 rounded-3xl bg-base-200 text-base-content flex items-center justify-center mx-auto border border-base-content/10">
                  <UsersIcon className="size-8" />
                </div>
                <div>
                  <h3 className="font-curly text-2xl font-bold text-base-content">
                    {searchQuery || onlineOnly ? "No matching friends" : "Your network is quiet"}
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium mt-1">
                    {searchQuery || onlineOnly
                      ? "Try clearing search keywords or active filters."
                      : "Start discovering learners and build your study network today!"}
                  </p>
                </div>
                {!searchQuery && !onlineOnly && (
                  <button
                    onClick={() => handleTabChange("explore")}
                    className="btn btn-primary btn-sm font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer"
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch"
              >
                {filteredFriends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </motion.div>
            )
          ) : activeTab === "explore" ? (
            /* TAB 2: EXPLORE LEARNERS */
            filteredExploreUsers.length === 0 ? (
              <motion.div
                key="empty-explore"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 text-center bg-base-100 rounded-3xl border border-base-content/10 shadow-2xs max-w-md mx-auto my-8 space-y-4"
              >
                <div className="size-16 rounded-3xl bg-base-200 text-base-content flex items-center justify-center mx-auto border border-base-content/10">
                  <Globe className="size-8" />
                </div>
                <div>
                  <h3 className="font-curly text-2xl font-bold text-base-content">
                    {searchQuery || onlineOnly ? "No matching learners" : "All caught up!"}
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium mt-1">
                    {searchQuery || onlineOnly
                      ? "Try clearing search keywords or active filters."
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch"
              >
                {filteredExploreUsers.map((user) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                  const isUserOnline =
                    user.lastActive && new Date() - new Date(user.lastActive) <= 5 * 60 * 1000;

                  return (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      className="bg-base-100 rounded-3xl border border-base-content/10 hover:border-primary/30 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden group font-minimal select-none"
                    >
                      <div className="p-5 flex flex-col justify-between h-full space-y-4">
                        {/* ── USER HEADER ── */}
                        <div className="flex items-center gap-3.5 h-14">
                          <Link
                            to={`/user/${user._id}`}
                            className="relative shrink-0 group-hover:scale-105 transition-transform duration-300"
                          >
                            <div className="size-14 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-sm">
                              <div className="size-full rounded-[0.85rem] bg-base-100 text-base-content flex items-center justify-center font-black text-lg overflow-hidden relative">
                                <span className="absolute inset-0 flex items-center justify-center font-bold text-primary">
                                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                                {user.profilePic && (
                                  <img
                                    src={user.profilePic}
                                    alt={user.fullName}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            {isUserOnline && (
                              <span
                                className="absolute -bottom-0.5 -right-0.5 z-10 size-3.5 rounded-full bg-emerald-500 ring-2 ring-base-100 shadow-sm animate-pulse"
                                title="Online"
                              />
                            )}
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/user/${user._id}`}
                              className="font-extrabold text-base text-base-content tracking-tight group-hover:text-primary transition-colors truncate block"
                            >
                              {user.fullName}
                            </Link>

                            {user.location ? (
                              <div className="flex items-center text-xs font-medium text-base-content/60 gap-1 mt-0.5 truncate">
                                <MapPinIcon className="size-3.5 text-primary shrink-0 opacity-80" />
                                <span className="truncate">{user.location}</span>
                              </div>
                            ) : (
                              <div className="text-[11px] font-semibold text-base-content/40 mt-0.5">
                                Community Learner
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ── LANGUAGES TAGS (FIXED MIN HEIGHT FOR ALIGNMENT) ── */}
                        <div className="min-h-[38px] flex flex-wrap items-center gap-1.5">
                          {user.nativeLanguage ? (
                            <span className="px-2.5 py-1 bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-extrabold rounded-xl flex items-center gap-1 shadow-2xs">
                              {getLanguageIcon(user.nativeLanguage)}
                              Native: {capitalize(user.nativeLanguage)}
                            </span>
                          ) : null}

                          {user.learningLanguage ? (
                            <span className="px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 text-[10px] font-extrabold rounded-xl flex items-center gap-1 shadow-2xs">
                              {getLanguageIcon(user.learningLanguage)}
                              Learning: {capitalize(user.learningLanguage)}
                            </span>
                          ) : null}

                          {!user.nativeLanguage && !user.learningLanguage && (
                            <span className="text-[10px] font-medium text-base-content/30 italic">
                              No language preferences set
                            </span>
                          )}
                        </div>

                        {/* ── BIO BOX (FIXED HEIGHT FOR ALIGNMENT) ── */}
                        <div className="h-12 flex items-center">
                          {user.bio ? (
                            <p className="text-xs font-medium text-base-content/70 line-clamp-2 bg-base-200/50 p-2.5 rounded-xl border border-base-content/5 w-full italic">
                              "{user.bio}"
                            </p>
                          ) : (
                            <div className="text-[11px] font-medium text-base-content/30 italic w-full">
                              No bio added yet.
                            </div>
                          )}
                        </div>

                        {/* ── ACTION BUTTONS ── */}
                        <div className="pt-3 border-t border-base-content/10 flex items-center gap-2 mt-auto">
                          {hasRequestBeenSent ? (
                            <button
                              className="flex-1 h-10 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-base-200 text-base-content hover:bg-base-300 border border-base-content/20 transition-all cursor-pointer"
                              onClick={() => handleCancelRequest(user._id)}
                              disabled={loadingIds.has(user._id)}
                            >
                              {loadingIds.has(user._id) ? (
                                <span className="w-4 h-4 border-2 border-base-content/30 border-t-base-content rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Undo2 className="size-3.5" />
                                  <span>Unsend</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              className="flex-1 h-10 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-primary text-primary-content hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
                              onClick={() => handleSendRequest(user._id)}
                              disabled={loadingIds.has(user._id)}
                            >
                              {loadingIds.has(user._id) ? (
                                <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                              ) : (
                                <>
                                  <UserPlusIcon className="size-3.5" />
                                  <span>Connect</span>
                                </>
                              )}
                            </button>
                          )}

                          <Link
                            to={`/user/${user._id}`}
                            className="h-10 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center bg-base-200 hover:bg-base-300 text-base-content border border-base-content/10 transition-all"
                            title="View Profile"
                          >
                            <User className="size-4" />
                          </Link>
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
                className="p-12 text-center bg-base-100 rounded-3xl border border-base-content/10 shadow-2xs max-w-md mx-auto my-8 space-y-4"
              >
                <div className="size-16 rounded-3xl bg-base-200 text-base-content flex items-center justify-center mx-auto border border-base-content/10">
                  <Send className="size-8" />
                </div>
                <div>
                  <h3 className="font-curly text-2xl font-bold text-base-content">
                    {searchQuery || onlineOnly ? "No matching sent requests" : "No pending requests"}
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium mt-1">
                    {searchQuery || onlineOnly
                      ? "Try clearing search keywords or active filters."
                      : "You haven't sent any pending friend requests."}
                  </p>
                </div>
                {!searchQuery && !onlineOnly && (
                  <button
                    onClick={() => handleTabChange("explore")}
                    className="btn bg-base-content text-base-100 hover:opacity-90 border-none btn-sm font-black uppercase tracking-wider text-xs rounded-xl shadow-xs"
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch"
              >
                {filteredSentUsers.map((user) => {
                  const isUserOnline =
                    user.lastActive && new Date() - new Date(user.lastActive) <= 5 * 60 * 1000;

                  return (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      className="bg-base-100 rounded-3xl border border-base-content/10 hover:border-base-content/30 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden group font-minimal select-none"
                    >
                      <div className="p-5 flex flex-col justify-between h-full space-y-4">
                        {/* ── USER HEADER ── */}
                        <div className="flex items-center gap-3.5 h-14">
                          <Link
                            to={`/user/${user._id}`}
                            className="relative shrink-0 group-hover:scale-105 transition-transform duration-300"
                          >
                            <div className="size-14 rounded-2xl bg-base-content p-0.5 shadow-sm">
                              <div className="size-full rounded-[0.85rem] bg-base-100 text-base-content flex items-center justify-center font-black text-lg overflow-hidden relative">
                                <span className="absolute inset-0 flex items-center justify-center font-bold text-base-content">
                                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                                </span>
                                {user.profilePic && (
                                  <img
                                    src={user.profilePic}
                                    alt={user.fullName}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            {isUserOnline && (
                              <span
                                className="absolute -bottom-0.5 -right-0.5 z-10 size-3.5 rounded-full bg-emerald-500 ring-2 ring-base-100 shadow-sm animate-pulse"
                                title="Online"
                              />
                            )}
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/user/${user._id}`}
                              className="font-extrabold text-base text-base-content tracking-tight hover:underline transition-colors truncate block"
                            >
                              {user.fullName}
                            </Link>

                            {user.location ? (
                              <div className="flex items-center text-xs font-medium text-base-content/60 gap-1 mt-0.5 truncate">
                                <MapPinIcon className="size-3.5 text-base-content/70 shrink-0" />
                                <span className="truncate">{user.location}</span>
                              </div>
                            ) : (
                              <div className="text-[11px] font-semibold text-base-content/40 mt-0.5">
                                Pending Partner
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ── LANGUAGES TAGS (FIXED MIN HEIGHT FOR ALIGNMENT) ── */}
                        <div className="min-h-[38px] flex flex-wrap items-center gap-1.5">
                          {user.nativeLanguage ? (
                            <span className="px-2.5 py-1 bg-base-200 text-base-content text-[10px] font-extrabold rounded-xl flex items-center gap-1 border border-base-content/10 shadow-2xs">
                              {getLanguageIcon(user.nativeLanguage)}
                              Native: {capitalize(user.nativeLanguage)}
                            </span>
                          ) : null}

                          {user.learningLanguage ? (
                            <span className="px-2.5 py-1 bg-base-200 text-base-content text-[10px] font-extrabold rounded-xl flex items-center gap-1 border border-base-content/10 shadow-2xs">
                              {getLanguageIcon(user.learningLanguage)}
                              Learning: {capitalize(user.learningLanguage)}
                            </span>
                          ) : null}

                          {!user.nativeLanguage && !user.learningLanguage && (
                            <span className="text-[10px] font-medium text-base-content/30 italic">
                              No language preferences set
                            </span>
                          )}
                        </div>

                        {/* ── BIO BOX (FIXED HEIGHT FOR ALIGNMENT) ── */}
                        <div className="h-12 flex items-center">
                          {user.bio ? (
                            <p className="text-xs font-medium text-base-content/70 line-clamp-2 bg-base-200/50 p-2.5 rounded-xl border border-base-content/5 w-full italic">
                              "{user.bio}"
                            </p>
                          ) : (
                            <div className="text-[11px] font-medium text-base-content/30 italic w-full">
                              No bio added yet.
                            </div>
                          )}
                        </div>

                        {/* ── ACTION BUTTONS ── */}
                        <div className="pt-3 border-t border-base-content/10 flex items-center gap-2 mt-auto">
                          <button
                            className="flex-1 h-10 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-base-200 text-base-content hover:bg-base-300 border border-base-content/20 transition-all cursor-pointer"
                            onClick={() => handleCancelRequest(user._id)}
                            disabled={loadingIds.has(user._id)}
                          >
                            {loadingIds.has(user._id) ? (
                              <span className="w-4 h-4 border-2 border-base-content/30 border-t-base-content rounded-full animate-spin" />
                            ) : (
                              <>
                                <Undo2 className="size-3.5" />
                                <span>Unsend Request</span>
                              </>
                            )}
                          </button>

                          <Link
                            to={`/user/${user._id}`}
                            className="h-10 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center bg-base-200 hover:bg-base-300 text-base-content border border-base-content/10 transition-all"
                            title="View Profile"
                          >
                            <User className="size-4" />
                          </Link>
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
