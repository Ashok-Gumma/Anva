import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  LifeBuoy,
  ShieldAlert,
} from "lucide-react";
import useLogout from "../hooks/useLogout";

const SuspendedAccountScreen = ({ authUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const { logoutMutation, isPending: isLoggingOut } = useLogout();
  const navigate = useNavigate();

  // Calculate days left (e.g. from 180 days appeal window or suspendedUntil date)
  const now = new Date();
  const suspendedAt = authUser?.suspendedAt ? new Date(authUser.suspendedAt) : now;
  
  // Format suspended date (e.g., "24 August 2026")
  const formattedSuspendedDate = suspendedAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate remaining appeal days (Default 180 days Instagram policy window)
  const expiryDate = new Date(suspendedAt.getTime() + 15 * 24 * 60 * 60 * 1000);
  const diffTime = expiryDate.getTime() - now.getTime();
  const daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div
      data-theme="light"
      className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-200 flex flex-col justify-between relative overflow-x-hidden"
    >
      {/* ── 1. INSTAGRAM-STYLE TOP HEADER ── */}
      <header className="w-full max-w-xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-100/80 bg-white sticky top-0 z-30">
        {/* Brand Wordmark */}
        <div className="flex items-center">
          <span className="font-serif text-2xl font-bold tracking-tight text-black italic">
            Anva
          </span>
        </div>

        {/* Hamburger Menu Trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open Options"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </header>

      {/* ── Slide-Down Menu Overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 bg-white rounded-2xl border border-zinc-200/90 shadow-2xl p-2 z-40 space-y-1"
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate("/support");
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <LifeBuoy className="size-4 text-zinc-600" />
              <span>Help & Support Center</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setShowGuidelines(true);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <ShieldAlert className="size-4 text-zinc-600" />
              <span>Community Guidelines</span>
            </button>

            <div className="h-px bg-zinc-100 my-1" />

            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => {
                setMenuOpen(false);
                if (window.confirm("Are you sure you want to log out?")) {
                  logoutMutation();
                }
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. CENTER SUSPENSION HERO ── */}
      <main className="flex-1 max-w-md sm:max-w-lg w-full mx-auto px-6 py-8 sm:py-12 flex flex-col items-center text-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          {/* User Profile Avatar */}
          <div className="relative size-24 sm:size-28 rounded-full p-1 bg-zinc-100 border border-zinc-200/90 shadow-sm flex items-center justify-center mb-6">
            <div className="size-full rounded-full overflow-hidden bg-zinc-100 flex items-center justify-center text-zinc-800 font-bold text-3xl">
              {authUser?.profilePic ? (
                <img
                  src={authUser.profilePic}
                  alt={authUser?.fullName}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>{authUser?.fullName?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>
          </div>

          {/* Headline (Matching Instagram exact format) */}
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-black tracking-tight leading-tight mb-3">
            We suspended your account,
            <br />
            <span className="font-extrabold">{authUser?.fullName || "there"}</span>
          </h1>

          {/* Subheading: Days left to appeal */}
          <p className="text-sm sm:text-base font-normal text-zinc-800 leading-snug max-w-xs sm:max-w-sm mb-2">
            {daysLeft} days left to appeal or we&apos;ll permanently disable your account
          </p>

          {/* Suspended on date */}
          <p className="text-xs sm:text-sm text-zinc-500 font-normal mb-8">
            Suspended on {formattedSuspendedDate}
          </p>

          {/* ── Explanatory Details Box ── */}
          <div className="w-full bg-zinc-50 border border-zinc-200/70 rounded-2xl p-4 sm:p-5 text-left mb-8 space-y-3.5">
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                What does this mean?
              </h2>
              <ul className="text-xs sm:text-[13px] text-zinc-600 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span>
                    Your account doesn&apos;t follow our <strong>Community Guidelines</strong> on platform integrity, respectful study discussions, and communication.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span>
                    No one can see your profile or interact with your study notes, chats, or calls.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400 mt-0.5">•</span>
                  <span>
                    If you believe this was a mistake, you can submit an appeal with additional context to our review team.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── 3. ACTION BUTTONS ── */}
          <div className="w-full space-y-3">
            {/* Primary Action Button: Disagree with decision */}
            <Link
              to="/support"
              className="w-full py-3.5 px-6 rounded-xl bg-[#0095f6] hover:bg-[#1877f2] text-white font-bold text-sm tracking-normal flex items-center justify-center transition-colors shadow-xs"
            >
              Disagree with decision
            </Link>

            {/* Secondary Link: Log out */}
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  logoutMutation();
                }
              }}
              className="w-full py-3 text-sm font-semibold text-zinc-700 hover:text-black transition-colors"
            >
              {isLoggingOut ? "Signing out..." : "Log out"}
            </button>
          </div>
        </motion.div>
      </main>

      {/* ── 4. FOOTER ── */}
      <footer className="w-full max-w-xl mx-auto px-6 py-6 border-t border-zinc-100 text-center text-xs text-zinc-400 font-medium">
        <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
          <Link to="/terms" className="hover:text-zinc-700 transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-zinc-700 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/support" className="hover:text-zinc-700 transition-colors">
            Support Desk
          </Link>
        </div>
        <p className="text-[11px] text-zinc-400">
          Anva &copy; {new Date().getFullYear()} from Meta / Global Education Network
        </p>
      </footer>

      {/* ── Guidelines Modal Dialog ── */}
      <AnimatePresence>
        {showGuidelines && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-zinc-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-zinc-900">
                  Community Guidelines
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGuidelines(false)}
                  className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-900"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="text-xs text-zinc-600 space-y-3 leading-relaxed max-h-72 overflow-y-auto pr-1">
                <p>
                  Anva is built on positive, authentic collaboration between students and learners globally. We strictly prohibit:
                </p>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li>Harassment, bullying, or derogatory language in peer chats and study feeds.</li>
                  <li>Impersonation, deceptive identity, or spamming automated messages.</li>
                  <li>Academic dishonesty or distribution of malicious files in code compiler rooms.</li>
                  <li>Violating user privacy or sharing unconsented media during video calls.</li>
                </ul>
                <p>
                  To request account review, submit an appeal detailing the situation via the Support Desk.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowGuidelines(false)}
                className="w-full py-2.5 bg-zinc-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-colors"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuspendedAccountScreen;
