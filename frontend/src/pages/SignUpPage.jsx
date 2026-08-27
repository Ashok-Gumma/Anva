import { useState, useMemo } from "react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";
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
        return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-500" };
      case 2:
        return { score: 2, label: "Fair", color: "bg-amber-500", text: "text-amber-600" };
      case 3:
        return { score: 3, label: "Good", color: "bg-blue-500", text: "text-blue-600" };
      case 4:
        return { score: 4, label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
      default:
        return { score: 0, label: "Too short", color: "bg-red-400", text: "text-red-500" };
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
      className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4 sm:p-6 font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden"
    >
      {/* Subtle Constellation Canvas Background */}
      <ParticleBackground />

      {/* Decorative ambient backdrop glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-gradient-to-br from-indigo-300/15 via-blue-300/10 to-transparent blur-[90px] rounded-full" />
      </div>

      {/* ── MINIMAL SIGN UP CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-7 sm:p-9 relative z-10"
      >
        {/* Top Header: Brand Logo */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center select-none group">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
              An<span className="font-curly font-bold ml-0.5 text-indigo-600">va</span>
            </span>
          </Link>
          <span className="text-[11px] font-bold text-slate-400">Free Access</span>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            Create an account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Start learning languages & code together.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-3 rounded-xl text-xs font-medium mb-4 bg-red-50 border border-red-200 text-red-600 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>
              {error.response?.data?.message || "Sign up failed. Please try again."}
            </span>
          </motion.div>
        )}

        {/* Google SSO Button */}
        <div className="mb-4">
          <Link
            to="/sign-up"
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

        {/* Registration Form */}
        <form onSubmit={handleSignup} className="space-y-3">
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="signup-name" className="text-xs font-semibold text-slate-700 block">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
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
            <label htmlFor="signup-email" className="text-xs font-semibold text-slate-700 block">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
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
            <label htmlFor="signup-password" className="text-xs font-semibold text-slate-700 block">
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
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
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Compact Password Strength Bar */}
            {signupData.password.length > 0 && (
              <div className="pt-1 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Strength</span>
                  <span className={`font-semibold ${passwordStrength.text}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"
                    }`}
                  />
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"
                    }`}
                  />
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"
                    }`}
                  />
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.score >= 4 ? passwordStrength.color : "bg-transparent"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Terms & Privacy Checkbox */}
          <div className="pt-1">
            <div className="flex items-start gap-2">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600 shrink-0"
                required
              />
              <label
                htmlFor="terms-checkbox"
                className="text-[11px] text-slate-500 leading-tight select-none cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-800 font-semibold hover:text-indigo-600 hover:underline"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  onClick={(e) => e.stopPropagation()}
                  className="text-slate-800 font-semibold hover:text-indigo-600 hover:underline"
                >
                  Privacy
                </Link>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full font-bold py-3 px-4 rounded-xl text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm shadow-indigo-500/20 disabled:opacity-70 mt-3 cursor-pointer flex items-center justify-center gap-2"
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

        {/* Footer */}
        <div className="text-center pt-5 border-t border-slate-100 mt-6">
          <p className="text-xs font-medium text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors ml-0.5"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
