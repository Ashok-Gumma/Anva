import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

import AxiosClerkInterceptor from "./components/AxiosClerkInterceptor.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Layout from "./components/Layout.jsx";
import PageLoader from "./components/PageLoader.jsx";
import ServerErrorPage from "./components/ServerErrorPage.jsx";
import AnvaLogo from "./components/AnvaLogo.jsx";
import AnvaBrandLogo from "./components/AnvaBrandLogo.jsx";

import HomePage from "./pages/HomePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import FriendsPage from "./pages/Friends.jsx";
import FlashcardsPage from "./pages/FlashcardsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import AssistantPage from "./pages/AssistantPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CompilerPage from "./pages/CompilerPage.jsx";
import FriendProfilePage from "./pages/FriendProfilePage.jsx";
import BlockedUsersPage from "./pages/BlockedUsersPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import EduFeedPage from "./pages/EduFeedPage.jsx";
import SavedPostsPage from "./pages/SavedPostsPage.jsx";

import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/useAuthUser.js";
import { useThemeStore } from "./store/useThemeStore.js";

import { ShieldAlert, LogOut } from "lucide-react";
import useLogout from "./hooks/useLogout.js";

const App = () => {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading, isError, error, authUser, refetch: refetchAuth } = useAuthUser();
  const { logoutMutation } = useLogout();
  const { theme } = useThemeStore();
  const [minLoadingComplete, setMinLoadingComplete] = useState(() => {
    return sessionStorage.getItem("anva_has_loaded_app") === "true";
  });

  const isAuthenticated = Boolean(authUser) || isClerkSignedIn;

  // Minimum loading timer (only on initial login/session load)
  useEffect(() => {
    const hasLoadedBefore = sessionStorage.getItem("anva_has_loaded_app");
    if (hasLoadedBefore === "true") {
      setMinLoadingComplete(true);
    } else {
      const timer = setTimeout(() => {
        setMinLoadingComplete(true);
        sessionStorage.setItem("anva_has_loaded_app", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync data-theme attribute on document element when theme changes
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // Invalidate authUser whenever Clerk's sign-in state changes
  useEffect(() => {
    if (isClerkLoaded) {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  }, [isClerkSignedIn, isClerkLoaded, queryClient]);

  // Keep-alive ping immediately & every 2 minutes
  useEffect(() => {
    if (!isAuthenticated || authUser?.isSuspended) return;
    import("./lib/api").then(({ sendPing }) => sendPing().catch(() => {}));
    const interval = setInterval(() => {
      import("./lib/api").then(({ sendPing }) => sendPing().catch(() => {}));
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated, authUser]);

  // PageLoader is shown only when Clerk is initializing or initial session auth is resolving
  const hasLoadedSession = sessionStorage.getItem("anva_has_loaded_app") === "true";
  const isAuthResolving = !isClerkLoaded || (!hasLoadedSession && (isLoading || !minLoadingComplete));

  if (isError) {
    return <ServerErrorPage error={error} onRetry={refetchAuth} />;
  }

  return (
    <>
      {/* 
        Always rendered — registers Clerk's getToken into the axios interceptor
        the moment Clerk initializes, BEFORE the first authUser query fires.
      */}
      <AxiosClerkInterceptor />

      {isAuthResolving ? (
        <PageLoader />
      ) : (
        <div className="min-h-screen bg-base-200 text-base-content font-sans tracking-tight relative" data-theme={theme}>
          {/* WhatsApp-Style Minimal Wallpaper Pattern across all pages */}
          <div className="anva-whatsapp-bg" aria-hidden="true" />
          <Routes>
            {/* ── Public ── */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LandingPage />
                ) : authUser?.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : authUser?.isOnboarded ? (
                  <ProtectedRoute allowSuspended={false} element={<Layout showSidebar><HomePage /></Layout>} />
                ) : (
                  <Navigate to="/onboarding" replace />
                )
              }
            />

            {/* ── Clerk Auth pages ── */}
            <Route
              path="/sign-in/*"
              element={
                !isAuthenticated ? (
                  <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-base-200 font-minimal selection:bg-primary selection:text-primary-content">
                    <div className="mb-6 text-center space-y-1">
                      <div className="inline-flex items-center gap-2 mb-2">
                        <AnvaBrandLogo badgeSize="size-9" textSize="text-2xl" />
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                        Welcome back to <span className="font-curly italic text-primary font-bold tracking-wide">Anva</span>
                      </h1>
                      <p className="text-xs text-base-content/60 font-medium">
                        Sign in to access your study network, compiler, and language assistant.
                      </p>
                    </div>
                    <SignIn
                      routing="path"
                      path="/sign-in"
                      signUpUrl="/sign-up"
                      fallbackRedirectUrl="/"
                      appearance={{
                        elements: {
                          card: "bg-base-100 shadow-xl rounded-3xl border border-base-content/10 font-minimal p-6 sm:p-8",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          socialButtonsBlockButton: "rounded-2xl border border-base-content/15 bg-base-200 hover:bg-base-300 font-bold text-xs text-base-content transition-all py-3 font-minimal cursor-pointer",
                          formButtonPrimary: "bg-primary text-primary-content hover:opacity-90 rounded-2xl font-bold uppercase text-xs shadow-md font-minimal py-3 cursor-pointer",
                          formFieldInput: "rounded-2xl border border-base-content/10 bg-base-200 text-xs font-bold font-minimal focus:ring-1 focus:ring-primary py-3",
                          footerActionLink: "text-primary font-bold hover:underline font-minimal",
                          formFieldLabel: "text-xs font-bold uppercase text-base-content/60 font-minimal",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <Navigate to={authUser?.isOnboarded ? "/" : "/onboarding"} replace />
                )
              }
            />
            <Route
              path="/sign-up/*"
              element={
                !isAuthenticated ? (
                  <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-base-200 font-minimal selection:bg-primary selection:text-primary-content">
                    <div className="mb-6 text-center space-y-1">
                      <div className="inline-flex items-center gap-2 mb-2">
                        <AnvaBrandLogo badgeSize="size-9" textSize="text-2xl" />
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                        Start your journey with <span className="font-curly italic text-primary font-bold tracking-wide">Anva</span>
                      </h1>
                      <p className="text-xs text-base-content/60 font-medium">
                        Create an account to connect with language learners worldwide.
                      </p>
                    </div>
                    <SignUp
                      routing="path"
                      path="/sign-up"
                      signInUrl="/sign-in"
                      fallbackRedirectUrl="/onboarding"
                      forceRedirectUrl="/onboarding"
                      appearance={{
                        elements: {
                          card: "bg-base-100 shadow-xl rounded-3xl border border-base-content/10 font-minimal p-6 sm:p-8",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          socialButtonsBlockButton: "rounded-2xl border border-base-content/15 bg-base-200 hover:bg-base-300 font-bold text-xs text-base-content transition-all py-3 font-minimal cursor-pointer",
                          formButtonPrimary: "bg-primary text-primary-content hover:opacity-90 rounded-2xl font-bold uppercase text-xs shadow-md font-minimal py-3 cursor-pointer",
                          formFieldInput: "rounded-2xl border border-base-content/10 bg-base-200 text-xs font-bold font-minimal focus:ring-1 focus:ring-primary py-3",
                          footerActionLink: "text-primary font-bold hover:underline font-minimal",
                          formFieldLabel: "text-xs font-bold uppercase text-base-content/60 font-minimal",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <Navigate to={authUser?.isOnboarded ? "/" : "/onboarding"} replace />
                )
              }
            />

            {/* ── Legacy login pages ── */}
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={authUser?.role === "admin" ? "/admin" : authUser?.isOnboarded ? "/" : "/onboarding"} replace />} />
            <Route path="/signup" element={!isAuthenticated ? <Navigate to="/sign-up" replace /> : <Navigate to={authUser?.role === "admin" ? "/admin" : authUser?.isOnboarded ? "/" : "/onboarding"} replace />} />
            <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/" replace />} />
            <Route path="/reset-password/:token" element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/" replace />} />

            {/* ── Onboarding ── */}
            <Route
              path="/onboarding"
              element={
                !isAuthenticated
                  ? <Navigate to="/sign-in" replace />
                  : authUser?.isOnboarded
                    ? <Navigate to="/" replace />
                    : <OnboardingPage />
              }
            />

            {/* ── Protected routes ── */}
            <Route path="/feed"          element={<ProtectedRoute element={<Layout showSidebar><EduFeedPage /></Layout>} />} />
            <Route path="/friends"       element={<ProtectedRoute element={<Layout showSidebar><FriendsPage /></Layout>} />} />
            <Route path="/flashcards"    element={<ProtectedRoute element={<Layout showSidebar><FlashcardsPage /></Layout>} />} />
            <Route path="/assistant"     element={<ProtectedRoute element={<Layout showSidebar><AssistantPage /></Layout>} />} />
            <Route path="/notifications" element={<ProtectedRoute element={<Layout showSidebar><NotificationsPage /></Layout>} />} />
            <Route path="/profile"       element={<ProtectedRoute element={<Layout showSidebar><ProfilePage /></Layout>} />} />
            <Route path="/saved-posts"   element={<ProtectedRoute element={<Layout showSidebar><SavedPostsPage /></Layout>} />} />
            <Route path="/support"       element={<ProtectedRoute allowSuspended={true} element={<Layout showSidebar><SupportPage /></Layout>} />} />
            <Route path="/admin"        element={<AdminRoute element={<AdminPage />} />} />
            <Route path="/blocked-users" element={<ProtectedRoute element={<Layout showSidebar><BlockedUsersPage /></Layout>} />} />
            <Route path="/compiler"      element={<ProtectedRoute element={<Layout showSidebar><CompilerPage /></Layout>} />} />
            <Route path="/user/:id"      element={<ProtectedRoute element={<Layout showSidebar><FriendProfilePage /></Layout>} />} />
            <Route path="/chat"          element={<ProtectedRoute element={<Navigate to="/friends" replace />} />} />
            <Route path="/chat/:id"      element={<ProtectedRoute element={<Layout showSidebar={false}><ChatPage /></Layout>} />} />
            <Route path="/call/:id"      element={<ProtectedRoute element={<CallPage />} />} />
            
            {/* ── Legal ── */}
            <Route path="/privacy"       element={<PrivacyPage />} />
            <Route path="/terms"         element={<TermsPage />} />
          </Routes>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              className: "anva-toast",
              style: {
                background: "rgba(15, 23, 42, 0.92)",
                color: "#f8fafc",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "14px",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: "600",
                letterSpacing: "-0.01em",
                maxWidth: "380px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#0f172a",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#0f172a",
                },
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default App;