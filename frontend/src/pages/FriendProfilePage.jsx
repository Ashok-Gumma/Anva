import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../lib/api";
import { MapPinIcon, Github, Linkedin, ArrowLeftIcon, MessageCircleIcon } from "lucide-react";
import PageLoader from "../components/PageLoader";

const FriendProfilePage = () => {
  const { id } = useParams();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id),
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

          <div className="flex gap-4 mt-6 w-full justify-center">
            <Link to={`/chat/${user._id}`} className="btn btn-primary w-40 shadow-sm rounded-full">
              <MessageCircleIcon className="size-5 mr-2" />
              Message
            </Link>
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
