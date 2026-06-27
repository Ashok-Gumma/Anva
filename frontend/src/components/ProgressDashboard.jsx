import useAuthUser from "../hooks/useAuthUser";
import { capitalize } from "../lib/utils";
import { getLanguageIcon } from "./FriendCard";
import { motion } from "framer-motion";

/**
 * Progress Dashboard - shown at the top of HomePage
 * Displays active learning language details.
 */
const ProgressDashboard = () => {
  const { authUser } = useAuthUser();

  if (!authUser) return null;

  return (
    <div className="flex justify-center w-full">
      {/* Language Pair */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 rounded-2xl border border-accent/15 bg-base-100 hover:shadow-md transition-all flex flex-col justify-between w-full max-w-md shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/10 shrink-0 shadow-sm flex items-center justify-center text-accent">
            {getLanguageIcon(authUser.learningLanguage) ? (
              <span className="size-5 flex items-center justify-center select-none">
                {getLanguageIcon(authUser.learningLanguage)}
              </span>
            ) : (
              <span className="text-sm">📚</span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-base-content/40 uppercase tracking-wider leading-none mb-1">
              Active Focus
            </p>
            <p className="font-extrabold text-base text-base-content leading-none">
              {capitalize(authUser.learningLanguage) || "—"}
            </p>
          </div>
        </div>

        {/* Translation Pair Display */}
        <div className="mt-4 flex items-center justify-center gap-2.5 bg-accent/5 py-1.5 px-3 rounded-xl border border-accent/10">
          <span className="text-xs font-bold text-base-content/65 uppercase tracking-wide flex items-center gap-1">
            {getLanguageIcon(authUser.nativeLanguage)}
            {capitalize(authUser.nativeLanguage)?.slice(0, 3)}
          </span>
          <span className="text-[10px] text-accent font-black animate-pulse">➔</span>
          <span className="text-xs font-bold text-accent uppercase tracking-wide flex items-center gap-1">
            {getLanguageIcon(authUser.learningLanguage)}
            {capitalize(authUser.learningLanguage)?.slice(0, 3)}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;

