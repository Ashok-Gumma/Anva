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
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/feed", icon: ImageIcon, label: "EduFeed" },
  { to: "/friends", icon: UsersIcon, label: "Friends" },
  { to: "/flashcards", icon: BookOpenIcon, label: "Decks" },
  { to: "/compiler", icon: Code, label: "Compiler" },
  { to: "/assistant", icon: BrainCircuit, label: "Assistant" },
  { to: "/support", icon: LifeBuoy, label: "Support" },
  { to: "/profile", icon: UserIcon, label: "Profile" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
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
              className="fixed top-0 right-0 bottom-0 z-[100] w-72 bg-base-100 border-l border-base-content/10 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-base-content/10 bg-base-200/50">
                <div className="flex items-center gap-2">
                  <AnvaLogo className="h-7 w-7 text-primary" />
                  <span className="font-bold text-lg text-base-content">Anva</span>
                  {isAdmin && <span className="badge badge-primary text-[9px] font-extrabold uppercase">Admin</span>}
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-base-content/60 hover:text-base-content hover:bg-base-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {allNavLinks.map(({ to, icon: Icon, label, isAdminLink }) => {
                  const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? isAdminLink
                            ? "bg-primary text-primary-content"
                            : "bg-primary/10 text-primary"
                          : isAdminLink
                          ? "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                          : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer Footer — User info + Logout */}
              <div className="p-4 border-t border-base-content/10 bg-base-200/40 space-y-3">
                <Link
                  to="/profile"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 group"
                >
                  <div className="relative w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
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
                    <p className="font-bold text-sm text-base-content truncate">{authUser?.fullName}</p>
                    <p className="text-xs text-base-content/50 truncate">{authUser?.email}</p>
                  </div>
                </Link>
                <button
                  onClick={() => { setDrawerOpen(false); logoutMutation(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-error hover:bg-error/10 transition-colors"
                >
                  <LogOutIcon className="w-4 h-4" />
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
