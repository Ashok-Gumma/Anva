import { useState } from "react";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ParticleBackground from "../components/ParticleBackground";
import {
  ArrowLeft,
  AlertCircle,
  Mail,
  ArrowRight,
  KeyRound,
} from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending, error } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data.resetToken) {
        toast.success(
          <div className="text-center">
            Reset link generated! <br />
            <a
              href={`/reset-password/${data.resetToken}`}
              className="underline font-bold text-indigo-600"
            >
              Click here
            </a>{" "}
            to reset your password.
          </div>,
          { duration: 8000 }
        );
      } else {
        toast.success("Check your backend terminal for the reset link!");
      }
      setEmail("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(email);
  };

  return (
    <div
      data-theme="light"
      className="min-h-screen flex items-center justify-center bg-slate-100/70 p-4 sm:p-6 lg:p-8 font-sans antialiased relative selection:bg-indigo-500 selection:text-white overflow-x-hidden"
    >
      {/* Subtle particle background */}
      <ParticleBackground />

      {/* Decorative ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-blue-100/30 to-transparent blur-[100px] rounded-full" />
      </div>

      {/* ── MAIN AUTH CARD CONTAINER ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.08)] overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-12"
      >
        {/* ── LEFT PANEL: AUTH FORM (7 cols on lg) ── */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Top Brand Header & Badge */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="inline-flex items-center gap-1 group select-none">
                <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
                  An<span className="text-indigo-600 font-bold">va</span>
                </span>
              </Link>

              <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700">
                <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                <span>Recovery</span>
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Forgot password?
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enter your registered email address and we&apos;ll help you recover your account in seconds.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl text-xs font-medium mb-5 bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>
                  {error.response?.data?.message || "An error occurred. Please try again."}
                </span>
              </motion.div>
            )}

            {/* Reset Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="forgot-email"
                  className="text-xs font-semibold text-slate-700 block"
                >
                  Registered Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="forgot-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-sm bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full font-bold py-3 sm:py-3.5 px-4 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm shadow-indigo-200 disabled:opacity-70 mt-5 cursor-pointer flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating recovery link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Recovery Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-slate-100 mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        </div>

        {/* ── RIGHT PANEL: VECTOR ILLUSTRATION & SHOWCASE (5 cols on lg) ── */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-slate-50 via-slate-50 to-indigo-50/30 p-8 border-l border-slate-100 flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-white shadow-2xs border border-slate-200/70 p-3 flex items-center justify-center">
            <img
              src="/auth-forgot-vector.jpg"
              alt="Forgot Password Illustration"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-base font-bold text-slate-800 mt-5">
            Effortless account recovery
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">
            We help you safely regain access to your account and learning progress.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
