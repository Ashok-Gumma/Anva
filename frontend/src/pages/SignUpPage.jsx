import { useState } from "react";
import AnvaLogo from "../components/AnvaLogo";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-base-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-[2rem] shadow-xl border border-base-content/10 overflow-hidden"
      >
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* LOGO & HEADER */}
          <div className="mb-8 flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
            <Link to="/" className="flex items-center gap-2 group mb-1 inline-flex">
              <AnvaLogo className="h-10 w-10 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform text-primary" />
              <span className="text-2xl font-bold tracking-tight text-base-content">Anva</span>
            </Link>
            <h2 className="text-3xl font-bold text-base-content tracking-tight">Create an Account</h2>
            <p className="text-base-content/60 font-medium">
              Join the ANVA network and start your learning adventure!
            </p>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-sm font-medium mb-6">
              {error.response?.data?.message || "An error occurred during sign up."}
            </motion.div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-4">
                {/* FULLNAME */}
                <div className="space-y-1.5 flex flex-col items-start">
                  <label className="text-sm font-semibold text-base-content/80 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>
                {/* EMAIL */}
                <div className="space-y-1.5 flex flex-col items-start">
                  <label className="text-sm font-semibold text-base-content/80 ml-1">Email Base</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                {/* PASSWORD */}
                <div className="space-y-1.5 flex flex-col items-start">
                  <label className="text-sm font-semibold text-base-content/80 ml-1">Secure Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <p className="text-xs text-base-content/50 font-medium ml-1 mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div className="pt-2 pb-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded text-primary focus:ring-primary border-base-content/20 transition-all cursor-pointer" required />
                    <span className="text-sm font-medium text-base-content/70 leading-tight">
                      I agree to the{" "}
                      <span className="text-base-content font-bold group-hover:underline">terms of service</span> and{" "}
                      <span className="text-base-content font-bold group-hover:underline">privacy policy</span>
                    </span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-primary-content font-semibold py-3.5 rounded-full shadow-md hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-sm font-medium text-base-content/70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-base-content font-bold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE IMAGE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-base-200/50 p-4">
          <div className="w-full h-full bg-base-300 rounded-3xl border border-base-content/10 flex flex-col items-center justify-center p-12 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 MIX"></div>
            {/* Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative aspect-square w-full max-w-sm mx-auto drop-shadow-xl z-10"
            >
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
            </motion.div>

            <div className="text-center space-y-3 mt-10 z-10">
              <h2 className="text-2xl font-bold text-base-content tracking-tight">Expand your horizons</h2>
              <p className="text-base-content/60 font-medium max-w-xs mx-auto">
                Join a highly intuitive network of native speakers and grow infinitely.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;

