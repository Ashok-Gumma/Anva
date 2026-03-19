import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { capitalize } from "../lib/utils";
import FriendCard, { getLanguageIcon } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const HomePage = () => {
  const queryClient = useQueryClient();

  /* ================= FRIENDS ================= */
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  /* ================= RECOMMENDED USERS ================= */
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  /* ================= OUTGOING REQUESTS ================= */
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  /* ================= DERIVED STATE (NO LOOP) ================= */
  const outgoingRequestsIds = useMemo(() => {
    const ids = new Set();
    outgoingFriendReqs.forEach((req) => {
      if (req?.recipient?._id) {
        ids.add(req.recipient._id);
      }
    });
    return ids;
  }, [outgoingFriendReqs]);

  /* ================= FRIEND REQUEST MUTATION (OPTIMISTIC) ================= */
  const [loadingIds, setLoadingIds] = useState(new Set());

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["outgoingFriendReqs"] });

      // ✅ Optimistic cache update
      queryClient.setQueryData(["outgoingFriendReqs"], (old = []) => [
        ...old,
        { recipient: { _id: userId } },
      ]);
    },

    onError: (err, userId) => {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
      toast.error(err.response?.data?.message || "Failed to send friend request");
    },

    onSuccess: (data, userId) => {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div 
        className="container mx-auto space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        {/* ================= FRIENDS HEADER ================= */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
            Your Friends
          </h2>

          <div className="flex gap-3 flex-wrap">
            <Link to="/notifications" className="px-4 py-2 border border-base-content/10 rounded-xl bg-base-100 text-base-content hover:bg-base-200 font-medium flex items-center shadow-sm transition-colors cursor-pointer">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>

            <Link to="/flashcards" className="px-4 py-2 rounded-xl bg-primary text-primary-content hover:opacity-90 font-medium flex items-center shadow-md transition-opacity cursor-pointer">
              📚 Flashcards
            </Link>
          </div>
        </motion.div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="w-8 h-8 border-4 border-base-content/10 border-t-primary rounded-full animate-spin" />
          </div>
        ) : friends.length === 0 ? (
          <motion.div variants={itemVariants}>
            <NoFriendsFound />
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" variants={containerVariants}>
            {friends.map((friend) => (
              <motion.div key={friend._id} variants={itemVariants}>
                <FriendCard friend={friend} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ================= RECOMMENDED USERS ================= */}
        <motion.section variants={itemVariants}>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
              Meet New Learners
            </h2>
            <p className="text-base-content/70 font-medium">
              Discover perfect language exchange partners
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="w-8 h-8 border-4 border-base-content/10 border-t-primary rounded-full animate-spin" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="bg-base-100 border border-base-content/10 p-8 text-center rounded-[2rem] shadow-sm">
              <h3 className="font-semibold text-xl text-base-content">
                No recommendations available
              </h3>
              <p className="text-base-content/60 font-medium mt-1">
                Check back later for new partners!
              </p>
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <motion.div
                    key={user._id}
                    variants={itemVariants}
                    className="bg-base-100 rounded-[2rem] shadow-sm border border-base-content/10 hover:shadow-md transition-shadow overflow-hidden group"
                  >
                    <div className="p-6 space-y-5">

                      {/* USER INFO */}
                      <div className="flex items-center gap-4">
                        {/* Avatar with letter fallback */}
                        <div className="relative size-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                          <span className="absolute inset-0 flex items-center justify-center">
                            {user.fullName?.charAt(0).toUpperCase()}
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

                        <div>
                          <h3 className="font-bold text-lg text-base-content tracking-tight">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs font-medium text-base-content/60 mt-0.5">
                              <MapPinIcon className="size-3.5 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LANGUAGES */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-lg flex items-center gap-1.5 border border-secondary/20">
                          {getLanguageIcon(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-lg flex items-center gap-1.5 border border-accent/20">
                          {getLanguageIcon(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {/* BIO */}
                      {user.bio && (
                        <p className="text-sm font-medium text-base-content/70 line-clamp-2">{user.bio}</p>
                      )}

                      {/* ACTION */}
                      <button
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all ${
                          hasRequestBeenSent
                            ? "bg-base-300 text-base-content/50 cursor-not-allowed"
                            : "btn-primary shadow-md hover:shadow-lg active:scale-[0.98] text-primary-content"
                        }`}
                        onClick={() => handleSendRequest(user._id)}
                        disabled={hasRequestBeenSent || loadingIds.has(user._id)}
                        style={{
                           // DaisyUI `btn btn-primary` brings in height restrictions, we just manually use the primary background colors here for custom button heights.
                           backgroundColor: !hasRequestBeenSent ? "var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity, 1)))" : undefined
                        }}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : loadingIds.has(user._id) ? (
                          <>
                            <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
};

export default HomePage;
