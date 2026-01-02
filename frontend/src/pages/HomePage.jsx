import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
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
import { capitalize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [sendingToId, setSendingToId] = useState(null);

  /* ---------------- FRIENDS ---------------- */
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["userFriends"],
    queryFn: getUserFriends,
  });

  /* ---------------- RECOMMENDED USERS ---------------- */
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
  });

  /* ---------------- OUTGOING REQUESTS ---------------- */
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendReqs,
  });

  /* ---------------- DERIVED SET (SAFE) ---------------- */
  const outgoingRequestsIds = useMemo(() => {
    return new Set(
      outgoingFriendReqs
        ?.filter((req) => req?.recipient?._id)
        .map((req) => req.recipient._id)
    );
  }, [outgoingFriendReqs]);

  /* ---------------- SEND FRIEND REQUEST ---------------- */
  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (userId) => setSendingToId(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
      setSendingToId(null);
    },
    onError: () => setSendingToId(null),
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-3xl font-bold">Your Friends</h2>
          <div className="flex gap-2">
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
            <Link to="/flashcards" className="btn btn-primary btn-sm">
              📚 Flashcards
            </Link>
          </div>
        </div>

        {/* FRIENDS */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* RECOMMENDED USERS */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Meet New Learners</h2>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasSent = outgoingRequestsIds.has(user._id);
                const isSending = sendingToId === user._id;

                return (
                  <div key={user._id} className="card bg-base-200">
                    <div className="card-body space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePic || "/default-avatar.png"}
                          className="size-16 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex text-xs opacity-70">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)} Native:{" "}
                          {capitalize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)} Learning:{" "}
                          {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      <button
                        className={`btn w-full ${
                          hasSent ? "btn-disabled" : "btn-primary"
                        }`}
                        disabled={hasSent || isSending}
                        onClick={() => sendRequestMutation(user._id)}
                      >
                        {hasSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            {isSending ? "Sending..." : "Send Friend Request"}
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
