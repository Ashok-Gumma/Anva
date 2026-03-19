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
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-base-100 border-r border-base-content/10 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm z-20">
      {/* LOGO */}
      <div className="p-5 border-b border-base-content/10 flex items-center h-16">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <AnvaLogo className="h-8 w-8 object-cover rounded-lg drop-shadow-sm group-hover:scale-105 transition-transform text-primary" />
          <span className="text-base-content font-bold text-xl tracking-tight hidden sm:block">Anva</span>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <Link
          to="/"
          className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all ${
            pathname === "/" ? "bg-base-300 text-base-content font-semibold" : "text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium"
          }`}
        >
          <HomeIcon className={`size-5 ${pathname === "/" ? "text-base-content" : "opacity-70"}`} />
          Home
        </Link>

        <Link
          to="/friends"
          className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all ${
            pathname === "/friends" ? "bg-base-300 text-base-content font-semibold" : "text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium"
          }`}
        >
          <UsersIcon className={`size-5 ${pathname === "/friends" ? "text-base-content" : "opacity-70"}`} />
          Friends
        </Link>

        {/* FLASHCARDS */}
        <Link
          to="/flashcards"
          className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all ${
            pathname === "/flashcards" ? "bg-base-300 text-base-content font-semibold" : "text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium"
          }`}
        >
          <BookOpenIcon className={`size-5 ${pathname === "/flashcards" ? "text-base-content" : "opacity-70"}`} />
          Flashcards
        </Link>

        {/* COMPILER */}
        <Link
          to="/compiler"
          className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all ${
            pathname === "/compiler" ? "bg-base-300 text-base-content font-semibold" : "text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium"
          }`}
        >
          <Code className={`size-5 ${pathname === "/compiler" ? "text-base-content" : "opacity-70"}`} />
          Compiler
        </Link>

        {/* ASSISTANT */}
        <Link
          to="/assistant"
          className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all ${
            pathname === "/assistant" ? "bg-base-300 text-base-content font-semibold" : "text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium"
          }`}
        >
          <BrainCircuit className={`size-5 ${pathname === "/assistant" ? "text-base-content" : "opacity-70"}`} />
          Assistant
        </Link>

        <Link
          to="/notifications"
          className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-xl transition-all ${
            pathname === "/notifications" ? "bg-base-300 text-base-content font-semibold" : "text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium"
          }`}
        >
          <BellIcon className={`size-5 ${pathname === "/notifications" ? "text-base-content" : "opacity-70"}`} />
          Notifications
        </Link>
      </nav>

      {/* USER PROFILE */}
      <div className="p-4 border-t border-base-content/10 mt-auto bg-base-200/50">
        <div className="flex items-center gap-3">
          {/* Avatar with letter fallback */}
          <div className="relative w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm">
            {/* Letter fallback */}
            <span className="absolute inset-0 flex items-center justify-center">
              {authUser?.fullName?.charAt(0)?.toUpperCase()}
            </span>

            {/* Profile image */}
            {authUser?.profilePic && (
              <img
                src={authUser.profilePic}
                alt={authUser?.fullName || "User Avatar"}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-sm text-base-content tracking-tight">{authUser?.fullName}</p>
            <p className="text-xs text-info font-medium flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-info shadow-[0_0_5px_currentColor] animate-pulse" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
