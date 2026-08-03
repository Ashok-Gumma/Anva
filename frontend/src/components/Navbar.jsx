import AnvaLogo from "./AnvaLogo";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { 
  LogOutIcon, 
  Settings,
  HomeIcon, 
  UsersIcon, 
  BookOpenIcon, 
  BrainCircuit, 
  Code
} from "lucide-react";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import NotificationBadge from "./NotificationBadge";
import { UserButton, useAuth } from "@clerk/clerk-react";

const navLinks = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/friends", icon: UsersIcon, label: "Friends" },
  { to: "/flashcards", icon: BookOpenIcon, label: "Study Decks" },
  { to: "/compiler", icon: Code, label: "Compiler" },
  { to: "/assistant", icon: BrainCircuit, label: "AI Assistant" },
  { to: "/profile", icon: Settings, label: "Profile" },
];

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { isSignedIn: isClerkSignedIn } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const { logoutMutation } = useLogout();

  const isAuthenticated = Boolean(authUser) || isClerkSignedIn;

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full gap-4">
          
          {/* Logo Branding (Always Visible) */}
          <div className="shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <AnvaLogo className="h-8 w-8 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform text-primary" />
              <span className="text-base-content font-bold text-xl tracking-tight hidden sm:block">
                An<span className="font-curly font-bold italic text-primary text-2xl ml-0.5">va</span>
              </span>
            </Link>
          </div>

          {/* Centered Horizontal Navigation (Only on Larger screens if Authenticated) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1 lg:gap-2 mx-auto">
              {navLinks.map(({ to, icon: Icon, label }) => {
                const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                      isActive
                        ? "bg-primary/10 text-primary border-primary/20"
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

          {/* Right Side Settings & Profile Dropdown */}
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
            ) : (
              <Link to="/login" className="btn btn-outline btn-sm font-bold uppercase tracking-wider text-[10px] ml-1">
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
