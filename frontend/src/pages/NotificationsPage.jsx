import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Clock,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  MessageCircle,
  ArrowRight,
  CheckCheck,
  Inbox,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { StreamChat } from "stream-chat";
import { motion, AnimatePresence } from "framer-motion";

import {
  acceptFriendRequest,
  getFriendRequests,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
  getStreamToken,
} from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const [activeTab, setActiveTab] = useState("unread"); // "unread" | "all"

  /* ---------------- FETCH FRIEND REQUESTS ---------------- */
  const { data: friendRequests, isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 8_000,
  });

  /* ---------------- FETCH SYSTEM & SUPPORT NOTIFICATIONS ---------------- */
  const { data: notifData, isLoading: isLoadingNotifs } = useQuery({
    queryKey: ["userNotifications"],
    queryFn: getUserNotifications,
    refetchInterval: 8_000,
  });

  /* ---------------- FETCH STREAM CHAT CHANNELS & MESSAGES ---------------- */
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const { data: streamChannels = [], isLoading: isLoadingChannels } = useQuery({
    queryKey: ["streamChannels"],
    queryFn: async () => {
      if (!tokenData?.token || !authUser) return [];
      const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
      if (client.userID !== authUser._id) {
        if (client.userID) await client.disconnectUser();
        await client.connectUser({ id: authUser._id, name: authUser.fullName }, tokenData.token);
      }
      const channels = await client.queryChannels(
        { members: { $in: [authUser._id] } },
        { last_message_at: -1 },
        { watch: true, state: true, limit: 20 }
      );
      return channels;
    },
    enabled: !!authUser && !!tokenData?.token,
    refetchInterval: 6_000,
  });

  /* ---------------- ACCEPT FRIEND REQUEST ---------------- */
  const { mutate: acceptRequestMutation, isPending: isAcceptingFriend } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  /* ---------------- MARK SINGLE NOTIFICATION READ ---------------- */
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      toast.success("Notification marked as read");
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });

  /* ---------------- MARK ALL NOTIFICATIONS READ ---------------- */
  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: async () => {
      // Mark all unread stream channels as read too
      try {
        const unreadChannels = streamChannels.filter((ch) => (ch.state?.unreadCount || 0) > 0);
        await Promise.all(unreadChannels.map((ch) => ch.markRead().catch(() => {})));
        queryClient.invalidateQueries({ queryKey: ["streamChannels"] });
      } catch (e) {
        console.error("Error clearing stream unreads:", e);
      }
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
      toast.success("All notifications marked as read");
    },
  });

  /* ---------------- DELETE SINGLE NOTIFICATION ---------------- */
  const deleteNotifMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      toast.success("Notification removed");
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });

  /* ---------------- CLEAR ALL NOTIFICATIONS ---------------- */
  const clearAllMutation = useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => {
      toast.success("Notification history cleared");
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });

  /* ---------------- MARK STREAM CHANNEL AS READ (DISAPPEARS) ---------------- */
  const handleMarkChannelRead = async (channel) => {
    try {
      await channel.markRead();
      toast.success("Message notification cleared");
      queryClient.invalidateQueries({ queryKey: ["streamChannels"] });
    } catch (err) {
      console.error("Error marking channel read:", err);
    }
  };

  /* ---------------- FILTER DATA ---------------- */
  const incomingRequests =
    friendRequests?.incomingReqs?.filter((req) => req?.sender) || [];

  const acceptedRequests =
    friendRequests?.acceptedReqs?.filter((req) => req?.recipient) || [];

  const allAdminNotifications = notifData?.notifications || [];
  const adminUnreadCount = notifData?.unreadCount || 0;

  // STRICTLY only show unread incoming message notifications!
  const unreadMessageChannels = streamChannels.filter(
    (ch) => (ch.state?.unreadCount || 0) > 0
  );
  const chatUnreadCount = unreadMessageChannels.reduce(
    (acc, ch) => acc + (ch.state?.unreadCount || 0),
    0
  );

  const displayedAdminNotifications =
    activeTab === "unread"
      ? allAdminNotifications.filter((n) => !n.isRead)
      : allAdminNotifications;

  const totalActiveUnreadCount =
    incomingRequests.length + adminUnreadCount + chatUnreadCount;

  const isLoading = isLoadingFriends || isLoadingNotifs || isLoadingChannels;

  const hasNoItems =
    activeTab === "unread"
      ? incomingRequests.length === 0 &&
        displayedAdminNotifications.length === 0 &&
        unreadMessageChannels.length === 0
      : incomingRequests.length === 0 &&
        acceptedRequests.length === 0 &&
        displayedAdminNotifications.length === 0 &&
        unreadMessageChannels.length === 0;

  return (
    <div className="min-h-screen bg-base-200/50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Apple-Style Minimal Header */}
        <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl p-6 border border-base-content/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Bell className="size-4.5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
                Notifications
              </h1>
              {totalActiveUnreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-content ml-1">
                  {totalActiveUnreadCount}
                </span>
              )}
            </div>
            <p className="text-xs text-base-content/60 font-medium">
              Manage incoming peer messages, system alerts, and friend requests in real time.
            </p>
          </div>

          {/* Actions & Segmented Control */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-base-200/70 p-1 rounded-2xl flex items-center gap-1 border border-base-content/5">
              <button
                onClick={() => setActiveTab("unread")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "unread"
                    ? "bg-base-100 text-base-content shadow-xs"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                Unread {totalActiveUnreadCount > 0 ? `(${totalActiveUnreadCount})` : ""}
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-base-100 text-base-content shadow-xs"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                All History
              </button>
            </div>

            {totalActiveUnreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="Mark all as read"
              >
                <CheckCheck className="size-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Stream */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <span className="loading loading-spinner loading-md text-primary"></span>
            <p className="text-xs font-semibold text-base-content/50">Fetching notifications...</p>
          </div>
        ) : (
          <div className="space-y-6">

            {/* ── 1. INCOMING DIRECT MESSAGE NOTIFICATIONS (ONLY UNREAD) ── */}
            <AnimatePresence>
              {unreadMessageChannels.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                      <MessageCircle className="size-4 text-primary" />
                      New Messages
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-primary-content">
                        {chatUnreadCount} unread
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {unreadMessageChannels.map((ch) => {
                      const members = Object.values(ch.state?.members || {});
                      const peerMember = members.find(
                        (m) => m.user_id !== authUser?._id && m.user?.id !== authUser?._id
                      )?.user;
                      const peerName = peerMember?.name || "Peer";
                      const rawPeerPic = peerMember?.image || peerMember?.profilePic;
                      const peerPic = rawPeerPic && !rawPeerPic.includes("avatar.iran.liara.run") ? rawPeerPic : null;
                      const peerId = peerMember?.id || peerMember?.user_id;

                      const messages = ch.state?.messages || [];
                      const lastMessage = messages[messages.length - 1];
                      const lastMessageText = lastMessage?.text || (lastMessage ? "Sent an attachment" : "Sent a message");
                      const msgDate = lastMessage?.created_at ? new Date(lastMessage.created_at) : null;
                      const unreadNum = ch.state?.unreadCount || 1;

                      if (!peerId) return null;

                      return (
                        <motion.div
                          key={ch.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-base-100/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-primary/25 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ring-1 ring-primary/10 hover:border-primary/40 transition-all"
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            {/* Avatar */}
                            <div className="size-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 p-0.5 shrink-0 shadow-2xs">
                              <div className="size-full rounded-[0.9rem] bg-base-100 flex items-center justify-center font-extrabold text-sm overflow-hidden relative text-primary">
                                <span>{peerName.charAt(0).toUpperCase()}</span>
                                {peerPic && (
                                  <img
                                    src={peerPic}
                                    alt={peerName}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                )}
                              </div>
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm text-base-content truncate">
                                  {peerName}
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/15 text-primary">
                                  {unreadNum} New
                                </span>
                              </div>

                              <p className="text-xs text-base-content/80 font-medium line-clamp-1">
                                "{lastMessageText}"
                              </p>

                              {msgDate && (
                                <p className="text-[11px] text-base-content/40 font-semibold flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => handleMarkChannelRead(ch)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-base-content/70 hover:bg-base-200 hover:text-base-content border border-base-content/10 transition-all flex items-center gap-1 cursor-pointer"
                              title="Mark message as read"
                            >
                              <CheckCircle2 className="size-3.5 text-primary" />
                              <span>Read</span>
                            </button>

                            <button
                              onClick={() => {
                                ch.markRead().catch(() => {});
                                navigate(`/chat/${peerId}`);
                              }}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-primary-content hover:brightness-105 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Reply</span>
                              <ArrowRight className="size-3" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}
            </AnimatePresence>

            {/* ── 2. SYSTEM & ADMIN ALERTS / SUPPORT NOTIFICATIONS ── */}
            <AnimatePresence>
              {displayedAdminNotifications.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                      <ShieldCheck className="size-4 text-emerald-500" />
                      Platform & Support Updates
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-base-300 text-base-content/70">
                        {displayedAdminNotifications.length}
                      </span>
                    </h2>

                    {activeTab === "all" && allAdminNotifications.length > 0 && (
                      <button
                        onClick={() => clearAllMutation.mutate()}
                        className="text-[11px] font-bold text-error/80 hover:text-error flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="size-3" /> Clear History
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {displayedAdminNotifications.map((notif) => {
                      const isWarning = notif.type === "admin_warning";
                      const isSystem = notif.type === "system";

                      return (
                        <motion.div
                          key={notif._id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`bg-base-100/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border transition-all ${
                            isWarning
                              ? "border-warning/40 bg-warning/5 ring-1 ring-warning/20 shadow-xs"
                              : !notif.isRead
                              ? "border-primary/30 ring-1 ring-primary/10 shadow-xs"
                              : "border-base-content/10 opacity-80"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5">
                            <div className="flex items-start gap-3.5 min-w-0 flex-1">
                              {/* Icon badge */}
                              <div
                                className={`size-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                                  isWarning
                                    ? "bg-warning/15 text-warning"
                                    : isSystem
                                    ? "bg-indigo-500/15 text-indigo-500"
                                    : "bg-primary/15 text-primary"
                                }`}
                              >
                                {isWarning ? (
                                  <AlertTriangle className="size-5" />
                                ) : isSystem ? (
                                  <Sparkles className="size-5" />
                                ) : (
                                  <ShieldCheck className="size-5" />
                                )}
                              </div>

                              {/* Text info */}
                              <div className="space-y-1.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3
                                    className={`font-bold text-sm leading-snug ${
                                      isWarning ? "text-warning" : "text-base-content"
                                    }`}
                                  >
                                    {notif.title}
                                  </h3>
                                  {!notif.isRead && (
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                        isWarning
                                          ? "bg-warning/20 text-warning"
                                          : "bg-primary/20 text-primary"
                                      }`}
                                    >
                                      New
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-base-content/80 font-medium leading-relaxed bg-base-200/50 p-3 rounded-xl border border-base-content/5">
                                  {notif.message}
                                </p>

                                <p className="text-[11px] text-base-content/40 font-semibold flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {new Date(notif.createdAt).toLocaleDateString()} at{" "}
                                  {new Date(notif.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                              {notif.ticketId && (
                                <Link
                                  to="/support"
                                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all flex items-center gap-1"
                                >
                                  <ExternalLink className="size-3" /> View Ticket
                                </Link>
                              )}

                              {!notif.isRead && (
                                <button
                                  onClick={() => markReadMutation.mutate(notif._id)}
                                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-base-content/70 hover:bg-base-200 border border-base-content/10 transition-all flex items-center gap-1 cursor-pointer"
                                  title="Mark as Read"
                                >
                                  <CheckCircle2 className="size-3.5 text-primary" />
                                  <span>Read</span>
                                </button>
                              )}

                              <button
                                onClick={() => deleteNotifMutation.mutate(notif._id)}
                                className="p-1.5 rounded-xl text-base-content/40 hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                                title="Dismiss"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}
            </AnimatePresence>

            {/* ── 3. FRIEND REQUESTS ── */}
            <AnimatePresence>
              {incomingRequests.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                      <UserCheck className="size-4 text-primary" />
                      Friend Requests
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-primary-content">
                        {incomingRequests.length}
                      </span>
                    </h2>
                  </div>

                  <div className="space-y-2.5">
                    {incomingRequests.map((request) => {
                      const name = request.sender?.fullName || "Unknown User";

                      return (
                        <motion.div
                          key={request._id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, height: 0 }}
                          className="bg-base-100/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-base-content/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="size-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-0.5 shrink-0 shadow-2xs">
                              <div className="size-full rounded-[0.9rem] bg-base-100 flex items-center justify-center font-extrabold text-sm overflow-hidden relative text-primary">
                                <span>{name.charAt(0).toUpperCase()}</span>
                                {request.sender?.profilePic && (
                                  <img
                                    src={request.sender.profilePic}
                                    alt={name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                )}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-sm text-base-content truncate">{name}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {request.sender?.nativeLanguage && (
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold rounded-lg">
                                    Native: {request.sender.nativeLanguage}
                                  </span>
                                )}
                                {request.sender?.learningLanguage && (
                                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-bold rounded-lg">
                                    Learning: {request.sender.learningLanguage}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isAcceptingFriend}
                            className="px-4 py-2 rounded-xl font-bold text-xs bg-primary text-primary-content hover:brightness-105 shadow-2xs transition-all cursor-pointer self-end sm:self-center"
                          >
                            {isAcceptingFriend ? "Accepting..." : "Accept Request"}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>
              )}
            </AnimatePresence>

            {/* ── 4. ACCEPTED CONNECTIONS (HISTORY TAB) ── */}
            <AnimatePresence>
              {activeTab === "all" && acceptedRequests.length > 0 && (
                <section className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-2 px-1">
                    <UserCheck className="size-4 text-emerald-500" />
                    Connected Friends
                  </h2>

                  <div className="space-y-2.5">
                    {acceptedRequests.map((notification) => {
                      const name = notification.recipient?.fullName || "Friend";

                      return (
                        <div
                          key={notification._id}
                          className="bg-base-100/90 backdrop-blur-xl rounded-2xl p-4 border border-base-content/10 shadow-xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-base-content">
                                {name} accepted your friend request
                              </p>
                              <p className="text-[10px] text-base-content/50 font-medium">
                                You can now message and practice languages together.
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => navigate(`/chat/${notification.recipient?._id}`)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-base-200 hover:bg-base-300 transition-all cursor-pointer"
                          >
                            Chat
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </AnimatePresence>

            {/* ── EMPTY STATE ── */}
            {hasNoItems && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-base-100/80 backdrop-blur-xl rounded-3xl p-12 border border-base-content/10 text-center space-y-3 shadow-xs"
              >
                <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-2xs">
                  <Inbox className="size-7" />
                </div>
                <h3 className="text-lg font-extrabold text-base-content">
                  {activeTab === "unread" ? "All caught up" : "No notifications yet"}
                </h3>
                <p className="text-xs text-base-content/60 max-w-sm mx-auto font-medium">
                  {activeTab === "unread"
                    ? "You don't have any unread notifications or new messages right now."
                    : "Your notification history is empty."}
                </p>
              </motion.div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
