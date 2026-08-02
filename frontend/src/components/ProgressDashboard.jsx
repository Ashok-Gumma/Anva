import useAuthUser from "../hooks/useAuthUser";
import { capitalize } from "../lib/utils";
import { getLanguageIcon } from "./FriendCard";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { getRandomLanguageQuote } from "../lib/languageQuotes";

/**
 * Progress Dashboard - shown at the top of HomePage
 * Displays active learning language details.
 */
const ProgressDashboard = () => {
  const { authUser } = useAuthUser();

  const dailyQuote = useMemo(() => {
    if (!authUser?.learningLanguage) return "";
    return getRandomLanguageQuote(authUser.learningLanguage);
  }, [authUser?.learningLanguage]);

  if (!authUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative group h-full p-6 rounded-[2rem] bg-gradient-to-b from-base-100/80 to-base-200/50 backdrop-blur-xl border border-base-content/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(var(--color-accent),0.1)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 size-32 bg-accent/20 rounded-full blur-[40px] group-hover:bg-accent/30 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 shrink-0 shadow-inner flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
            {getLanguageIcon(authUser.learningLanguage) ? (
              <span className="size-6 flex items-center justify-center select-none text-xl">
                {getLanguageIcon(authUser.learningLanguage)}
              </span>
            ) : (
              <span className="text-xl">📚</span>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-base-content/40 uppercase tracking-widest leading-none mb-1.5">
              Active Focus
            </p>
            <p className="font-black text-xl text-base-content leading-none tracking-tight">
              {capitalize(authUser.learningLanguage) || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Language-specific Motivational Quote */}
      {dailyQuote && (
        <div className="mt-4 flex-1 flex flex-col justify-center border-l-2 border-accent/20 pl-3">
          <p className="text-xs font-medium italic text-base-content/70 leading-relaxed">
            "{dailyQuote}"
          </p>
        </div>
      )}

      {/* Translation Pair Display */}
      <div className="mt-6 relative z-10 flex items-center justify-between bg-base-100/50 backdrop-blur-md py-3 px-4 rounded-2xl border border-base-content/5 group-hover:border-accent/15 transition-colors">
        <div className="flex flex-col items-start gap-1">
          <span className="text-[9px] font-black uppercase text-base-content/30 tracking-widest">Native</span>
          <span className="text-sm font-bold text-base-content/80 uppercase tracking-wide flex items-center gap-1.5">
            {getLanguageIcon(authUser.nativeLanguage)}
            {capitalize(authUser.nativeLanguage)?.slice(0, 3)}
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <span className="text-xs text-accent font-black animate-pulse my-0.5">➔</span>
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black uppercase text-base-content/30 tracking-widest">Target</span>
          <span className="text-sm font-black text-accent uppercase tracking-wide flex items-center gap-1.5">
            {getLanguageIcon(authUser.learningLanguage)}
            {capitalize(authUser.learningLanguage)?.slice(0, 3)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressDashboard;

