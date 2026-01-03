import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  Handshake,
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      {/* LOGO */}
      <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <Handshake className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Anv
          </span>
        </Link>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            pathname === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 opacity-70" />
          Home
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            pathname === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 opacity-70" />
          Friends
        </Link>

        {/* ✅ FLASHCARDS */}
        <Link
          to="/flashcards"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            pathname === "/flashcards" ? "btn-active" : ""
          }`}
        >
          <BookOpenIcon className="size-5 opacity-70" />
          Flashcards
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            pathname === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 opacity-70" />
          Notifications
        </Link>
      </nav>

      {/* USER PROFILE */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={authUser?.profilePic || "/default-avatar.png"}
                alt={authUser?.fullName || "User Avatar"}
                onError={(e) =>
                  (e.currentTarget.src = "/default-avatar.png")
                }
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
