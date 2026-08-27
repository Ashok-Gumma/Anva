import { useState } from "react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { motion, AnimatePresence } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground";
import {
  ShieldAlert,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
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

      {/* ── MINIMAL AUTH CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-7 sm:p-9 relative z-10"
      >
        {/* Top Header: Brand Logo & Admin Toggle */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center select-none group">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
              An<span className="font-curly font-bold ml-0.5 text-indigo-600">va</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer border ${
              isAdminMode
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
            }`}
          >
            {isAdminMode ? (
              <>
                <User className="w-3 h-3 text-amber-600" />
                <span>User</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 text-slate-500" />
                <span>Admin</span>
              </>
            )}
          </button>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            {isAdminMode ? "Admin Portal" : "Welcome back"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isAdminMode
              ? "Sign in with admin credentials."
              : "Enter your credentials to continue."}
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
              {error.response?.data?.message || "Invalid credentials. Please try again."}
            </span>
          </motion.div>
        )}

        {/* Google SSO Button (User Mode) */}
        {!isAdminMode && (
          <div className="mb-4">
            <Link
              to="/sign-in"
              className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>Continue with Google</span>
            </Link>

            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink-0 mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                OR
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="login-email" className="text-xs font-semibold text-slate-700 block">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder={isAdminMode ? "admin@anva.com" : "you@example.com"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="login-password" className="text-xs font-semibold text-slate-700">
                Password
              </label>
              {!isAdminMode && (
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  Forgot?
                </Link>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
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

          {/* Submit CTA */}
          <button
            type="submit"
            className={`w-full font-bold py-3 px-4 rounded-xl text-xs sm:text-sm text-white transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 mt-5 cursor-pointer flex items-center justify-center gap-2 ${
              isAdminMode
                ? "bg-slate-900 hover:bg-slate-800"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
            }`}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : isAdminMode ? (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Sign In as Admin</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-5 border-t border-slate-100 mt-6">
          <p className="text-xs font-medium text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors ml-0.5"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
