import { Link } from "react-router";
import { LANGUAGE_TO_FLAG, LANGUAGE_TO_ICON } from "../constants";
import { MapPinIcon } from "lucide-react";
import { capitalize } from "../lib/utils";

const FriendCard = ({ friend }) => {
  if (!friend) return null;

  const isOnline = friend.lastActive && (new Date() - new Date(friend.lastActive)) <= 3 * 60 * 1000;

  return (
    <div className="bg-base-100 rounded-[2rem] shadow-sm border border-base-content/10 hover:shadow-md transition-shadow overflow-hidden group">
      <div className="p-6">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-3">
          {/* Avatar with letter fallback */}
          <Link to={`/user/${friend._id}`} className={`relative z-10 ${isOnline ? 'online' : ''} hover:scale-105 transition-transform`}>
            {isOnline && <span className="absolute -bottom-1 -right-1 z-20 size-3.5 rounded-full bg-info border-2 border-base-100 shadow-sm" />}
            <div className="relative size-14 rounded-2xl bg-primary text-primary-content flex items-center justify-center font-bold text-xl overflow-hidden shadow-sm">
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

          <div className="flex-1 min-w-0">
            <Link to={`/user/${friend._id}`} className="font-bold text-lg text-base-content tracking-tight truncate hover:underline transition-colors block">
              {friend.fullName}
            </Link>

            {/* CITY */}
            {friend.location && (
              <div className="flex items-center text-xs font-medium text-base-content/60 mt-0.5">
                <MapPinIcon className="size-3.5 mr-1" />
                {friend.location}
              </div>
            )}
          </div>
        </div>

        {/* LANGUAGES */}
        <div className="flex flex-wrap gap-2 mb-4">
          {friend.nativeLanguage && (
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-lg flex items-center gap-1.5 border border-secondary/20">
              {getLanguageIcon(friend.nativeLanguage)}
              Native: {capitalize(friend.nativeLanguage)}
            </span>
          )}
          {friend.learningLanguage && (
             <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-lg flex items-center gap-1.5 border border-accent/20">
              {getLanguageIcon(friend.learningLanguage)}
              Learning: {capitalize(friend.learningLanguage)}
            </span>
          )}
        </div>

        {/* BIO */}
        {friend.bio && (
          <p className="text-sm font-medium text-base-content/70 line-clamp-2 mb-4">
            {friend.bio}
          </p>
        )}

        {/* SOCIAL LINKS */}
        {(friend.githubUrl || friend.linkedinUrl) && (
          <div className="flex gap-2 mb-4">
            {friend.githubUrl && (
              <a href={friend.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-base-200 text-base-content/70 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            )}
            {friend.linkedinUrl && (
              <a href={friend.linkedinUrl} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-info/10 text-info transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            )}
          </div>
        )}

        <Link to={`/chat/${friend._id}`} className="w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all bg-base-100 border border-base-content/10 text-base-content shadow-sm hover:bg-base-200 hover:shadow mt-auto">
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
