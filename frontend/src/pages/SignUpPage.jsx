import { useState, useMemo } from "react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, User, Mail, Lock, Sparkles, CheckCircle2 } from "lucide-react";
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
    <div data-theme="light" className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 sm:p-6 md:p-8 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-4xl lg:max-w-[960px] bg-white rounded-[28px] border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10"
      >
        {/* LEFT PANE - FORM */}
        <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-between">
          <div>
            {/* Top Bar: Brand Logo (Text only) */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center select-none group">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight group-hover:opacity-90 transition-opacity">
                  An<span className="font-curly font-bold ml-0.5 text-indigo-600">va</span>
                </span>
              </Link>
            </div>

            {/* Heading & Subtitle */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1.5">
                Create an Account
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Join Anva to connect, code, and learn languages together.
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="p-3.5 rounded-xl text-xs font-semibold mb-5 bg-red-50 border border-red-200 text-red-600 flex items-start gap-2.5 shadow-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{error.response?.data?.message || "An error occurred during sign up. Please try again."}</span>
              </motion.div>
            )}

            {/* Google / Clerk SSO Button */}
            <div className="mb-5">
              <Link
                to="/sign-up"
                className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl font-semibold text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
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
                <span>Continue with Google / Clerk</span>
              </Link>

              <div className="relative flex items-center mt-5 mb-4">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink-0 mx-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  OR SIGN UP WITH EMAIL
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSignup} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1.5">
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-[#f1f3f5] border border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
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
                    placeholder="hello@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-[#f1f3f5] border border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
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
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm bg-[#f1f3f5] border border-transparent focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 font-medium"
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
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator Bar */}
                {signupData.password.length > 0 && (
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Strength:</span>
                      <span className={`font-bold ${passwordStrength.text}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-transparent"}`} />
                      <div className={`h-full transition-all ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-transparent"}`} />
                      <div className={`h-full transition-all ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-transparent"}`} />
                      <div className={`h-full transition-all ${passwordStrength.score >= 4 ? passwordStrength.color : "bg-transparent"}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms & Privacy Checkbox */}
              <div className="pt-2">
                <div className="flex items-start gap-2.5">
                  <input
                    id="terms-checkbox"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer accent-indigo-600 shrink-0"
                    required
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-slate-500 font-medium leading-relaxed select-none cursor-pointer">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-900 font-semibold hover:text-indigo-600 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-900 font-semibold hover:text-indigo-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                className="w-full font-semibold py-3.5 px-4 rounded-xl text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-500/25 disabled:opacity-70 mt-4 cursor-pointer flex items-center justify-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          {/* Footer switch link */}
          <div className="text-center pt-6 border-t border-slate-100 mt-6">
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
        </div>

        {/* RIGHT PANE - ILLUSTRATION & PITCH */}
        <div className="hidden lg:flex p-4">
          <div className="w-full h-full rounded-[24px] bg-gradient-to-br from-indigo-50/70 via-slate-50 to-indigo-100/50 border border-indigo-100/60 flex flex-col items-center justify-between p-8 sm:p-10 text-center relative overflow-hidden">
            {/* Top feature badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 text-indigo-700 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Free & Open Study Community</span>
            </div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-full max-w-[280px] aspect-square flex items-center justify-center my-auto rounded-2xl overflow-hidden"
            >
              <img
                src="/auth-signup.jpg"
                alt="Master languages with native peers"
                className="w-full h-full object-contain rounded-2xl drop-shadow-md"
              />
            </motion.div>

            {/* Pitch Text & Feature Highlights */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Master skills with native peers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[290px] mx-auto">
                Connect with native speakers, practice in real time, and build your fluency together.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200/80 text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Real-time Peer Voice
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/90 border border-slate-200/80 text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> AI Assistant
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
