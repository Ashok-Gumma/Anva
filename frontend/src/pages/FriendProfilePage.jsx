import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, unfriend, blockUser, unblockUser, sendFriendRequest } from "../lib/api";
import { MapPinIcon, Github, Linkedin, ArrowLeftIcon, MessageCircleIcon, UserMinusIcon, SlashIcon, UserPlusIcon, CheckCircleIcon } from "lucide-react";
import PageLoader from "../components/PageLoader";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";

const FriendProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id),
  });

  const unfriendMutation = useMutation({
    mutationFn: () => unfriend(id),
    onSuccess: () => {
      toast.success("Unfriended successfully");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
      navigate("/friends");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to unfriend");
    },
  });

  const blockMutation = useMutation({
    mutationFn: () => blockUser(id),
    onSuccess: () => {
      toast.success("User blocked successfully");
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to block user");
    },
  });

  const unblockMutation = useMutation({
    mutationFn: () => unblockUser(id),
    onSuccess: () => {
      toast.success("User unblocked successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    },
  });

  const addFriendMutation = useMutation({
    mutationFn: () => sendFriendRequest(id),
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
  });

  if (isLoading) return <PageLoader />;
  if (isError || !user) return <div className="p-8 text-center text-error">Could not load profile.</div>;

  const isOnline = user.lastActive && (new Date() - new Date(user.lastActive)) <= 3 * 60 * 1000;

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card bg-base-100 shadow-xl w-full max-w-2xl border border-base-content/10">
        
        {/* Header Ribbon */}
        <div className="bg-primary/10 h-32 w-full rounded-t-2xl relative flex items-start p-4">
          <button onClick={() => window.history.back()} className="btn btn-sm btn-circle btn-ghost bg-base-100/50 hover:bg-base-100 backdrop-blur">
            <ArrowLeftIcon className="size-4" />
          </button>
        </div>

        <div className="card-body px-8 pt-0 flex flex-col items-center relative -mt-16">
          
          {/* Avatar */}
          <div className={`avatar ${isOnline ? 'online' : 'offline'} mb-4`}>
            <div className="relative w-32 h-32 rounded-full border-4 border-base-100 bg-base-200 text-3xl font-bold flex items-center justify-center overflow-hidden shadow-lg">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.fullName} className="object-cover w-full h-full" />
              ) : (
                <span>{user.fullName?.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center">{user.fullName}</h2>
          
          {user.location && (
            <div className="flex items-center text-sm opacity-70 mt-1">
              <MapPinIcon className="size-4 mr-1" />
              {user.location}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6 w-full justify-center">
            {/* Show different buttons based on relationship status */}
            {/* Only show friendship actions if they are friends AND not blocked */}
            {authUser?.friends?.some(fId => fId.toString() === id) && !authUser?.blockedUsers?.some(bId => bId.toString() === id) ? (
              <>
                <Link to={`/chat/${user._id}`} className="btn btn-primary px-8 shadow-sm rounded-full">
                  <MessageCircleIcon className="size-5 mr-2" />
                  Message
                </Link>
                
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to unfriend this user?")) {
                      unfriendMutation.mutate();
                    }
                  }}
                  disabled={unfriendMutation.isPending}
                  className="btn btn-outline btn-error px-8 rounded-full"
                >
                  <UserMinusIcon className="size-5 mr-2" />
                  {unfriendMutation.isPending ? "Unfriending..." : "Unfriend"}
                </button>
              </>
            ) : !authUser?.blockedUsers?.some(bId => bId.toString() === id) && !authUser?.friends?.some(fId => fId.toString() === id) ? (
              <button 
                onClick={() => addFriendMutation.mutate()}
                disabled={addFriendMutation.isPending}
                className="btn btn-primary px-8 rounded-full"
              >
                <UserPlusIcon className="size-5 mr-2" />
                {addFriendMutation.isPending ? "Sending..." : "Add Friend"}
              </button>
            ) : null}

            {/* Block/Unblock Button */}
            {authUser?.blockedUsers?.some(bId => bId.toString() === id) ? (
              <button 
                onClick={() => unblockMutation.mutate()}
                disabled={unblockMutation.isPending}
                className="btn btn-outline btn-success px-8 rounded-full"
              >
                <CheckCircleIcon className="size-5 mr-2" />
                {unblockMutation.isPending ? "Unblocking..." : "Unblock"}
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to block this user?")) {
                    blockMutation.mutate();
                  }
                }}
                disabled={blockMutation.isPending}
                className="btn btn-ghost text-error px-8 rounded-full border border-error/20 hover:bg-error/10"
              >
                <SlashIcon className="size-5 mr-2" />
                {blockMutation.isPending ? "Blocking..." : "Block"}
              </button>
            )}
          </div>

          <div className="divider w-full"></div>

          <div className="w-full space-y-6">
            
            {/* Bio */}
            <div>
              <h3 className="text-lg font-semibold opacity-80 mb-2">About Me</h3>
              <p className="p-4 bg-base-200/50 rounded-xl leading-relaxed text-sm">
                {user.bio || "This user hasn't written a bio yet."}
              </p>
            </div>

            {/* Languages */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-base-200/50 rounded-xl">
                <h4 className="text-sm font-semibold opacity-70 mb-1">Native Language</h4>
                <div className="badge badge-secondary p-3 w-full justify-start text-sm capitalize">
                  {user.nativeLanguage || "Not Set"}
                </div>
              </div>
              <div className="p-4 bg-base-200/50 rounded-xl">
                <h4 className="text-sm font-semibold opacity-70 mb-1">Learning Language</h4>
                <div className="badge badge-outline p-3 w-full justify-start text-sm capitalize">
                  {user.learningLanguage || "Not Set"}
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(user.githubUrl || user.linkedinUrl) && (
              <div>
                <h3 className="text-lg font-semibold opacity-80 mb-3">Connect</h3>
                <div className="flex gap-3">
                  {user.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline flex-1 gap-2 border-base-content/20 bg-base-200/30">
                      <Github className="size-5" />
                      GitHub
                    </a>
                  )}
                  {user.linkedinUrl && (
                    <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-outline flex-1 gap-2 border-base-content/20 bg-base-200/30 text-[#0077B5] hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]">
                      <Linkedin className="size-5" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
export default FriendProfilePage;
