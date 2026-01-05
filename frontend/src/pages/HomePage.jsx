import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
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
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ["outgoingFriendReqs"] });

      // ✅ Optimistic cache update
      queryClient.setQueryData(["outgoingFriendReqs"], (old = []) => [
        ...old,
        { recipient: { _id: userId } },
      ]);
    },

    onError: () => {
      toast.error("Failed to send friend request");
    },

    onSuccess: () => {
      toast.success("Friend request sent 🚀");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">

        {/* ================= FRIENDS HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>

          <div className="flex gap-3 flex-wrap">
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>

            <Link to="/flashcards" className="btn btn-primary btn-sm">
              📚 Flashcards
            </Link>
          </div>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* ================= RECOMMENDED USERS ================= */}
        <section>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Meet New Learners
            </h2>
            <p className="opacity-70">
              Discover perfect language exchange partners
            </p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg">
                No recommendations available
              </h3>
              <p className="opacity-70">
                Check back later for new partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all"
                  >
                    <div className="card-body p-5 space-y-4">

                      {/* USER INFO */}
                      <div className="flex items-center gap-3">
                        {/* Avatar with letter fallback */}
                        <div className="relative size-16 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xl overflow-hidden">
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
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LANGUAGES */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageIcon(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageIcon(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {/* BIO */}
                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* ACTION */}
                      <button
                        className={`btn w-full ${
                          hasRequestBeenSent
                            ? "btn-disabled"
                            : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
