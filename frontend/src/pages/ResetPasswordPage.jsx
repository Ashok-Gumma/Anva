import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ParticleBackground from "../components/ParticleBackground";
import {
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
} from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (newPassword) => resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success("Password reset successfully! You can now login.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to reset password.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(password);
  };

  return (
    <div
      data-theme="light"
      className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4 sm:p-6 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden"
    >
      {/* Subtle Constellation Canvas Background */}
      <ParticleBackground />

      {/* Decorative ambient backdrop glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-br from-indigo-300/15 via-blue-300/10 to-transparent blur-[90px] rounded-full" />
      </div>

      {/* ── MINIMAL RESET PASSWORD CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-7 sm:p-9 relative z-10"
      >
        {/* Top Brand Logo */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center select-none group">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
              An<span className="font-curly font-bold ml-0.5 text-indigo-600">va</span>
            </span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400">Security</span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            New password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Enter a strong new password for your account.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-3 rounded-xl text-xs font-medium mb-4 bg-red-50 border border-red-200 text-red-600 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>
              {error.response?.data?.message || "An error occurred. Please try again."}
            </span>
          </motion.div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="reset-password" className="text-xs font-semibold text-slate-700 block">
              New Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full font-bold py-3 px-4 rounded-xl text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm shadow-indigo-500/20 disabled:opacity-70 mt-5 cursor-pointer flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Updating password...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-5 border-t border-slate-100 mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
