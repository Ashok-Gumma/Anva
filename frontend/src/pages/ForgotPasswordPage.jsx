import { useState } from "react";
import AnvaLogo from "../components/AnvaLogo";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../lib/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data.resetToken) {
        toast.success(
          <div className="text-center">
            Reset link generated! <br/>
            Since there's no email service, <a href={`/reset-password/${data.resetToken}`} className="underline font-bold text-primary">click here</a> to reset.
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
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(email);
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
          <h2 className="text-3xl font-bold text-base-content tracking-tight">Forgot Password</h2>
          <p className="text-base-content/60 font-medium">
            Enter your email address and we'll help you reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 flex flex-col items-start w-full">
            <label className="text-sm font-semibold text-base-content/80 ml-1">Email</label>
            <input
              type="email"
              placeholder="hello@example.com"
              className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          <div className="text-center mt-8">
            <p className="text-sm font-medium text-base-content/70">
              Remembered your password?{" "}
              <Link to="/login" className="text-base-content font-bold hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
