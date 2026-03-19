import { useState } from "react";
import AnvaLogo from "../components/AnvaLogo";
import { Link, useParams, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col w-full max-w-lg mx-auto bg-base-100 rounded-[2rem] shadow-xl border border-base-content/10 overflow-hidden p-8 sm:p-12"
      >
        <div className="mb-8 flex flex-col items-center text-center gap-3">
          <Link to="/" className="flex items-center gap-2 group mb-2 inline-flex">
            <AnvaLogo className="h-10 w-10 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform text-primary" />
            <span className="text-2xl font-bold tracking-tight text-base-content">Anva</span>
          </Link>
          <h2 className="text-3xl font-bold text-base-content tracking-tight">Reset Password</h2>
          <p className="text-base-content/60 font-medium">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 flex flex-col items-start w-full">
            <label className="text-sm font-semibold text-base-content/80 ml-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-primary-content font-semibold py-3.5 rounded-full shadow-md hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin"></span>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
