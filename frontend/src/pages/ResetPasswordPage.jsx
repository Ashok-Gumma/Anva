import { useState } from "react";
import AnvaBrandLogo from "../components/AnvaBrandLogo";
import { Link, useParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation({
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-200/90 relative selection:bg-primary selection:text-primary-content">
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md mx-auto rounded-3xl bg-base-100 border border-base-content/10 shadow-xl shadow-base-content/5 p-6 sm:p-10 relative z-10"
      >
        <div className="mb-6 space-y-2 text-center flex flex-col items-center">
          <Link to="/" className="inline-flex items-center gap-2 group transition-transform active:scale-95 mb-1">
            <AnvaBrandLogo badgeSize="size-8" textSize="text-xl" />
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mt-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-base-content">
            Reset Password
          </h2>
          <p className="text-xs text-base-content/60 font-medium leading-relaxed max-w-xs">
            Choose a strong new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs font-semibold bg-base-200 border border-base-content/10 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 transition-all bg-primary text-primary-content hover:opacity-90 active:scale-[0.98] shadow-md mt-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-base-content/70 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
