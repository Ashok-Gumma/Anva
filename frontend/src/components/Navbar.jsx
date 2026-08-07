import AnvaLogo from "./AnvaLogo";
import AnvaBrandLogo from "./AnvaBrandLogo";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { 
  LogOutIcon, 
  Settings,
  HomeIcon, 
  UsersIcon, 
  BookOpenIcon, 
  BrainCircuit, 
  Code,
  LifeBuoy,
  ShieldAlert,
  UserIcon,
  Image as ImageIcon,
  Menu,
  X,
  Bell,
} from "lucide-react";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import NotificationBadge from "./NotificationBadge";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/",            icon: HomeIcon,     label: "Home",          color: "#6366f1", bg: "rgba(99,102,241,0.12)"  },
  { to: "/feed",        icon: ImageIcon,    label: "EduFeed",       color: "#ec4899", bg: "rgba(236,72,153,0.12)"  },
  { to: "/friends",     icon: UsersIcon,    label: "Friends",       color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  { to: "/flashcards",  icon: BookOpenIcon, label: "Decks",         color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
  { to: "/compiler",    icon: Code,         label: "Compiler",      color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
  { to: "/assistant",   icon: BrainCircuit, label: "AI Assistant",  color: "#8b5cf6", bg: "rgba(139,92,246,0.12)"  },
  { to: "/support",     icon: LifeBuoy,     label: "Support",       color: "#06b6d4", bg: "rgba(6,182,212,0.15)",  isSupportLink: true },
  { to: "/profile",     icon: UserIcon,     label: "Profile",       color: "#f97316", bg: "rgba(249,115,22,0.12)"  },
  { to: "/notifications",icon: Bell,        label: "Notifications", color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
];

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { isSignedIn: isClerkSignedIn } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const { logoutMutation } = useLogout();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAuthenticated = Boolean(authUser) || isClerkSignedIn;
  const isAdmin = authUser?.role === "admin";

  const allNavLinks = isAdmin
    ? [...navLinks, { to: "/admin", icon: ShieldAlert, label: "Admin", isAdminLink: true }]
    : navLinks;

  return (
    <>
      <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-30 h-16 flex items-center shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full gap-4">
            
            {/* Logo Branding (Always Visible) */}
            <div className="shrink-0">
              <Link to="/">
                <AnvaBrandLogo badgeSize="size-8" textSize="text-xl sm:text-2xl" />
              </Link>
            </div>

            {/* Centered Horizontal Navigation (Only on Larger screens if Authenticated) */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-1 lg:gap-2 mx-auto">
                {allNavLinks.filter(l => l.to !== "/notifications").map(({ to, icon: Icon, label, isAdminLink }) => {
                  const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                        isActive
                          ? isAdminLink
                            ? "bg-primary text-primary-content border-primary"
                            : "bg-primary/10 text-primary border-primary/20"
                          : isAdminLink
                          ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/30"
                          : "text-base-content/60 hover:bg-base-200 hover:text-base-content border-transparent"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Side Settings & Profile */}
            <div className="flex items-center gap-2 shrink-0">
              <ThemeSelector />
              {isAuthenticated && <NotificationBadge />}

              {/* Clerk UserButton OR Legacy dropdown */}
              {isClerkSignedIn ? (
                <div className="flex items-center ml-1">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 ring-2 ring-primary/30 hover:ring-primary transition-all",
                        userButtonPopoverCard: "shadow-xl border border-base-content/10 rounded-2xl",
                      },
                    }}
                  />
                </div>
              ) : isAuthenticated ? (
                <div className="dropdown dropdown-end ml-1">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary">
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xs sm:text-sm overflow-hidden shadow-sm border border-base-content/10">
                      <span className="absolute inset-0 flex items-center justify-center">
                        {authUser?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                      {authUser?.profilePic && (
                        <img
                          src={authUser.profilePic}
                          alt="User Avatar"
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      )}
                    </div>
                  </div>

                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-md dropdown-content bg-base-100 rounded-2xl w-52 border border-base-content/10 flex flex-col gap-1">
                    <li className="px-3 py-2 border-b border-base-content/10 mb-1">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base-content text-sm truncate">{authUser?.fullName}</span>
                          {isAdmin && <span className="badge badge-primary text-[9px] font-extrabold uppercase">Admin</span>}
                        </div>
                        <span className="text-xs text-base-content/60 truncate opacity-90">{authUser?.email}</span>
                      </div>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link to="/admin" className="w-full flex items-center justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2.5 rounded-xl transition-colors font-bold text-xs">
                          <ShieldAlert className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/support" className="w-full flex items-center justify-start gap-2 hover:bg-base-200 px-3 py-2.5 rounded-xl transition-colors">
                        <LifeBuoy className="w-4 h-4 text-base-content/70" />
                        <span className="font-medium text-base-content text-sm">Help & Support</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="w-full flex items-center justify-start gap-2 hover:bg-base-200 px-3 py-2.5 rounded-xl transition-colors">
                        <Settings className="w-4 h-4 text-base-content/70" />
                        <span className="font-medium text-base-content text-sm">Settings</span>
                      </Link>
                    </li>
                    <li>
                      <button onClick={logoutMutation} className="w-full flex items-center justify-start gap-2 hover:bg-error/10 text-error px-3 py-2.5 rounded-xl transition-colors">
                        <LogOutIcon className="w-4 h-4" />
                        <span className="font-semibold text-sm">Log out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-outline btn-sm font-bold uppercase tracking-wider text-[10px] ml-1">
                  Log In
                </Link>
              )}

              {/* Mobile Hamburger — only on sm/md when auth */}
              {isAuthenticated && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="md:hidden p-2 rounded-xl text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors cursor-pointer ml-1"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Slide-in Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm md:hidden"
            />

            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              style={{ backgroundColor: "#ffffff" }}
              className="fixed top-0 right-0 bottom-0 z-[100] w-72 border-l border-gray-200 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                  <AnvaLogo className="h-7 w-7 text-primary" />
                  <span style={{ color: "#111827" }} className="font-bold text-lg">Anva</span>
                  {isAdmin && <span className="badge badge-primary text-[9px] font-extrabold uppercase">Admin</span>}
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{ color: "#6b7280" }}
                  className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
                {allNavLinks.map(({ to, icon: Icon, label, color, bg, isAdminLink, isSupportLink }) => {
                  const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
                  const itemColor = isAdminLink ? "#6366f1" : (color || "#6366f1");
                  const itemBg = isAdminLink ? "rgba(99,102,241,0.12)" : (bg || "rgba(99,102,241,0.12)");

                  // Add a visual separator before Support
                  const showSeparator = isSupportLink;

                  return (
                    <div key={to}>
                      {showSeparator && (
                        <div className="my-2 border-t border-base-content/10" />
                      )}
                      <Link
                        to={to}
                        onClick={() => setDrawerOpen(false)}
                        style={{
                          backgroundColor: isActive ? itemBg : "transparent",
                          color: isActive ? itemColor : "#374151",
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all hover:opacity-80 active:scale-[0.98]"
                      >
                        {/* Icon Badge */}
                        <div
                          style={{ backgroundColor: itemBg, color: itemColor }}
                          className="size-9 rounded-xl flex items-center justify-center shrink-0"
                        >
                          <Icon className="w-[18px] h-[18px]" />
                        </div>

                        {/* Label */}
                        <span
                          style={{ color: isActive ? itemColor : "#1f2937", fontWeight: isActive ? 700 : 600 }}
                          className="text-sm flex-1"
                        >
                          {label}
                        </span>

                        {/* Active dot */}
                        {isActive && (
                          <div
                            style={{ backgroundColor: itemColor }}
                            className="size-2 rounded-full shrink-0"
                          />
                        )}
                      </Link>
                    </div>
                  );
                })}
              </nav>

              {/* Drawer Footer — User info + Logout */}
              <div style={{ backgroundColor: "#f9fafb", borderTop: "1px solid #e5e7eb" }} className="p-4 space-y-3">
                <Link
                  to="/profile"
                  onClick={() => setDrawerOpen(false)}
                  style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:border-indigo-300 group"
                >
                  <div className="relative w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                    <span className="absolute inset-0 flex items-center justify-center">
                      {authUser?.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                    {authUser?.profilePic && (
                      <img
                        src={authUser.profilePic}
                        alt={authUser?.fullName}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p style={{ color: "#111827" }} className="font-bold text-sm truncate">{authUser?.fullName}</p>
                    <p style={{ color: "#6b7280" }} className="text-xs truncate">{authUser?.email}</p>
                  </div>
                </Link>
                <button
                  onClick={() => { setDrawerOpen(false); logoutMutation(); }}
                  style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all hover:bg-red-50"
                >
                  <LogOutIcon className="w-4 h-4 shrink-0" />
                  Log Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
