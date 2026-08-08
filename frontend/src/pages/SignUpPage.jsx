import { useState } from "react";
import AnvaLogo from "../components/AnvaLogo";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";

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
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden"
      style={{ backgroundColor: "oklch(var(--b2))" }}
    >
      {/* Ambient background blobs */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "oklch(var(--p))" }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "oklch(var(--s))" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row w-full max-w-5xl mx-auto rounded-[2rem] shadow-2xl overflow-hidden relative z-10"
        style={{
          backgroundColor: "oklch(var(--b1))",
          border: "1px solid oklch(var(--bc) / 0.12)",
        }}
      >
        {/* SIGNUP FORM — LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* Logo & Header */}
          <div className="mb-8 flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
            <Link to="/" className="flex items-center gap-2 group mb-1">
              <AnvaLogo
                className="h-10 w-10 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform"
                style={{ color: "oklch(var(--p))" }}
              />
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: "oklch(var(--bc))" }}
              >
                Anva
              </span>
            </Link>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: "oklch(var(--bc))" }}
            >
              Create an Account
            </h2>
            <p className="font-medium" style={{ color: "oklch(var(--bc) / 0.6)" }}>
              Join the ANVA network and start your learning adventure!
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl text-sm font-medium mb-6"
              style={{
                backgroundColor: "oklch(var(--er) / 0.12)",
                border: "1px solid oklch(var(--er) / 0.25)",
                color: "oklch(var(--er))",
              }}
            >
              {error.response?.data?.message || "An error occurred during sign up."}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-semibold ml-1"
                  style={{ color: "oklch(var(--bc) / 0.75)" }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "oklch(var(--bc) / 0.4)" }}
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-11 pr-5 py-3.5 rounded-2xl focus:outline-none transition-all font-medium"
                    style={{
                      backgroundColor: "oklch(var(--b2))",
                      color: "oklch(var(--bc))",
                      border: "1.5px solid oklch(var(--bc) / 0.12)",
                      caretColor: "oklch(var(--p))",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "oklch(var(--p))";
                      e.target.style.boxShadow = "0 0 0 3px oklch(var(--p) / 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "oklch(var(--bc) / 0.12)";
                      e.target.style.boxShadow = "none";
                    }}
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
                <label
                  className="text-sm font-semibold ml-1"
                  style={{ color: "oklch(var(--bc) / 0.75)" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "oklch(var(--bc) / 0.4)" }}
                  />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full pl-11 pr-5 py-3.5 rounded-2xl focus:outline-none transition-all font-medium"
                    style={{
                      backgroundColor: "oklch(var(--b2))",
                      color: "oklch(var(--bc))",
                      border: "1.5px solid oklch(var(--bc) / 0.12)",
                      caretColor: "oklch(var(--p))",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "oklch(var(--p))";
                      e.target.style.boxShadow = "0 0 0 3px oklch(var(--p) / 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "oklch(var(--bc) / 0.12)";
                      e.target.style.boxShadow = "none";
                    }}
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
                <label
                  className="text-sm font-semibold ml-1"
                  style={{ color: "oklch(var(--bc) / 0.75)" }}
                >
                  Secure Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                    style={{ color: "oklch(var(--bc) / 0.4)" }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-5 py-3.5 rounded-2xl focus:outline-none transition-all font-medium"
                    style={{
                      backgroundColor: "oklch(var(--b2))",
                      color: "oklch(var(--bc))",
                      border: "1.5px solid oklch(var(--bc) / 0.12)",
                      caretColor: "oklch(var(--p))",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "oklch(var(--p))";
                      e.target.style.boxShadow = "0 0 0 3px oklch(var(--p) / 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "oklch(var(--bc) / 0.12)";
                      e.target.style.boxShadow = "none";
                    }}
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <p
                  className="text-xs font-medium ml-1 mt-1"
                  style={{ color: "oklch(var(--bc) / 0.45)" }}
                >
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Terms checkbox */}
              <div className="pt-1 pb-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-0.5 w-5 h-5 rounded cursor-pointer shrink-0"
                    style={{ accentColor: "oklch(var(--p))" }}
                    required
                  />
                  <span
                    className="text-sm font-medium leading-tight"
                    style={{ color: "oklch(var(--bc) / 0.7)" }}
                  >
                    I agree to the{" "}
                    <span
                      className="font-bold group-hover:underline"
                      style={{ color: "oklch(var(--bc))" }}
                    >
                      terms of service
                    </span>{" "}
                    and{" "}
                    <span
                      className="font-bold group-hover:underline"
                      style={{ color: "oklch(var(--bc))" }}
                    >
                      privacy policy
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full font-semibold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
              style={{
                backgroundColor: "oklch(var(--p))",
                color: "oklch(var(--pc))",
                boxShadow: "0 4px 14px oklch(var(--p) / 0.4)",
              }}
              disabled={isPending}
              onMouseEnter={(e) =>
                !isPending && (e.currentTarget.style.opacity = "0.9")
              }
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {isPending ? (
                <>
                  <span
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: "oklch(var(--pc) / 0.3)",
                      borderTopColor: "oklch(var(--pc))",
                    }}
                  />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center mt-6">
              <p
                className="text-sm font-medium"
                style={{ color: "oklch(var(--bc) / 0.65)" }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold hover:underline"
                  style={{ color: "oklch(var(--bc))" }}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE ILLUSTRATION */}
        <div
          className="hidden lg:flex w-full lg:w-1/2 p-4"
          style={{ backgroundColor: "oklch(var(--b2) / 0.5)" }}
        >
          <div
            className="w-full h-full rounded-3xl flex flex-col items-center justify-center p-12 overflow-hidden relative"
            style={{
              backgroundColor: "oklch(var(--b3))",
              border: "1px solid oklch(var(--bc) / 0.1)",
            }}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--p) / 0.05), oklch(var(--s) / 0.05))",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative aspect-square w-full max-w-sm mx-auto z-10"
            >
              <img
                src="/i.png"
                alt="Language connection illustration"
                className="w-full h-full object-contain opacity-90"
                style={{ mixBlendMode: "multiply" }}
              />
            </motion.div>

            <div className="text-center space-y-3 mt-10 z-10">
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ color: "oklch(var(--bc))" }}
              >
                Expand your horizons
              </h2>
              <p
                className="font-medium max-w-xs mx-auto"
                style={{ color: "oklch(var(--bc) / 0.6)" }}
              >
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
