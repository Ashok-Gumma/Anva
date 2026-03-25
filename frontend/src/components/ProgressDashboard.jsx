import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { capitalize } from "../lib/utils";
import { getLanguageIcon } from "./FriendCard";
import { motion } from "framer-motion";
import { FlameIcon, UsersIcon, BookOpenIcon } from "lucide-react";

/**
 * Progress Dashboard - shown at the top of HomePage
 * Displays learning streak stub, friends count, and language pair.
 */
const ProgressDashboard = () => {
  const { authUser } = useAuthUser();
  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (!authUser) return null;

  const stats = [
    {
      icon: <FlameIcon className="size-5 text-orange-500" />,
      label: "Day Streak",
      value: "🔥 Active",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      icon: <UsersIcon className="size-5 text-primary" />,
      label: "Friends",
      value: friends.length,
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      icon: getLanguageIcon(authUser.nativeLanguage) ? (
        <span className="text-lg">{getLanguageIcon(authUser.nativeLanguage)}</span>
      ) : (
        <BookOpenIcon className="size-5 text-secondary" />
      ),
      label: "Native",
      value: capitalize(authUser.nativeLanguage) || "—",
      bg: "bg-secondary/10",
      border: "border-secondary/20",
    },
    {
      icon: getLanguageIcon(authUser.learningLanguage) ? (
        <span className="text-lg">{getLanguageIcon(authUser.learningLanguage)}</span>
      ) : (
        <BookOpenIcon className="size-5 text-accent" />
      ),
      label: "Learning",
      value: capitalize(authUser.learningLanguage) || "—",
      bg: "bg-accent/10",
      border: "border-accent/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07, duration: 0.3 }}
          className={`flex items-center gap-3 p-4 rounded-2xl border ${stat.bg} ${stat.border} bg-base-100`}
        >
          <div className={`p-2 rounded-xl ${stat.bg} border ${stat.border} shrink-0`}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">{stat.label}</p>
            <p className="font-bold text-base-content truncate">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProgressDashboard;
