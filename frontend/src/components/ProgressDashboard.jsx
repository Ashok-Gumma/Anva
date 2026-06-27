import useAuthUser from "../hooks/useAuthUser";
import { capitalize } from "../lib/utils";
import { getLanguageIcon } from "./FriendCard";
import { motion } from "framer-motion";
import { FlameIcon, UsersIcon, BookOpenIcon } from "lucide-react";

/**
 * Progress Dashboard - shown at the top of HomePage
 * Displays interactive learning streak calendar, study time metrics, and XP level calculations.
 */
const ProgressDashboard = ({ xp = 1240, studyTimeToday = 15, streak = 5 }) => {
  const { authUser } = useAuthUser();

  if (!authUser) return null;

  // Level computation: Every 500 XP is a level
  const userLevel = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const xpProgressPercent = (currentLevelXp / 500) * 100;
  const nextLevelXpNeeded = 500 - currentLevelXp;

  // Daily goal: 20 minutes
  const dailyGoalPercent = Math.min((studyTimeToday / 20) * 100, 100);

  // Weekdays for the streak calendar
  const weekDays = [
    { label: "M", active: true },
    { label: "T", active: true },
    { label: "W", active: true },
    { label: "T", active: true }, // Today (Thursday June 18, 2026) is active
    { label: "F", active: false },
    { label: "S", active: false },
    { label: "S", active: false }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      
      {/* 1. Study Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 rounded-2xl border border-orange-500/15 bg-base-100 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/10 shrink-0 text-orange-500 shadow-sm flex items-center justify-center">
            <FlameIcon className="size-5 fill-orange-500/20 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black text-base-content/40 uppercase tracking-wider leading-none mb-1">
              Study Streak
            </p>
            <p className="font-extrabold text-base text-base-content leading-none">
              {streak} Days 🔥
            </p>
          </div>
        </div>

        {/* Streak Week Calendar */}
        <div className="mt-4 flex justify-between items-center bg-base-200/50 p-2 rounded-xl border border-base-content/5">
          {weekDays.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold text-base-content/40">{day.label}</span>
              <div className={`size-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                day.active 
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                  : "bg-base-300 text-base-content/30"
              }`}>
                {day.active ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 2. Daily Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="p-5 rounded-2xl border border-primary/15 bg-base-100 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 shrink-0 text-primary shadow-sm flex items-center justify-center">
            <BookOpenIcon className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-base-content/40 uppercase tracking-wider leading-none mb-1">
              Daily Goal
            </p>
            <p className="font-extrabold text-base text-base-content leading-none">
              {studyTimeToday} / 20 Min
            </p>
          </div>
        </div>

        {/* Goal Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${dailyGoalPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-primary h-full rounded-full"
            />
          </div>
          <p className="text-[9px] font-extrabold text-base-content/40 text-right uppercase tracking-wider">
            {Math.round(dailyGoalPercent)}% Complete
          </p>
        </div>
      </motion.div>

      {/* 3. Language Pair */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="p-5 rounded-2xl border border-accent/15 bg-base-100 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/5 border border-accent/10 shrink-0 shadow-sm flex items-center justify-center">
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
