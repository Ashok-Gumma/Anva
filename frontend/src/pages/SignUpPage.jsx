import { useState, useMemo } from "react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";
import { useSignUp as useClerkSignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground";
import {
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { isPending, error, signupMutation } = useSignUp();
  const { signUp, isLoaded: isSignUpLoaded } = useClerkSignUp();

  const handleGoogleSignUp = async () => {
    if (!isSignUpLoaded || !signUp) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
    } catch (err) {
      console.error("Google sign-up error:", err);
    }
  };

  // Real-time password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = signupData.password;
    if (!pwd) return { score: 0, label: "", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-600" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
      case 3:
        return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-600" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
      default:
        return { score: 0, label: "Too short", color: "bg-rose-400", text: "text-rose-600" };
    }
  }, [signupData.password]);

  const handleSignup = (e) => {
    e.preventDefault();

    if (!signupData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    signupMutation(signupData);
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
            {/* Top Brand Header & Badge */}
            <div className="flex items-center justify-between mb-7">
              <Link to="/" className="inline-flex items-center gap-1 group select-none">
                <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
                  An<span className="text-indigo-600 font-bold">va</span>
                </span>
              </Link>

              <span className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free Access</span>
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Create an account
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Join a vibrant community of learners and practice coding with peers.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl text-xs font-medium mb-4 bg-red-50 border border-red-200 text-red-700 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>
                  {error.response?.data?.message || "Sign up failed. Please try again."}
                </span>
              </motion.div>
            )}

            {/* Google OAuth Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignUp}
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
              <div className="relative flex items-center my-3.5">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink-0 mx-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  or sign up with email
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSignup} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label
                  htmlFor="signup-name"
                  className="text-xs font-semibold text-slate-700 block"
                >
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Alex Smith"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-sm bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label
                  htmlFor="signup-email"
                  className="text-xs font-semibold text-slate-700 block"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-sm bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  htmlFor="signup-password"
                  className="text-xs font-semibold text-slate-700 block"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl text-sm bg-slate-50/50 border border-slate-200 focus:border-indigo-600 focus:bg-white focus:ring-3 focus:ring-indigo-100 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                    minLength={6}
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

                {/* Password Strength Meter */}
                {signupData.password.length > 0 && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Strength</span>
                      <span className={`font-semibold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"
                        }`}
                      />
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 4 ? passwordStrength.color : "bg-transparent"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <div className="flex items-start gap-2.5">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600 shrink-0"
                    required
                  />
                  <label
                    htmlFor="terms-checkbox"
                    className="text-xs text-slate-500 leading-relaxed select-none cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-800 font-semibold hover:text-indigo-600 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-800 font-semibold hover:text-indigo-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full font-bold py-3 sm:py-3.5 px-4 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm shadow-indigo-200 disabled:opacity-70 mt-3 cursor-pointer flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center pt-5 border-t border-slate-100 mt-5">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL: VECTOR ILLUSTRATION & SHOWCASE (5 cols on lg) ── */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-slate-50 via-slate-50 to-indigo-50/30 p-8 border-l border-slate-100 flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-white shadow-2xs border border-slate-200/70 p-3 flex items-center justify-center">
            <img
              src="/auth-signup-vector.jpg"
              alt="Sign Up Illustration"
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-base font-bold text-slate-800 mt-5">
            Start learning with peers
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[260px] leading-relaxed">
            Engage in video chats, live code collaboration, and AI practice partners anytime.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
