import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router";

import {
  acceptFriendRequest,
  getFriendRequests,
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
} from "../lib/api";
import NoNotificationsFound from "../components/NoNotificationsFound";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  /* ---------------- FETCH FRIEND REQUESTS ---------------- */
  const { data: friendRequests, isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 10_000,
  });

  /* ---------------- FETCH SYSTEM & SUPPORT NOTIFICATIONS ---------------- */
  const { data: notifData, isLoading: isLoadingNotifs } = useQuery({
    queryKey: ["userNotifications"],
    queryFn: getUserNotifications,
    refetchInterval: 10_000,
  });

  /* ---------------- ACCEPT FRIEND REQUEST ---------------- */
  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  /* ---------------- MARK NOTIFICATION READ ---------------- */
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });

  /* ---------------- DELETE NOTIFICATION ---------------- */
  const deleteNotifMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      toast.success("Notification dismissed");
      queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
    },
  });

  /* ---------------- SAFE DATA HANDLING ---------------- */
  const incomingRequests =
    friendRequests?.incomingReqs?.filter((req) => req?.sender) || [];

  const acceptedRequests =
    friendRequests?.acceptedReqs?.filter((req) => req?.recipient) || [];

  const adminNotifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;

  const isLoading = isLoadingFriends || isLoadingNotifs;
  const hasNoNotifications =
    incomingRequests.length === 0 &&
    acceptedRequests.length === 0 &&
    adminNotifications.length === 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="badge badge-primary font-bold px-3 py-2 text-xs">
              {unreadCount} Unread Admin Update{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* ---------------- ADMIN & SUPPORT NOTIFICATIONS ---------------- */}
            {adminNotifications.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2 text-base-content">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Support & Admin Updates
                  <span className="badge badge-primary font-bold ml-1">
                    {adminNotifications.length}
                  </span>
                </h2>

                <div className="space-y-3">
                  {adminNotifications.map((notif) => {
                    const isWarning = notif.type === "admin_warning";

                    return (
                      <div
                        key={notif._id}
                        className={`bg-base-100/90 backdrop-blur-md rounded-3xl p-5 border transition-all ${
                          isWarning
                            ? "border-warning/50 bg-warning/5 shadow-md ring-2 ring-warning/20"
                            : !notif.isRead
                            ? "border-primary/40 shadow-md ring-2 ring-primary/10"
                            : "border-base-content/10 shadow-sm opacity-90"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3.5">
                            <div className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                              isWarning ? "bg-warning/20 text-warning" : "bg-primary/10 text-primary"
                            }`}>
                              {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`font-bold text-base ${isWarning ? "text-warning font-black" : "text-base-content"}`}>
                                  {notif.title}
                                </h3>
                                {!notif.isRead && (
                                  <span className={`badge text-[10px] font-black uppercase ${
                                    isWarning ? "badge-warning" : "badge-primary"
                                  }`}>
                                    New
                                  </span>
                                )}
                              </div>

                              <p className={`text-sm font-medium leading-relaxed p-3 rounded-2xl border ${
                                isWarning
                                  ? "bg-warning/10 text-warning-content border-warning/30 font-semibold"
                                  : "bg-base-200/50 text-base-content/80 border-base-content/5"
                              }`}>
                                {notif.message}
                              </p>

                              <p className="text-xs text-base-content/50 font-semibold flex items-center gap-1 pt-1">
                                <ClockIcon className="h-3.5 w-3.5" />
                                {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                          {!isWarning && notif.ticketId && (
                            <Link
                              to="/support"
                              className="btn btn-xs btn-outline btn-primary rounded-xl font-bold gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> View Ticket
                            </Link>
                          )}

                          {!notif.isRead && (
                            <button
                              onClick={() => markReadMutation.mutate(notif._id)}
                              className="btn btn-xs btn-ghost text-primary hover:bg-primary/10 font-bold"
                              title="Mark as Read"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Read
                            </button>
                          )}

                          <button
                            onClick={() => deleteNotifMutation.mutate(notif._id)}
                            className="btn btn-xs btn-ghost text-error hover:bg-error/10"
                            title="Dismiss Notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </section>
            )}

            {/* ---------------- FRIEND REQUESTS ---------------- */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2 text-base-content">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary font-black ml-2 px-2.5">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-4">
                  {incomingRequests.map((request) => {
                    const name = request.sender?.fullName || "Unknown User";

                    return (
                      <div
                        key={request._id}
                        className="bg-base-100/90 backdrop-blur-md rounded-3xl p-5 border border-base-content/10 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-16 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent p-0.5 shadow-md shrink-0">
                            <div className="size-full rounded-[0.9rem] bg-base-100 text-base-content flex items-center justify-center font-black text-xl overflow-hidden relative">
                              <span className="absolute inset-0 flex items-center justify-center font-black text-primary">
                                {name.charAt(0).toUpperCase()}
                              </span>
                              {request.sender?.profilePic && (
                                <img
                                  src={request.sender.profilePic}
                                  alt={name}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-extrabold text-base text-base-content tracking-tight truncate">{name}</h3>

                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {request.sender?.nativeLanguage && (
                                <span className="px-2.5 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 text-[10px] font-extrabold rounded-lg">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                              )}
                              {request.sender?.learningLanguage && (
                                <span className="px-2.5 py-0.5 bg-accent/10 text-accent border border-accent/20 text-[10px] font-extrabold rounded-lg">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-primary to-secondary text-primary-content hover:brightness-110 shadow-md transition-all cursor-pointer"
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={isPending}
                        >
                          {isPending ? "Accepting..." : "Accept Request"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ---------------- ACCEPTED REQUESTS ---------------- */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => {
                    const name = notification.recipient?.fullName || "Unknown User";

                    return (
                      <div
                        key={notification._id}
                        className="card bg-base-200 shadow-sm"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="relative mt-1 w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm overflow-hidden">
                              <span className="absolute inset-0 flex items-center justify-center">
                                {name.charAt(0).toUpperCase()}
                              </span>

                              {notification.recipient?.profilePic && (
                                <img
                                  src={notification.recipient.profilePic}
                                  alt={name}
                                  loading="lazy"
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                            </div>

                            <div className="flex-1">
                              <h3 className="font-semibold">{name}</h3>

                              <p className="text-sm my-1">
                                {name} accepted your friend request
                              </p>

                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>

                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ---------------- EMPTY STATE ---------------- */}
            {hasNoNotifications && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
