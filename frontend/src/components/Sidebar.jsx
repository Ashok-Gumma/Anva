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
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";
import { motion } from "framer-motion";

const baseNavLinks = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/friends", icon: UsersIcon, label: "Friends" },
  { to: "/flashcards", icon: BookOpenIcon, label: "Flashcards" },
  { to: "/compiler", icon: Code, label: "Compiler" },
  { to: "/assistant", icon: BrainCircuit, label: "Assistant" },
  { to: "/support", icon: LifeBuoy, label: "Support & Help" },
  { to: "/profile", icon: UserIcon, label: "Profile Settings" },
  { to: "/notifications", icon: BellIcon, label: "Notifications", showBadge: true },
];

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();
  const isAdmin = authUser?.role === "admin";

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 60_000,
  });
  const notifCount = friendRequests?.incomingReqs?.filter((r) => r?.sender)?.length || 0;

  const navLinks = isAdmin
    ? [...baseNavLinks, { to: "/admin", icon: ShieldAlert, label: "Admin Panel", isAdminLink: true }]
    : baseNavLinks;

  return (
    <aside className="w-64 bg-base-100 border-r border-base-content/10 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm z-20">
      {/* LOGO */}
      <div className="p-5 border-b border-base-content/10 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <AnvaLogo className="h-8 w-8 object-cover rounded-lg drop-shadow-sm group-hover:scale-105 transition-transform text-primary" />
          <span className="text-base-content font-bold text-xl tracking-tight hidden sm:block">Anva</span>
        </Link>
        {isAdmin && (
          <span className="badge badge-primary text-[10px] font-extrabold uppercase">
            Admin
          </span>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navLinks.map(({ to, icon: Icon, label, showBadge, isAdminLink }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? isAdminLink
                    ? "bg-primary text-primary-content font-bold shadow-md"
                    : "bg-primary/10 text-primary font-semibold"
                  : isAdminLink
                  ? "bg-primary/10 text-primary hover:bg-primary/20 font-bold border border-primary/20"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium"
              }`}
            >
              {/* Active slide-in indicator */}
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${
                    isAdminLink ? "bg-primary-content" : "bg-primary"
                  }`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                className={`size-5 transition-colors ${
                  isActive
                    ? isAdminLink
                      ? "text-primary-content"
                      : "text-primary"
                    : "opacity-70 group-hover:opacity-100"
                }`}
              />
              {label}

              {/* Notification count badge for notifications link */}
              {showBadge && notifCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 bg-error text-error-content text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE */}
      <div className="p-4 border-t border-base-content/10 mt-auto bg-base-200/50">
        <Link to="/profile" className="flex items-center gap-3 group">
          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
            <span className="absolute inset-0 flex items-center justify-center">
              {authUser?.fullName?.charAt(0)?.toUpperCase()}
            </span>
            {authUser?.profilePic && (
              <img
                src={authUser.profilePic}
                alt={authUser?.fullName || "User Avatar"}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-sm text-base-content tracking-tight truncate">{authUser?.fullName}</p>
            </div>
            <p className="text-xs text-success font-medium flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success shadow-[0_0_5px_currentColor] animate-pulse" />
              Online
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
