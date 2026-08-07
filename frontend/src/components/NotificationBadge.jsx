import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, getUserNotifications, getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { StreamChat } from "stream-chat";
import { Link } from "react-router";
import { BellIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animated notification bell with unread badge (friend requests + support/admin updates + chat messages)
 */
const NotificationBadge = () => {
  const { authUser } = useAuthUser();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 10_000,
  });

  const { data: notifData } = useQuery({
    queryKey: ["userNotifications"],
    queryFn: getUserNotifications,
    refetchInterval: 10_000,
  });

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const { data: streamChannels = [] } = useQuery({
    queryKey: ["streamChannels"],
    queryFn: async () => {
      if (!tokenData?.token || !authUser) return [];
      const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
      if (client.userID !== authUser._id) {
        if (client.userID) await client.disconnectUser();
        await client.connectUser({ id: authUser._id, name: authUser.fullName }, tokenData.token);
      }
      return await client.queryChannels(
        { members: { $in: [authUser._id] } },
        { last_message_at: -1 },
        { watch: true, state: true }
      );
    },
    enabled: !!authUser && !!tokenData?.token,
    refetchInterval: 10_000,
  });

  const incomingCount = friendRequests?.incomingReqs?.filter((r) => r?.sender)?.length || 0;
  const adminUnreadCount = notifData?.unreadCount || 0;
  const chatUnreadCount = streamChannels.reduce((acc, ch) => acc + (ch.state?.unreadCount || 0), 0);

  const totalCount = incomingCount + adminUnreadCount + chatUnreadCount;

  return (
    <Link to="/notifications" className="relative p-2 rounded-full hover:bg-base-200 transition-colors group">
      <BellIcon className="h-5 w-5 text-base-content/80 group-hover:text-base-content transition-colors" />
      <AnimatePresence>
        {totalCount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-error text-error-content text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
          >
            {totalCount > 9 ? "9+" : totalCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};

export default NotificationBadge;
