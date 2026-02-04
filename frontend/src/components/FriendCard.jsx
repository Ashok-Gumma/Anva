import { Link } from "react-router";
import { LANGUAGE_TO_FLAG, LANGUAGE_TO_ICON } from "../constants";
import { MapPinIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  if (!friend) return null;

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-2">
          {/* Avatar with letter fallback */}
          <div className="relative size-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg overflow-hidden">
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

          <div>
            <h3 className="font-semibold truncate">{friend.fullName}</h3>

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
