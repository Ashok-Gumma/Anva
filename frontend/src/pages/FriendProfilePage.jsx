import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, unfriend, blockUser, unblockUser, sendFriendRequest, cancelFriendRequest, getOutgoingFriendReqs } from "../lib/api";
import { MapPinIcon, Github, Linkedin, ArrowLeftIcon, MessageCircleIcon, UserMinusIcon, SlashIcon, UserPlusIcon, CheckCircleIcon, Undo2 } from "lucide-react";
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

  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const hasRequestBeenSent = outgoingFriendReqs.some((req) => req?.recipient?._id === id);

  const addFriendMutation = useMutation({
    mutationFn: () => sendFriendRequest(id),
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
  });

  const cancelRequestMutation = useMutation({
    mutationFn: () => cancelFriendRequest(id),
    onSuccess: () => {
      toast.success("Friend request unsent ↩️");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to unsend request");
    },
  });

  if (isLoading) return <PageLoader />;
  if (isError || !user) return <div className="p-8 text-center text-error">Could not load profile.</div>;

  const isOnline = user.lastActive && (new Date() - new Date(user.lastActive)) <= 3 * 60 * 1000;

  return (
    <div className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-ghost btn-sm gap-2 font-semibold text-base-content/70 hover:text-base-content"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        {/* Profile Card */}
        <div className="bg-base-100 rounded-3xl p-6 sm:p-8 shadow-sm border border-base-content/5 space-y-6">
          
          {/* Header section with avatar, name, and actions */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            
            {/* Avatar */}
            <div className="relative">
              <div className="size-28 sm:size-32 rounded-3xl bg-secondary text-secondary-content flex items-center justify-center font-black text-4xl overflow-hidden shadow-inner">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  user.fullName?.charAt(0)?.toUpperCase()
                )}
              </div>
              {isOnline && (
                <span className="absolute bottom-1 right-1 size-5 rounded-full bg-success border-4 border-base-100 shadow-sm" title="Online" />
              )}
            </div>

            {/* Name, Handle, Location */}
            <div className="space-y-2 flex-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{user.fullName}</h1>
              
              {user.location && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-base-content/60">
                  <MapPinIcon className="size-3.5 text-primary" />
                  {user.location}
                </div>
              )}

              {/* Language Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {user.nativeLanguage && (
                  <span className="badge badge-secondary badge-outline text-xs font-bold gap-1">
                    Native: {user.nativeLanguage}
                  </span>
                )}
                {user.learningLanguage && (
                  <span className="badge badge-accent badge-outline text-xs font-bold gap-1">
                    Learning: {user.learningLanguage}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
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
              hasRequestBeenSent ? (
                <button 
                  onClick={() => cancelRequestMutation.mutate()}
                  disabled={cancelRequestMutation.isPending}
                  className="btn btn-outline btn-error px-8 rounded-full"
                >
                  <Undo2 className="size-5 mr-2" />
                  {cancelRequestMutation.isPending ? "Unsending..." : "Unsend Request"}
                </button>
              ) : (
                <button 
                  onClick={() => addFriendMutation.mutate()}
                  disabled={addFriendMutation.isPending}
                  className="btn btn-primary px-8 rounded-full"
                >
                  <UserPlusIcon className="size-5 mr-2" />
                  {addFriendMutation.isPending ? "Sending..." : "Add Friend"}
                </button>
              )
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
