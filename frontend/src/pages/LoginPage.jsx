import { useState } from "react";
import AnvaBrandLogo from "../components/AnvaBrandLogo";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion";
import { ShieldAlert, User, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12"
      style={{ position: "relative", zIndex: 1, isolation: "isolate" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[400px] flex flex-col items-center"
      >
        {/* Brand logo — centered */}
        <Link
          to="/"
          className="mb-6 transition-opacity hover:opacity-60 active:scale-95"
        >
          <AnvaBrandLogo badgeSize="size-12" textSize="text-2xl" />
        </Link>

        {/* Mode Switcher Tabs */}
        <div className="w-full flex items-center gap-1 mb-6 p-1 rounded-xl bg-[#f5f5f7] border border-[#d2d2d7]">
          <button
            type="button"
            onClick={() => setIsAdminMode(false)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              !isAdminMode
                ? "bg-white text-[#1d1d1f] shadow-sm"
                : "text-[#6e6e73] hover:text-[#1d1d1f]"
            }`}
          >
            <User className="w-3.5 h-3.5" /> User Login
          </button>
          <button
            type="button"
            onClick={() => setIsAdminMode(true)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isAdminMode
                ? "bg-[#1d1d1f] text-white shadow-sm"
                : "text-[#6e6e73] hover:text-[#1d1d1f]"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Admin Login
          </button>
        </div>

        {/* Heading */}
        <h1
          className="text-[1.85rem] font-normal text-[#1d1d1f] tracking-tight text-center leading-tight mb-1.5 font-serif"
          style={{ fontFamily: "'Young Serif', 'Lora', Georgia, serif" }}
        >
          {isAdminMode ? "Admin Portal" : "Sign In to Anva"}
        </h1>

        {/* Subtitle */}
        <p
          className="text-[0.9375rem] text-[#6e6e73] text-center leading-relaxed mb-6 max-w-[320px]"
          style={{ fontFamily: "Nunito, -apple-system, system-ui, sans-serif" }}
        >
          {isAdminMode
            ? "Sign in with administrator credentials to manage platform features."
            : "Sign in to access your study network, compiler, and AI assistant."}
        </p>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-3.5 rounded-xl text-xs font-medium mb-4 bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30]"
          >
            {error.response?.data?.message || "An error occurred during login."}
          </motion.div>
        )}

        {/* Google SSO button */}
        {!isAdminMode && (
          <div className="w-full mb-4">
            <Link
              to="/sign-in"
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl font-medium text-[0.9rem] cursor-pointer transition-colors bg-white hover:bg-[#f5f5f7] border border-[#d2d2d7] text-[#1d1d1f]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </Link>

            <div className="relative flex items-center mt-4 mb-2">
              <div className="flex-grow border-t border-[#d2d2d7]" />
              <span className="flex-shrink-0 mx-3 text-[0.7rem] font-semibold uppercase tracking-widest text-[#8e8e93]">
                or sign in with email
              </span>
              <div className="flex-grow border-t border-[#d2d2d7]" />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-3.5">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[0.75rem] font-semibold text-[#6e6e73] uppercase tracking-wider">
                {isAdminMode ? "Admin Email" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8e93] pointer-events-none" />
                <input
                  type="email"
                  placeholder={isAdminMode ? "admin@example.com" : "user@example.com"}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-[0.9375rem] text-[#1d1d1f] bg-[#f5f5f7] border border-[#d2d2d7] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-all placeholder-[#aeaeb2]"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[0.75rem] font-semibold text-[#6e6e73] uppercase tracking-wider">
                  Password
                </label>
                {!isAdminMode && (
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#1d1d1f] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8e8e93] pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-[0.9375rem] text-[#1d1d1f] bg-[#f5f5f7] border border-[#d2d2d7] focus:bg-white focus:border-[#1d1d1f] focus:outline-none transition-all placeholder-[#aeaeb2]"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full font-semibold py-3.5 rounded-xl text-[0.9rem] cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 transition-colors bg-[#1d1d1f] text-white hover:bg-[#333336] active:scale-[0.99] mt-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : isAdminMode ? (
              <>
                <ShieldAlert className="w-4 h-4" /> Sign In as Admin
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs font-medium text-[#6e6e73]">
              Don&apos;t have an account?{" "}
              <Link to="/sign-up" className="font-semibold text-[#1d1d1f] hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </form>

        {/* Legal */}
        <p
          className="mt-8 text-center text-[0.75rem] text-[#aeaeb2] leading-relaxed max-w-[300px]"
          style={{ fontFamily: "Comfortaa, Plus Jakarta Sans, system-ui, sans-serif" }}
        >
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-[#1d1d1f] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-[#1d1d1f] hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
