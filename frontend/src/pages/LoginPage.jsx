import { useState } from "react";
import AnvaLogo from "../components/AnvaLogo";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-[2rem] shadow-xl border border-base-content/10 overflow-hidden"
      >
        {/* FORM */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8 flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
            <Link to="/" className="flex items-center gap-2 group mb-2 inline-flex">
              <AnvaLogo className="h-10 w-10 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform text-primary" />
              <span className="text-2xl font-bold tracking-tight text-base-content">Anva</span>
            </Link>
            <h2 className="text-3xl font-bold text-base-content tracking-tight">Welcome Back</h2>
            <p className="text-base-content/60 font-medium">Sign in to continue your language journey.</p>
          </div>

          {/* ── Clerk Sign-In (Google, GitHub, Email magic link) ── */}
          <Link
            to="/sign-in"
            className="mb-6 flex items-center justify-center gap-3 w-full py-3.5 px-5 rounded-2xl border border-base-content/15 bg-base-200 hover:bg-base-300 transition-colors font-semibold text-base-content text-sm shadow-sm"
          >
            {/* Google coloured G */}
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google / Clerk
          </Link>

          <div className="relative flex items-center mb-5">
            <div className="flex-grow border-t border-base-content/10" />
            <span className="flex-shrink-0 mx-4 text-base-content/40 text-xs font-bold tracking-widest uppercase">or email & password</span>
            <div className="flex-grow border-t border-base-content/10" />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-sm font-medium mb-5">
              {error.response?.data?.message || "An error occurred during login."}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-base-content/80 ml-1">Email</label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-base-content/40 font-medium"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-base-content/80 ml-1">Password</label>
                  <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline pr-1">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-base-content/40 font-medium"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-content font-semibold py-3.5 rounded-full shadow-md hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>

            <div className="text-center">
              <p className="text-sm font-medium text-base-content/70">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-primary font-bold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* ILLUSTRATION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-base-200/50 p-4">
          <div className="w-full h-full bg-base-300 rounded-3xl border border-base-content/10 flex flex-col items-center justify-center p-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative aspect-square w-full max-w-sm mx-auto drop-shadow-xl z-10"
            >
              <img src="/i.png" alt="Language connection" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
            </motion.div>
            <div className="text-center space-y-3 mt-10 z-10">
              <h2 className="text-2xl font-bold text-base-content tracking-tight">Connect with language friends worldwide</h2>
              <p className="text-base-content/60 font-medium max-w-xs mx-auto">
                Practice conversations, make friends, and elevate your linguistics natively.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
