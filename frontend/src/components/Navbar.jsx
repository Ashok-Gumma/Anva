import AnvaLogo from "./AnvaLogo";
import AnvaBrandLogo from "./AnvaBrandLogo";
import { Link, useLocation, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { 
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
  ChevronDown,
  Sparkles,
} from "lucide-react";

import ThemeSelector from "./ThemeSelector";
import NotificationBadge from "./NotificationBadge";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../store/useThemeStore";

const communityLinks = [
  { to: "/feed", icon: ImageIcon, label: "Community Feed", desc: "Share updates & posts with language peers" },
  { to: "/friends", icon: UsersIcon, label: "Peers & Network", desc: "Connect, chat & study with friends" },
];

const learningLinks = [
  { to: "/flashcards", icon: BookOpenIcon, label: "Flashcards Studio", desc: "Build & review custom flashcard decks" },
  { to: "/assistant", icon: BrainCircuit, label: "AI Assistant", desc: "Get instant AI tutoring & explanation" },
  { to: "/compiler", icon: Code, label: "Code Compiler", desc: "Run & execute code in real-time" },
];

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { isSignedIn: isClerkSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser) || isClerkSignedIn;
  const isAdmin = authUser?.role === "admin";

  const isCommunityActive = communityLinks.some(l => pathname.startsWith(l.to));
  const isLearningActive = learningLinks.some(l => pathname.startsWith(l.to));

  const handleMobileNav = (to) => {
    navigate(to);
    setDrawerOpen(false);
  };

  return (
    <>
      <header className="bg-base-100/90 backdrop-blur-xl border-b border-base-content/10 sticky top-0 z-40 h-16 flex items-center shadow-xs font-minimal select-none">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full gap-4">
            
            {/* Logo Branding */}
            <div className="shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <AnvaBrandLogo badgeSize="size-8" textSize="text-xl sm:text-2xl" />
              </Link>
            </div>

            {/* Desktop Center Dropdown Navigation Header */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 mx-auto">
                
                {/* 1. Home Direct Link */}
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    pathname === "/"
                      ? "bg-primary/10 text-primary border-primary/20 shadow-xs"
                      : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content border-transparent"
                  }`}
                >
                  <HomeIcon className="size-4" />
                  <span>Home</span>
                </Link>

                {/* 2. Community & Feeds Dropdown */}
                <div className="dropdown dropdown-hover">
                  <div
                    tabIndex={0}
                    role="button"
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isCommunityActive
                        ? "bg-primary/10 text-primary border-primary/20 shadow-xs"
                        : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content border-transparent"
                    }`}
                  >
                    <UsersIcon className="size-4" />
                    <span>Community</span>
                    <ChevronDown className="size-3.5 opacity-60" />
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content z-50 pt-2 w-72"
                  >
                    <div className="p-2 shadow-xl bg-base-100 rounded-2xl border border-base-content/10 flex flex-col gap-1 backdrop-blur-2xl">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-base-content/40">
                        Community & Network
                      </div>
                      {communityLinks.map(({ to, icon: Icon, label, desc }) => {
                        const isActive = pathname === to || pathname.startsWith(to);
                        return (
                          <Link
                            key={to}
                            to={to}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-base-200/80 text-base-content"
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-base-200 text-base-content shrink-0 mt-0.5">
                              <Icon className="size-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-xs leading-tight">{label}</span>
                              <span className="text-[10px] text-base-content/60 leading-tight mt-0.5 truncate">{desc}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Learning Tools Dropdown */}
                <div className="dropdown dropdown-hover">
                  <div
                    tabIndex={0}
                    role="button"
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isLearningActive
                        ? "bg-primary/10 text-primary border-primary/20 shadow-xs"
                        : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content border-transparent"
                    }`}
                  >
                    <Sparkles className="size-4 text-secondary" />
                    <span>Learning Tools</span>
                    <ChevronDown className="size-3.5 opacity-60" />
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content z-50 pt-2 w-72"
                  >
                    <div className="p-2 shadow-xl bg-base-100 rounded-2xl border border-base-content/10 flex flex-col gap-1 backdrop-blur-2xl">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-base-content/40">
                        Interactive Studio
                      </div>
                      {learningLinks.map(({ to, icon: Icon, label, desc }) => {
                        const isActive = pathname === to || pathname.startsWith(to);
                        return (
                          <Link
                            key={to}
                            to={to}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-base-200/80 text-base-content"
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-base-200 text-base-content shrink-0 mt-0.5">
                              <Icon className="size-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-xs leading-tight">{label}</span>
                              <span className="text-[10px] text-base-content/60 leading-tight mt-0.5 truncate">{desc}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Support Link */}
                <Link
                  to="/support"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    pathname === "/support"
                      ? "bg-primary/10 text-primary border-primary/20 shadow-xs"
                      : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content border-transparent"
                  }`}
                >
                  <LifeBuoy className="size-4 text-cyan-500" />
                  <span>Support</span>
                </Link>

                {/* Admin Link if applicable */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      pathname === "/admin"
                        ? "bg-primary text-primary-content border-primary shadow-xs"
                        : "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                    }`}
                  >
                    <ShieldAlert className="size-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </nav>
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

                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-md dropdown-content bg-base-100 rounded-2xl w-56 border border-base-content/10 flex flex-col gap-1">
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
                        <LifeBuoy className="w-4 h-4 text-cyan-500" />
                        <span className="font-medium text-base-content text-sm">Help & Support</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="w-full flex items-center justify-start gap-2 hover:bg-base-200 px-3 py-2.5 rounded-xl transition-colors">
                        <Settings className="w-4 h-4 text-base-content/70" />
                        <span className="font-medium text-base-content text-sm">Profile & Settings</span>
                      </Link>
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
      </header>

      {/* ── Mobile Slide-in Drawer — rendered via Portal to escape stacking contexts ── */}
      {createPortal(
        <AnimatePresence>
          {drawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100dvh",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  zIndex: 99998,
                  cursor: "pointer",
                }}
              />

              {/* Drawer Panel */}
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 280 }}
                data-theme={theme}
                className="bg-base-100 border-l border-base-content/15 shadow-2xl flex flex-col font-minimal"
                style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  width: "320px",
                  maxWidth: "85vw",
                  height: "100dvh",
                  zIndex: 99999,
                  overflowY: "auto",
                }}
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-base-200/80 border-b border-base-content/10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <AnvaLogo className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-black text-lg text-base-content tracking-tight">Anva <span className="font-curly italic text-primary font-bold text-sm">Hub</span></span>
                    {isAdmin && <span className="badge badge-primary text-[9px] font-extrabold uppercase">Admin</span>}
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-xl text-base-content/70 hover:bg-base-300 hover:text-base-content transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links Container */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
                  
                  {/* 1. Home Hub */}
                  <button
                    type="button"
                    onClick={() => handleMobileNav("/")}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all cursor-pointer text-left ${
                      pathname === "/"
                        ? "bg-primary text-primary-content font-black shadow-md"
                        : "text-base-content/90 hover:bg-base-200/90 hover:text-base-content font-bold"
                    }`}
                  >
                    <div className={`size-8 rounded-xl flex items-center justify-center ${pathname === "/" ? "bg-primary-content/20 text-primary-content" : "bg-primary/10 text-primary"}`}>
                      <HomeIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm flex-1">Home Hub</span>
                  </button>

                  {/* 2. Community Section */}
                  <div className="space-y-1.5">
                    <div className="px-3.5 text-[10px] font-black uppercase tracking-widest text-base-content/50">
                      Community &amp; Feeds
                    </div>
                    {communityLinks.map(({ to, icon: Icon, label }) => {
                      const isActive = pathname === to || pathname.startsWith(to);
                      return (
                        <button
                          key={to}
                          type="button"
                          onClick={() => handleMobileNav(to)}
                          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer text-xs font-bold text-left ${
                            isActive
                              ? "bg-primary/15 text-primary border border-primary/20 shadow-xs"
                              : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                          }`}
                        >
                          <div className={`size-7 rounded-lg flex items-center justify-center ${isActive ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/70"}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="flex-1">{label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 3. Learning Tools Section */}
                  <div className="space-y-1.5">
                    <div className="px-3.5 text-[10px] font-black uppercase tracking-widest text-base-content/50">
                      Learning Tools
                    </div>
                    {learningLinks.map(({ to, icon: Icon, label }) => {
                      const isActive = pathname === to || pathname.startsWith(to);
                      return (
                        <button
                          key={to}
                          type="button"
                          onClick={() => handleMobileNav(to)}
                          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer text-xs font-bold text-left ${
                            isActive
                              ? "bg-primary/15 text-primary border border-primary/20 shadow-xs"
                              : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                          }`}
                        >
                          <div className={`size-7 rounded-lg flex items-center justify-center ${isActive ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/70"}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="flex-1">{label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 4. Support */}
                  <div className="pt-3 border-t border-base-content/10">
                    <button
                      type="button"
                      onClick={() => handleMobileNav("/support")}
                      className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all cursor-pointer text-xs font-bold text-left ${
                        pathname === "/support"
                          ? "bg-cyan-500/15 text-cyan-600 border border-cyan-500/30"
                          : "text-base-content/85 hover:bg-base-200"
                      }`}
                    >
                      <div className="size-7 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                        <LifeBuoy className="w-4 h-4" />
                      </div>
                      <span className="flex-1">Help &amp; Support</span>
                    </button>
                  </div>
                </nav>

                {/* Drawer Footer — User info */}
                <div className="p-4 bg-base-200/80 border-t border-base-content/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMobileNav("/profile")}
                    className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-base-100 border border-base-content/10 transition-all hover:border-primary/40 group cursor-pointer text-left"
                  >
                    <div className="relative size-9 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
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
                      <p className="font-bold text-xs text-base-content truncate">{authUser?.fullName}</p>
                      <p className="text-[10px] text-base-content/60 truncate">{authUser?.email}</p>
                    </div>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Navbar;
