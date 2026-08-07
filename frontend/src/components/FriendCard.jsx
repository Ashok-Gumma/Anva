import { Link } from "react-router";
import { LANGUAGE_TO_FLAG, LANGUAGE_TO_ICON } from "../constants";
import { MapPinIcon, MessageSquare, User } from "lucide-react";
import { capitalize } from "../lib/utils";

const FriendCard = ({ friend }) => {
  if (!friend) return null;

  const isOnline =
    friend.lastActive && new Date() - new Date(friend.lastActive) <= 5 * 60 * 1000;

  return (
    <div className="bg-base-100 rounded-3xl border border-base-content/10 hover:border-primary/30 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden group font-minimal select-none">
      <div className="p-5 flex flex-col justify-between h-full space-y-4">
        {/* ── USER HEADER ── */}
        <div className="flex items-center gap-3.5 h-14">
          <Link
            to={`/user/${friend._id}`}
            className="relative shrink-0 group-hover:scale-105 transition-transform duration-300"
          >
            <div className="size-14 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-sm">
              <div className="size-full rounded-[0.85rem] bg-base-100 text-base-content flex items-center justify-center font-black text-lg overflow-hidden relative">
                <span className="absolute inset-0 flex items-center justify-center font-bold text-primary">
                  {friend.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>

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
            </div>
            {isOnline && (
              <span
                className="absolute -bottom-0.5 -right-0.5 z-10 size-3.5 rounded-full bg-emerald-500 ring-2 ring-base-100 shadow-sm animate-pulse"
                title="Online"
              />
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              to={`/user/${friend._id}`}
              className="font-extrabold text-base text-base-content tracking-tight group-hover:text-primary transition-colors truncate block"
            >
              {friend.fullName}
            </Link>

            {friend.location ? (
              <div className="flex items-center text-xs font-medium text-base-content/60 gap-1 mt-0.5 truncate">
                <MapPinIcon className="size-3.5 text-primary shrink-0 opacity-80" />
                <span className="truncate">{friend.location}</span>
              </div>
            ) : (
              <div className="text-[11px] font-semibold text-base-content/40 mt-0.5">
                Connected Peer
              </div>
            )}
          </div>
        </div>

        {/* ── LANGUAGES TAGS (FIXED MIN HEIGHT FOR ALIGNMENT) ── */}
        <div className="min-h-[38px] flex flex-wrap items-center gap-1.5">
          {friend.nativeLanguage ? (
            <span className="px-2.5 py-1 bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-extrabold rounded-xl flex items-center gap-1 shadow-2xs">
              {getLanguageIcon(friend.nativeLanguage)}
              Native: {capitalize(friend.nativeLanguage)}
            </span>
          ) : null}

          {friend.learningLanguage ? (
            <span className="px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 text-[10px] font-extrabold rounded-xl flex items-center gap-1 shadow-2xs">
              {getLanguageIcon(friend.learningLanguage)}
              Learning: {capitalize(friend.learningLanguage)}
            </span>
          ) : null}

          {!friend.nativeLanguage && !friend.learningLanguage && (
            <span className="text-[10px] font-medium text-base-content/30 italic">
              No language preferences set
            </span>
          )}
        </div>

        {/* ── BIO BOX (FIXED HEIGHT FOR ALIGNMENT) ── */}
        <div className="h-12 flex items-center">
          {friend.bio ? (
            <p className="text-xs font-medium text-base-content/70 line-clamp-2 bg-base-200/50 p-2.5 rounded-xl border border-base-content/5 w-full italic">
              "{friend.bio}"
            </p>
          ) : (
            <div className="text-[11px] font-medium text-base-content/30 italic w-full">
              No bio added.
            </div>
          )}
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="pt-3 border-t border-base-content/10 flex items-center gap-2 mt-auto">
          <Link
            to={`/chat/${friend._id}`}
            className="flex-1 h-10 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-primary text-primary-content hover:bg-primary/90 shadow-sm transition-all"
          >
            <MessageSquare className="size-4" />
            <span>Chat</span>
          </Link>

          <Link
            to={`/user/${friend._id}`}
            className="h-10 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center bg-base-200 hover:bg-base-300 text-base-content border border-base-content/10 transition-all"
            title="View Profile"
          >
            <User className="size-4" />
          </Link>
        </div>
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
        className="h-3 mr-1 inline-block rounded-xs"
        alt={language}
        loading="lazy"
      />
    );
  }

  if (LANGUAGE_TO_ICON[langLower]) {
    return (
      <img
        src={LANGUAGE_TO_ICON[langLower]}
        className="h-3.5 mr-1 inline-block"
        alt={language}
        loading="lazy"
      />
    );
  }

  return null;
}
