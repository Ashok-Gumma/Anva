import AnvaLogo from "./AnvaLogo";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  BrainCircuit,
  Code,
  LifeBuoy,
  ShieldAlert,
  UserIcon,
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests, getUserNotifications, getStreamToken } from "../lib/api";
import { StreamChat } from "stream-chat";
import { motion } from "framer-motion";

const navSections = [
  {
    title: "COMMUNITY & FEEDS",
    links: [
      { to: "/", icon: HomeIcon, label: "Home Hub" },
      { to: "/feed", icon: ImageIcon, label: "Community Feed" },
      { to: "/friends", icon: UsersIcon, label: "Peers & Network", showBadge: true },
    ],
  },
  {
    title: "LEARNING TOOLS",
    links: [
      { to: "/flashcards", icon: BookOpenIcon, label: "Flashcards Studio" },
      { to: "/assistant", icon: BrainCircuit, label: "AI Assistant" },
      { to: "/compiler", icon: Code, label: "Code Compiler" },
    ],
  },
  {
    title: "SYSTEM & ACCOUNT",
    links: [
      { to: "/notifications", icon: BellIcon, label: "Notifications", showBadge: true },
      { to: "/support", icon: LifeBuoy, label: "Support & Help" },
      { to: "/profile", icon: UserIcon, label: "Profile Settings" },
    ],
  },
];

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();
  const isAdmin = authUser?.role === "admin";

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
  const totalNotifCount = incomingCount + adminUnreadCount + chatUnreadCount;

  return (
    <aside className="w-64 bg-base-100/95 backdrop-blur-2xl border-r border-base-content/10 hidden lg:flex flex-col shrink-0 shadow-sm z-20 font-minimal select-none overflow-y-auto">
      {/* ── BRAND HEADER ── */}
      <div className="p-5 border-b border-base-content/10 flex items-center justify-between h-16 shrink-0 bg-base-100/50">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
            <AnvaLogo className="h-6 w-6 object-cover rounded-lg text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-base-content font-extrabold text-lg tracking-tight leading-none flex items-center gap-1">
              Anva
              <span className="font-curly italic text-primary font-bold text-sm">Hub</span>
            </span>
            <span className="text-[10px] text-base-content/50 font-bold uppercase tracking-wider">Learning Platform</span>
          </div>
        </Link>

        {isAdmin && (
          <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[9px] font-extrabold uppercase tracking-wider border border-primary/25">
            Admin
          </span>
        )}
      </div>

      {/* ── NAVIGATION SECTIONS ── */}
      <nav className="flex-1 p-3.5 space-y-5 overflow-y-auto custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-base-content/40 mb-1.5">
              {section.title}
            </h4>

            <div className="space-y-1">
              {section.links.map(({ to, icon: Icon, label, showBadge }) => {
                const isActive = pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-2xl transition-all duration-200 group text-xs ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                        : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content font-medium"
                    }`}
                  >
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-primary" : "text-base-content/60 group-hover:text-base-content"
                        }`}
                      />
                      <span className="truncate">{label}</span>
                    </div>

                    {showBadge && totalNotifCount > 0 ? (
                      <span className="min-w-[18px] h-4.5 bg-error text-error-content text-[10px] font-extrabold rounded-full flex items-center justify-center px-1.5 shadow-sm">
                        {totalNotifCount > 9 ? "9+" : totalNotifCount}
                      </span>
                    ) : (
                      <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity ${isActive ? "opacity-40 text-primary" : ""}`} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Admin Link section if applicable */}
        {isAdmin && (
          <div className="pt-2 border-t border-base-content/10">
            <h4 className="px-3 text-[10px] font-black uppercase tracking-widest text-primary/70 mb-1.5">
              MANAGEMENT
            </h4>
            <Link
              to="/admin"
              className={`relative flex items-center justify-between w-full px-3.5 py-2.5 rounded-2xl transition-all duration-200 text-xs ${
                pathname === "/admin"
                  ? "bg-primary text-primary-content font-bold shadow-md"
                  : "bg-primary/10 text-primary hover:bg-primary/20 font-bold border border-primary/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="size-4.5 shrink-0" />
                <span>Admin Panel</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </Link>
          </div>
        )}
      </nav>

      {/* ── USER PROFILE FOOTER ── */}
      <div className="p-3.5 border-t border-base-content/10 mt-auto bg-base-200/40">
        <Link
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-base-100 border border-transparent hover:border-base-content/10 transition-all group"
        >
          {/* Avatar with status ring */}
          <div className="relative size-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden ring-2 ring-base-content/10 group-hover:ring-primary/40 transition-all">
            {authUser?.profilePic ? (
              <img
                src={authUser.profilePic}
                alt={authUser?.fullName || "User Avatar"}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <span>{authUser?.fullName?.charAt(0)?.toUpperCase() || "U"}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-base-content truncate tracking-tight group-hover:text-primary transition-colors">
              {authUser?.fullName || "User Account"}
            </p>
            <p className="text-[10px] text-success font-semibold flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success animate-pulse shadow-[0_0_6px_currentColor]" />
              Online & Active
            </p>
          </div>

          <UserIcon className="w-4 h-4 text-base-content/40 group-hover:text-primary transition-colors shrink-0" />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
