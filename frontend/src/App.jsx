import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

import AxiosClerkInterceptor from "./components/AxiosClerkInterceptor.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import PageLoader from "./components/PageLoader.jsx";

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
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";

import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/useAuthUser.js";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);

  const isAuthenticated = Boolean(authUser) || isClerkSignedIn;

  // Minimum loading timer (1.5s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingComplete(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Invalidate authUser whenever Clerk's sign-in state changes
  useEffect(() => {
    if (isClerkLoaded) {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  }, [isClerkSignedIn, isClerkLoaded, queryClient]);

  // Keep-alive ping immediately & every 2 minutes
  useEffect(() => {
    if (!isAuthenticated) return;
    import("./lib/api").then(({ sendPing }) => sendPing().catch(console.error));
    const interval = setInterval(() => {
      import("./lib/api").then(({ sendPing }) => sendPing().catch(console.error));
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // AxiosClerkInterceptor always renders so it's ready before the first fetch.
  // PageLoader is shown as a sibling until auth resolves AND timer finish.
  const isAuthResolving = !isClerkLoaded || isLoading || !minLoadingComplete;

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
        <div className="min-h-screen bg-base-200 text-base-content font-sans tracking-tight" data-theme={theme}>
          <Routes>
            {/* ── Public ── */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LandingPage />
                ) : authUser?.isOnboarded ? (
                  <Layout showSidebar><HomePage /></Layout>
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
                  <div className="min-h-screen flex items-center justify-center bg-base-200">
                    <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/" />
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
                  <div className="min-h-screen flex items-center justify-center bg-base-200">
                    <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/onboarding" forceRedirectUrl="/onboarding" />
                  </div>
                ) : (
                  <Navigate to={authUser?.isOnboarded ? "/" : "/onboarding"} replace />
                )
              }
            />

            {/* ── Legacy login pages ── */}
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={authUser?.isOnboarded ? "/" : "/onboarding"} replace />} />
            <Route path="/signup" element={!isAuthenticated ? <Navigate to="/sign-up" replace /> : <Navigate to={authUser?.isOnboarded ? "/" : "/onboarding"} replace />} />
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
            <Route path="/friends"       element={<ProtectedRoute element={<Layout showSidebar><FriendsPage /></Layout>} />} />
            <Route path="/flashcards"    element={<ProtectedRoute element={<Layout showSidebar><FlashcardsPage /></Layout>} />} />
            <Route path="/assistant"     element={<ProtectedRoute element={<Layout showSidebar><AssistantPage /></Layout>} />} />
            <Route path="/notifications" element={<ProtectedRoute element={<Layout showSidebar><NotificationsPage /></Layout>} />} />
            <Route path="/profile"       element={<ProtectedRoute element={<Layout showSidebar><ProfilePage /></Layout>} />} />
            <Route path="/blocked-users" element={<ProtectedRoute element={<Layout showSidebar><BlockedUsersPage /></Layout>} />} />
            <Route path="/compiler"      element={<ProtectedRoute element={<Layout showSidebar><CompilerPage /></Layout>} />} />
            <Route path="/user/:id"      element={<ProtectedRoute element={<Layout showSidebar><FriendProfilePage /></Layout>} />} />
            <Route path="/chat/:id"      element={<ProtectedRoute element={<Layout showSidebar={false}><ChatPage /></Layout>} />} />
            <Route path="/call/:id"      element={<ProtectedRoute element={<CallPage />} />} />
            
            {/* ── Legal ── */}
            <Route path="/privacy"       element={<PrivacyPage />} />
            <Route path="/terms"         element={<TermsPage />} />
          </Routes>

          <Toaster />
        </div>
      )}
    </>
  );
};

export default App;