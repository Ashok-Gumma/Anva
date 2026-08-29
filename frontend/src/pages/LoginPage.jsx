import { useState } from "react";
import { Link } from "react-router";
import { useSignIn } from "@clerk/clerk-react";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion";
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
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const handleGoogleSignIn = async () => {
    if (!isSignInLoaded || !signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
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
            {/* Top Brand Header & Admin Toggle */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="inline-flex items-center gap-1 group select-none">
                <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
                  An<span className="text-indigo-600 font-bold">va</span>
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isAdminMode
                    ? "bg-amber-50 border-amber-300 text-amber-800 shadow-2xs"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
                }`}
              >
                {isAdminMode ? (
                  <>
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>User Mode</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                    <span>Admin Portal</span>
                  </>
                )}
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                {isAdminMode ? "Admin Sign In" : "Welcome Back"}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                {isAdminMode
                  ? "Access the administrative management dashboard."
                  : "Sign in to continue your learning journey and connect with peers."}
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
                  {error.response?.data?.message || "Invalid credentials. Please try again."}
                </span>
              </motion.div>
            )}

            {/* Google OAuth (User Mode) */}
            {!isAdminMode && (
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center justify-center gap-3 w-full py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:border-slate-300 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    className="w-5 h-5 shrink-0"
                  >
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
                </button>

                {/* Divider */}
                <div className="relative flex items-center my-4">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="flex-shrink-0 mx-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    or sign in with email
                  </span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="text-xs font-semibold text-slate-700 block"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={isAdminMode ? "admin@anva.com" : "name@example.com"}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-sm bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-semibold text-slate-700 block"
                  >
                    Password
                  </label>
                  {!isAdminMode && (
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                    >
                      Forgot password?
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
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl text-sm bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
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
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className={`w-full font-bold py-3 sm:py-3.5 px-4 rounded-xl text-sm text-white transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 mt-5 cursor-pointer flex items-center justify-center gap-2 ${
                  isAdminMode
                    ? "bg-slate-900 hover:bg-slate-800"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
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
                    <span>Sign In to Admin Portal</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-slate-100 mt-6">
            <p className="text-sm text-slate-500 font-medium">
              Don&apos;t have an account yet?{" "}
              <Link
                to="/signup"
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL: VECTOR ILLUSTRATION & SHOWCASE (5 cols on lg) ── */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-slate-50 via-slate-50 to-indigo-50/30 p-8 border-l border-slate-100 flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-white shadow-2xs border border-slate-200/70 p-3 flex items-center justify-center">
            <img
              src="/auth-login-vector.jpg"
              alt="Login Illustration"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-base font-bold text-slate-800 mt-5">
            Learn, build & connect together
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">
            Join thousands of developers mastering languages with real-time AI peers.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
