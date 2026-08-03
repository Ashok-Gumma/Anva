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
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-base-100/90 backdrop-blur-xl border-t border-base-content/10 px-1 pb-safe pt-1 flex items-center justify-around md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {navLinks.map(({ to, icon: Icon, label }) => {
        const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
        
        return (
          <Link
            key={to}
            to={to}
            className={`relative flex flex-col items-center gap-1 py-1 px-1 transition-all min-w-[48px] ${
              isActive ? "text-primary font-bold" : "text-base-content/60 hover:text-base-content"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute -top-1 w-6 h-[3px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--p),0.5)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className={`size-4.5 sm:size-5 transition-transform ${isActive ? "scale-110" : "scale-100"}`} />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
