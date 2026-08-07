import { Link, useLocation } from "react-router";
import {
  HomeIcon,
  UsersIcon,
  Sparkles,
  Code,
  UserIcon,
  Image as ImageIcon,
  ShieldAlert,
  BookOpenIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import useAuthUser from "../hooks/useAuthUser";

const baseNavLinks = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/feed", icon: ImageIcon, label: "Feed" },
  { to: "/assistant", icon: Sparkles, label: "AI" },
  { to: "/compiler", icon: Code, label: "Code" },
  { to: "/friends", icon: UsersIcon, label: "Peers" },
  { to: "/profile", icon: UserIcon, label: "Profile" },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const { authUser } = useAuthUser();
  const isAdmin = authUser?.role === "admin";

  const navLinks = isAdmin
    ? [
        ...baseNavLinks.slice(0, 3),
        { to: "/admin", icon: ShieldAlert, label: "Admin" },
        ...baseNavLinks.slice(3),
      ]
    : baseNavLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-base-100/95 backdrop-blur-xl border-t border-base-content/10 px-1 pt-1.5 pb-safe flex items-center justify-around md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.1)]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}>
      {navLinks.map(({ to, icon: Icon, label }) => {
        const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));

        return (
          <Link
            key={to}
            to={to}
            className={`bottom-nav-item relative flex flex-col items-center gap-1 px-2 transition-all min-w-[44px] cursor-pointer ${
              isActive ? "text-primary font-bold" : "text-base-content/60 hover:text-base-content"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute -top-1.5 w-6 h-[3px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--p),0.5)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <Icon className={`size-4.5 sm:size-5 transition-transform ${isActive ? "scale-110" : "scale-100"}`} />
            <span className="text-[9px] font-black uppercase tracking-tight leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
