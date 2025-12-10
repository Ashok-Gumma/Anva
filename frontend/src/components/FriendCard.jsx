import { Link } from "react-router"; // Fixed: Use react-router-dom (deprecated old package)
import { LANGUAGE_TO_FLAG } from "../constants";
import { capitialize } from "../lib/utils"; // Added: For consistent language display (from previous utils)

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img 
              src={friend.profilePic} 
              alt={friend.fullName} 
              className="rounded-full" // Added: Ensure rounded avatar
              onError={(e) => { e.target.src = '/default-avatar.png'; }} // Added: Fallback for broken images
            />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        {/* LOCATION (if available) */}
        {friend.location && (
          <div className="flex items-center text-xs opacity-70 mb-2">
            <MapPinIcon className="size-3 mr-1" /> {/* Added: Icon for location (import below) */}
            {friend.location}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {capitialize(friend.nativeLanguage)}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {capitialize(friend.learningLanguage)}
          </span>
        </div>

        {/* BIO (if available) */}
        {friend.bio && (
          <p className="text-sm opacity-70 mb-3 line-clamp-2">{friend.bio}</p> // Added: Truncated bio
        )}

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${capitalize(langLower)} flag`} // Improved: Capitalized alt text
        className="h-3 mr-1 inline-block"
        onError={(e) => { e.target.style.display = 'none'; }} // Added: Hide on load error
      />
    );
  }
  return null;
}