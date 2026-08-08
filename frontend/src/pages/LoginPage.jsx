import { useState } from "react";
import AnvaBrandLogo from "../components/AnvaBrandLogo";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";
import { motion } from "framer-motion";
import { ShieldAlert, User, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden"
      style={{ backgroundColor: "oklch(var(--b2))" }}
    >
      {/* Ambient background blobs */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "oklch(var(--p))" }}
      />
      <div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "oklch(var(--s))" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col lg:flex-row w-full max-w-4xl mx-auto rounded-3xl shadow-2xl overflow-hidden relative z-10"
        style={{
          backgroundColor: "oklch(var(--b1))",
          border: "1px solid oklch(var(--bc) / 0.12)",
        }}
      >
        {/* FORM PANEL */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-center">

          {/* Mode Tabs */}
          <div
            className="flex items-center gap-1.5 mb-6 p-1 rounded-2xl"
            style={{
              backgroundColor: "oklch(var(--b2))",
              border: "1px solid oklch(var(--bc) / 0.1)",
            }}
          >
            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              style={
                !isAdminMode
                  ? {
                      backgroundColor: "oklch(var(--b1))",
                      color: "oklch(var(--p))",
                      boxShadow: "0 1px 3px oklch(var(--bc) / 0.12)",
                    }
                  : { color: "oklch(var(--bc) / 0.55)" }
              }
            >
              <User className="w-3.5 h-3.5" /> User Login
            </button>
            <button
              type="button"
              onClick={() => setIsAdminMode(true)}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              style={
                isAdminMode
                  ? {
                      backgroundColor: "oklch(var(--p))",
                      color: "oklch(var(--pc))",
                      boxShadow: "0 1px 3px oklch(var(--bc) / 0.12)",
                    }
                  : { color: "oklch(var(--bc) / 0.55)" }
              }
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Admin Login
            </button>
          </div>

          {/* Logo & Heading */}
          <div className="mb-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-1">
            <Link to="/" className="mb-2 inline-flex">
              <AnvaBrandLogo badgeSize="size-9" textSize="text-2xl" />
            </Link>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight"
              style={{ color: "oklch(var(--bc))" }}
            >
              {isAdminMode ? (
                <>
                  Admin Command{" "}
                  <span
                    className="font-curly italic font-bold"
                    style={{ color: "oklch(var(--p))" }}
                  >
                    Portal
                  </span>
                </>
              ) : (
                <>
                  Sign In to{" "}
                  <span
                    className="font-curly italic font-bold"
                    style={{ color: "oklch(var(--p))" }}
                  >
                    Anva
                  </span>
                </>
              )}
            </h2>
            <p className="font-medium text-xs" style={{ color: "oklch(var(--bc) / 0.6)" }}>
              {isAdminMode
                ? "Sign in with administrator credentials to access platform controls."
                : "Sign in to continue your language learning journey."}
            </p>
          </div>

          {/* Google/Clerk SSO (user mode only) */}
          {!isAdminMode && (
            <>
              <Link
                to="/sign-in"
                className="mb-4 flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-2xl font-bold text-xs cursor-pointer transition-colors"
                style={{
                  backgroundColor: "oklch(var(--b2))",
                  color: "oklch(var(--bc))",
                  border: "1px solid oklch(var(--bc) / 0.15)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "oklch(var(--b3))")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "oklch(var(--b2))")
                }
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                Continue with Google / Clerk
              </Link>

              <div className="relative flex items-center mb-4">
                <div
                  className="flex-grow border-t"
                  style={{ borderColor: "oklch(var(--bc) / 0.1)" }}
                />
                <span
                  className="flex-shrink-0 mx-3 text-[10px] font-bold tracking-wider uppercase"
                  style={{ color: "oklch(var(--bc) / 0.4)" }}
                >
                  or sign in with password
                </span>
                <div
                  className="flex-grow border-t"
                  style={{ borderColor: "oklch(var(--bc) / 0.1)" }}
                />
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-2xl text-xs font-semibold mb-4"
              style={{
                backgroundColor: "oklch(var(--er) / 0.12)",
                border: "1px solid oklch(var(--er) / 0.25)",
                color: "oklch(var(--er))",
              }}
            >
              {error.response?.data?.message || "An error occurred during login."}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div className="space-y-3">
              {/* Email */}
              <div className="space-y-1">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "oklch(var(--bc) / 0.65)" }}
                >
                  {isAdminMode ? "Admin Email" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                    style={{ color: "oklch(var(--bc) / 0.4)" }}
                  />
                  <input
                    type="email"
                    placeholder={isAdminMode ? "admin@example.com" : "user@example.com"}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl text-xs font-medium focus:outline-none transition-all"
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
                  <label
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "oklch(var(--bc) / 0.65)" }}
                  >
                    Password
                  </label>
                  {!isAdminMode && (
                    <Link
                      to="/forgot-password"
                      className="text-xs font-bold hover:underline"
                      style={{ color: "oklch(var(--p))" }}
                    >
                      Forgot Password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                    style={{ color: "oklch(var(--bc) / 0.4)" }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-3 rounded-2xl text-xs font-medium focus:outline-none transition-all"
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
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full font-bold py-3 rounded-2xl text-xs uppercase tracking-wider cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: "oklch(var(--p))",
                color: "oklch(var(--pc))",
                boxShadow: "0 2px 8px oklch(var(--p) / 0.35)",
              }}
              disabled={isPending}
              onMouseEnter={(e) =>
                !isPending && (e.currentTarget.style.opacity = "0.92")
              }
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {isPending ? (
                <>
                  <span
                    className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: "oklch(var(--pc) / 0.3)",
                      borderTopColor: "oklch(var(--pc))",
                    }}
                  />
                  Authenticating...
                </>
              ) : isAdminMode ? (
                <>
                  <ShieldAlert className="w-4 h-4" /> Sign In as Admin
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center pt-1">
              <p className="text-xs font-medium" style={{ color: "oklch(var(--bc) / 0.65)" }}>
                Don&apos;t have an account?{" "}
                <Link
                  to="/sign-up"
                  className="font-bold hover:underline"
                  style={{ color: "oklch(var(--p))" }}
                >
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* ILLUSTRATION PANEL */}
        <div
          className="hidden lg:flex w-full lg:w-1/2 p-4"
          style={{ backgroundColor: "oklch(var(--b2) / 0.5)" }}
        >
          <div
            className="w-full h-full rounded-2xl flex flex-col items-center justify-center p-8 overflow-hidden relative"
            style={{
              backgroundColor: "oklch(var(--b3) / 0.8)",
              border: "1px solid oklch(var(--bc) / 0.1)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--p) / 0.06), oklch(var(--s) / 0.06))",
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative aspect-square w-full max-w-xs mx-auto z-10 flex items-center justify-center"
            >
              {isAdminMode ? (
                <div
                  className="p-8 rounded-3xl"
                  style={{
                    backgroundColor: "oklch(var(--p) / 0.1)",
                    border: "1px solid oklch(var(--p) / 0.2)",
                    color: "oklch(var(--p))",
                  }}
                >
                  <ShieldAlert className="w-24 h-24" />
                </div>
              ) : (
                <img
                  src="/i.png"
                  alt="Language connection"
                  className="w-full h-full object-contain opacity-90"
                  style={{ mixBlendMode: "multiply" }}
                />
              )}
            </motion.div>

            <div className="text-center space-y-2 mt-6 z-10">
              <h2
                className="text-xl font-extrabold tracking-tight"
                style={{ color: "oklch(var(--bc))" }}
              >
                {isAdminMode ? (
                  <>
                    Administrator{" "}
                    <span
                      className="font-curly italic font-bold"
                      style={{ color: "oklch(var(--p))" }}
                    >
                      Control &amp; Audit
                    </span>
                  </>
                ) : (
                  <>
                    Connect with{" "}
                    <span
                      className="font-curly italic font-bold"
                      style={{ color: "oklch(var(--p))" }}
                    >
                      language friends worldwide
                    </span>
                  </>
                )}
              </h2>
              <p
                className="text-xs font-medium max-w-xs mx-auto"
                style={{ color: "oklch(var(--bc) / 0.6)" }}
              >
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
