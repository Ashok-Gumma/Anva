import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import FriendsPage from "./pages/Friends.jsx";
import FlashcardsPage from "./pages/FlashcardsPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import AssistantPage from "./pages/AssistantPage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = !!authUser;
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>

        <Route
          path="/"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <Layout showSidebar>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/friends"
          element={
            isAuthenticated ? (
              <Layout showSidebar>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated ? (
              <CallPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

      </Routes>

      <Toaster />
    </div>
  );
};

export default App;