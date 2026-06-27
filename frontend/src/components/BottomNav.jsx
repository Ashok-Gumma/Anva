import { Link, useLocation } from "react-router";
import { 
  HomeIcon, 
  UsersIcon, 
  BookOpenIcon, 
  BrainCircuit, 
  Code,
  Settings,
  Bell
} from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/friends", icon: UsersIcon, label: "Friends" },
  { to: "/flashcards", icon: BookOpenIcon, label: "Study" },
  { to: "/assistant", icon: BrainCircuit, label: "AI" },
  { to: "/compiler", icon: Code, label: "Code" },
  { to: "/profile", icon: Settings, label: "Profile" },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-base-100/80 backdrop-blur-lg border-t border-base-content/10 px-2 pb-safe pt-1.5 flex items-center justify-around md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
      {navLinks.map(({ to, icon: Icon, label }) => {
        const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
        
        return (
          <Link
            key={to}
            to={to}
            className={`relative flex flex-col items-center gap-1.5 py-1 px-1.5 transition-all ${
              isActive ? "text-primary animate-pulse" : "text-base-content/60"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute -top-1.5 w-8 h-[3px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--p),0.5)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className={`size-5 transition-transform ${isActive ? "scale-105" : "scale-100"}`} />
            <span className="text-[8px] font-black uppercase tracking-tighter leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
