import { useState } from "react";
import AnvaLogo from "../components/AnvaLogo";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { googleLogin } from "../lib/api";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();
  const queryClient = useQueryClient();

  const { mutate: handleGoogleSuccess, isPending: isGooglePending } = useMutation({
    mutationFn: googleLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      console.error("Google Auth backend error", err);
    }
  });

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
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* LOGO & HEADER */}
          <div className="mb-10 flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
            <Link to="/" className="flex items-center gap-2 group mb-2 inline-flex">
              <AnvaLogo className="h-10 w-10 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform text-primary" />
              <span className="text-2xl font-bold tracking-tight text-base-content">Anva</span>
            </Link>
            <h2 className="text-3xl font-bold text-base-content tracking-tight">Welcome Back</h2>
            <p className="text-base-content/60 font-medium">
              Sign in to your account and continue your language journey.
            </p>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-sm font-medium mb-6">
              {error.response?.data?.message || "An error occurred during login."}
            </motion.div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-base-content/80 ml-1">Email</label>
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center w-full">
                    <label className="text-sm font-semibold text-base-content/80 ml-1">Password</label>
                    <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline pr-1">
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-primary-content font-semibold py-3.5 rounded-full shadow-md hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2" 
                disabled={isPending || isGooglePending}
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-base-content/10"></div>
                <span className="flex-shrink-0 mx-4 text-base-content/50 text-xs font-bold tracking-widest uppercase">Or</span>
                <div className="flex-grow border-t border-base-content/10"></div>
              </div>

              <div className="flex justify-center w-full">
                {isGooglePending ? (
                  <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                ) : (
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      handleGoogleSuccess(credentialResponse.credential);
                    }}
                    onError={() => {
                      console.log("Google Login Failed");
                    }}
                    theme="filled_black"
                    size="large"
                    shape="pill"
                  />
                )}
              </div>

              <div className="text-center mt-8">
                <p className="text-sm font-medium text-base-content/70">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-base-content font-bold hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-base-200/50 p-4">
          <div className="w-full h-full bg-base-300 rounded-3xl border border-base-content/10 flex flex-col items-center justify-center p-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 MIX"></div>
            {/* Illustration */}
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

