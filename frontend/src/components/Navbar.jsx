import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, User } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  const [isOnline, setIsOnline] = useState(false);

  // ✅ Real-time presence
  useEffect(() => {
    if (!authUser) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);

    const handlePresence = (event) => {
      if (event.user?.id === authUser._id) {
        setIsOnline(event.user.online);
      }
    };

    client.on("user.presence.changed", handlePresence);

    return () => {
      client.off("user.presence.changed", handlePresence);
    };
  }, [authUser]);

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">

        {/* LEFT SIDE (Logo only on chat page) */}
        {isChatPage && (
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">ANVA</span>
          </Link>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Notifications */}
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle">
              <BellIcon className="h-6 w-6 opacity-70" />
            </button>
          </Link>

          {/* Theme */}
          <ThemeSelector />

          {/* ✅ PROFILE DROPDOWN */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="relative w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {/* Avatar fallback */}
              <span className="absolute inset-0 flex items-center justify-center">
                {authUser?.fullName?.charAt(0)?.toUpperCase()}
              </span>

              {/* Profile image */}
              {authUser?.profilePic && (
                <img
                  src={authUser.profilePic}
                  alt="avatar"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* 🟢 Online indicator */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-200 ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>

            {/* Dropdown menu */}
            <ul className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-48">
              
              {/* Profile */}
              <li>
                <Link to="/profile">
                  <User size={16} /> Profile
                </Link>
              </li>

              {/* Logout */}
              <li>
                <button onClick={logoutMutation}>
                  <LogOutIcon size={16} /> Logout
                </button>
              </li>

            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;