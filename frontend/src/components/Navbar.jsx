import AnvaLogo from "./AnvaLogo";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, Settings } from "lucide-react";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE OR MOBILE */}
          {isChatPage && (
            <div className="pl-2">
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <AnvaLogo className="h-8 w-8 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform text-primary" />
                <span className="text-base-content font-bold text-xl tracking-tight hidden sm:block">Anva</span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <ThemeSelector />
            <Link to={"/notifications"} className="p-2 rounded-full hover:bg-base-200 transition-colors">
              <BellIcon className="h-5 w-5 text-base-content/80" />
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end ml-1 sm:ml-2">
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
            
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-md dropdown-content bg-base-100 rounded-2xl w-48 border border-base-content/10 flex flex-col gap-1">
              <li className="px-3 py-2 border-b border-base-content/10 mb-1">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-base-content text-sm truncate">{authUser?.fullName}</span>
                  <span className="text-xs text-base-content/60 truncate opacity-90">{authUser?.email}</span>
                </div>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

