import { Link, useLocation } from "react-router";
import { 
  HomeIcon, 
  UsersIcon, 
  BookOpenIcon, 
  BrainCircuit, 
  Code,
  Bell
} from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/friends", icon: UsersIcon, label: "Friends" },
  { to: "/flashcards", icon: BookOpenIcon, label: "Study" },
  { to: "/assistant", icon: BrainCircuit, label: "AI" },
  { to: "/compiler", icon: Code, label: "Code" },
];

const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-base-100/80 backdrop-blur-lg border-t border-base-content/10 px-4 pb-safe pt-2 flex items-center justify-around md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {navLinks.map(({ to, icon: Icon, label }) => {
        const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
        
        return (
          <Link
            key={to}
            to={to}
            className={`relative flex flex-col items-center gap-1 py-1 px-3 transition-all ${
              isActive ? "text-primary" : "text-base-content/60"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-active"
                className="absolute -top-2 w-10 h-[3px] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--p),0.5)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className={`size-6 transition-transform ${isActive ? "scale-110" : "scale-100"}`} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
