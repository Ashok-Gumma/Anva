import { useState } from "react";
import AnvaLogo from "../components/AnvaLogo";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion";
import { ShieldAlert, User, Lock } from "lucide-react";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-200 font-minimal selection:bg-primary selection:text-primary-content">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col lg:flex-row w-full max-w-4xl mx-auto bg-base-100 rounded-3xl shadow-xl border border-base-content/10 overflow-hidden font-minimal"
      >
        {/* FORM */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center font-minimal">
          
          {/* Mode Switcher Tabs (User vs Admin Login) */}
          <div className="flex items-center gap-1.5 mb-6 p-1 bg-base-200 rounded-2xl border border-base-content/10 font-minimal">
            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isAdminMode
                  ? "bg-base-100 text-primary shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              <User className="w-3.5 h-3.5" /> User Login
            </button>
            <button
              type="button"
              onClick={() => setIsAdminMode(true)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isAdminMode
                  ? "bg-primary text-primary-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Admin Login
            </button>
          </div>

          <div className="mb-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-1">
            <Link to="/" className="flex items-center gap-2 group mb-1 inline-flex">
              <AnvaLogo className="h-8 w-8 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform text-primary" />
              <span className="text-xl font-bold tracking-tight text-base-content font-minimal">Anva</span>
            </Link>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
              {isAdminMode ? (
                <>
                  Admin Command <span className="font-curly italic text-primary font-bold tracking-wide">Portal</span>
                </>
              ) : (
                <>
                  Sign In to <span className="font-curly italic text-primary font-bold tracking-wide">Anva</span>
                </>
              )}
            </h2>
            
            <p className="text-base-content/60 font-medium text-xs">
              {isAdminMode
                ? "Sign in with administrator credentials to access platform controls."
                : "Sign in to continue your language learning journey."}
            </p>
          </div>

          {!isAdminMode && (
            <>
              {/* ── Clerk Sign-In (Google, GitHub, Email magic link) ── */}
              <Link
                to="/sign-in"
                className="mb-4 flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-2xl border border-base-content/15 bg-base-200 hover:bg-base-300 transition-colors font-bold text-base-content text-xs shadow-sm cursor-pointer"
              >
                {/* Google coloured G */}
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google / Clerk
              </Link>

              <div className="relative flex items-center mb-4">
                <div className="flex-grow border-t border-base-content/10" />
                <span className="flex-shrink-0 mx-3 text-base-content/40 text-[10px] font-bold tracking-wider uppercase">or sign in with password</span>
                <div className="flex-grow border-t border-base-content/10" />
              </div>
            </>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-semibold mb-4">
              {error.response?.data?.message || "An error occurred during login."}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5 font-minimal">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                  {isAdminMode ? "Admin Email" : "Email Address"}
                </label>
                <input
                  type="email"
                  placeholder={isAdminMode ? "admin@example.com" : "user@example.com"}
                  className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary placeholder:font-normal"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">Password</label>
                  {!isAdminMode && (
                    <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary placeholder:font-normal"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full font-bold py-3 rounded-2xl bg-primary text-primary-content shadow-sm hover:shadow transition-all text-xs uppercase cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                "Authenticating..."
              ) : isAdminMode ? (
                <>
                  <ShieldAlert className="w-4 h-4" /> Sign In as Admin
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center pt-1">
              <p className="text-xs font-medium text-base-content/70">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-primary font-bold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* ILLUSTRATION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-base-200/50 p-4 font-minimal">
          <div className="w-full h-full bg-base-300/80 rounded-2xl border border-base-content/10 flex flex-col items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative aspect-square w-full max-w-xs mx-auto drop-shadow-md z-10 flex items-center justify-center"
            >
              {isAdminMode ? (
                <div className="p-8 bg-primary/10 rounded-3xl border border-primary/20 text-primary">
                  <ShieldAlert className="w-24 h-24" />
                </div>
              ) : (
                <img src="/i.png" alt="Language connection" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
              )}
            </motion.div>
            <div className="text-center space-y-2 mt-6 z-10">
              <h2 className="text-xl font-extrabold text-base-content tracking-tight">
                {isAdminMode ? (
                  <>
                    Administrator <span className="font-curly italic text-primary font-bold">Control & Audit</span>
                  </>
                ) : (
                  <>
                    Connect with <span className="font-curly italic text-primary font-bold">language friends worldwide</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-base-content/60 font-medium max-w-xs mx-auto">
                {isAdminMode
                  ? "Admin users review support complaints, manage platform permissions, and enforce policies."
                  : "Practice conversations, make friends, and elevate your linguistics natively."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
