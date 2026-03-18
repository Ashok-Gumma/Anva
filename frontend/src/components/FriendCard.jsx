import { Link } from "react-router";
import { LANGUAGE_TO_FLAG, LANGUAGE_TO_ICON } from "../constants";
import { MapPinIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  if (!friend) return null;

  const isOnline = friend.lastActive && (new Date() - new Date(friend.lastActive)) <= 3 * 60 * 1000;

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-2">
          {/* Avatar with letter fallback */}
          <Link to={`/user/${friend._id}`} className={`avatar ${isOnline ? 'online' : 'offline'} hover:opacity-80 transition-opacity`}>
            <div className="relative w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg overflow-hidden border border-base-content/10">
              {/* Letter fallback */}
              <span className="absolute inset-0 flex items-center justify-center">
                {friend.fullName?.charAt(0)?.toUpperCase()}
              </span>

              {/* Profile image */}
              {friend.profilePic && (
                <img
                  src={friend.profilePic}
                  alt={friend.fullName}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
          </Link>

          <div>
            <Link to={`/user/${friend._id}`} className="font-semibold truncate hover:underline hover:text-primary transition-colors block">
              {friend.fullName}
            </Link>

            {/* CITY */}
            {friend.location && (
              <div className="flex items-center text-xs opacity-70">
                <MapPinIcon className="size-3 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {friend.nativeLanguage && (
            <span className="badge badge-secondary text-xs">
              {getLanguageIcon(friend.nativeLanguage)}
              Native: {friend.nativeLanguage}
            </span>
          )}
          {friend.learningLanguage && (
            <span className="badge badge-outline text-xs">
              {getLanguageIcon(friend.learningLanguage)}
              Learning: {friend.learningLanguage}
            </span>
          )}
        </div>

        {/* BIO */}
        {friend.bio && (
          <p className="text-sm opacity-70 line-clamp-2 mb-3">
            {friend.bio}
          </p>
        )}

        {/* SOCIAL LINKS */}
        {(friend.githubUrl || friend.linkedinUrl) && (
          <div className="flex gap-2 mb-3">
            {friend.githubUrl && (
              <a href={friend.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-circle btn-ghost text-base-content hover:bg-base-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            )}
            {friend.linkedinUrl && (
              <a href={friend.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-circle btn-ghost text-[#0077b5] hover:bg-base-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            )}
          </div>
        )}

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

/* ICON RESOLVER */
export function getLanguageIcon(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();

  if (LANGUAGE_TO_FLAG[langLower]) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${LANGUAGE_TO_FLAG[langLower]}.png`}
        className="h-3 mr-1 inline-block"
        alt={language}
        loading="lazy"
      />
    );
  }

  if (LANGUAGE_TO_ICON[langLower]) {
    return (
      <img
        src={LANGUAGE_TO_ICON[langLower]}
        className="h-4 mr-1 inline-block"
        alt={language}
        loading="lazy"
      />
    );
  }

  return null;
}
