import { motion } from "framer-motion";
import { Link } from "react-router";
import ParticleBackground from "./ParticleBackground";

/* ─────────────────────────────────────────────────────────────
   Minimal centered Auth Card Wrapper (Clerk pages: /sign-in, /sign-up)
──────────────────────────────────────────────────────────────── */
const AuthCardWrapper = ({ children }) => {
  return (
    <div
      data-theme="light"
      className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4 sm:p-6 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden"
    >
      {/* Subtle Constellation Canvas Background */}
      <ParticleBackground />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-br from-indigo-300/15 via-blue-300/10 to-transparent blur-[90px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[440px] bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-7 sm:p-9 relative z-10"
      >
        {/* Brand Logo */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center select-none group">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
              An<span className="font-curly font-bold ml-0.5 text-indigo-600">va</span>
            </span>
          </Link>
        </div>

        {/* Clerk form slot */}
        <div className="w-full" style={{ minWidth: 0 }}>
          {children}
        </div>

        {/* Legal */}
        <div className="text-center pt-5 border-t border-slate-100 mt-5">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-[320px] mx-auto">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-slate-600 font-semibold hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-slate-600 font-semibold hover:underline">
              Privacy
            </Link>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCardWrapper;

/* Backwards-compat exports */
export const IllustrationPanel = () => null;
export const AuthIllustrationPanel = () => null;
