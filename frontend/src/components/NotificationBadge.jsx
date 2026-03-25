import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { Link } from "react-router";
import { BellIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animated notification bell with unread badge
 */
const NotificationBadge = () => {
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 60_000, // refresh every minute
  });

  const count = friendRequests?.incomingReqs?.filter((r) => r?.sender)?.length || 0;

  return (
    <Link to="/notifications" className="relative p-2 rounded-full hover:bg-base-200 transition-colors group">
      <BellIcon className="h-5 w-5 text-base-content/80 group-hover:text-base-content transition-colors" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-error text-error-content text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
          >
            {count > 9 ? "9+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};

export default NotificationBadge;
