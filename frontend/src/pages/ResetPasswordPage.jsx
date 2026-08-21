import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-4xl lg:max-w-[960px] bg-white rounded-[28px] border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10"
      >
        {/* LEFT PANE - FORM */}
        <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            {/* Top Bar: Brand Logo (Text only) */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center select-none group">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
                  An<span className="font-curly font-bold ml-0.5 text-indigo-600">va</span>
                </span>
              </Link>
            </div>

            {/* Heading & Subtitle */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1.5">
                Reset Password
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Choose a strong new password for your Anva account.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="p-3.5 rounded-xl text-xs font-semibold mb-5 bg-red-50 border border-red-200 text-red-600 flex items-start gap-2.5 shadow-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{error.response?.data?.message || "An error occurred. Please try again."}</span>
              </motion.div>
            )}

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
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
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm bg-[#f1f3f5] border border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full font-semibold py-3.5 px-4 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-500/25 disabled:opacity-70 mt-6 cursor-pointer flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Resetting password...</span>
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>

          {/* Footer Back to Login link */}
          <div className="pt-6 border-t border-slate-100 mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        </div>

        {/* RIGHT PANE - ILLUSTRATION & PITCH */}
        <div className="hidden lg:flex p-3 sm:p-4">
          <div className="w-full h-full rounded-[24px] bg-[#eef1f6] flex flex-col items-center justify-center p-8 sm:p-10 text-center relative overflow-hidden">
            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-full max-w-[320px] aspect-square flex items-center justify-center mb-6 rounded-2xl overflow-hidden"
            >
              <img
                src="/auth-forgot.jpg"
                alt="Account security"
                className="w-full h-full object-contain rounded-2xl drop-shadow-sm"
              />
            </motion.div>

            {/* Pitch Text */}
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Stay safe & learn freely
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[280px]">
              Set your new password to resume your interactive language learning.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
