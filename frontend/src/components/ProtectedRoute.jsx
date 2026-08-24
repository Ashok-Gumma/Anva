import { useAuth } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "./PageLoader";
import { Lock, ShieldAlert, LifeBuoy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import ErrorBoundary from "./ErrorBoundary";
import ServerErrorPage from "./ServerErrorPage";
import SuspendedAccountScreen from "./SuspendedAccountScreen";

/**
 * Handles auth-guarded routes safely for both Clerk and legacy JWT users.
 *
 * If allowSuspended is false and authUser is suspended, displays the Instagram-style
 * SuspendedAccountScreen directing the user to submit an appeal.
 */
const ProtectedRoute = ({ element, requireOnboarding = true, allowSuspended = false }) => {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();
  const { isLoading, isFetching, isError, error, authUser, refetch } = useAuthUser();

  const isAuthenticated = Boolean(authUser) || isClerkSignedIn;
  const isOnboarded = authUser?.isOnboarded;

  // Backend error (500/502/503 or offline connection error) -> show Server Error Boundary
  if (isError) {
    return <ServerErrorPage error={error} onRetry={refetch} />;
  }

  // Still determining auth state — hold here
  const isResolving =
    !isClerkLoaded ||
    isLoading ||
    (isClerkSignedIn && !authUser && isFetching);

  if (isResolving) return <PageLoader />;

  // Clerk says signed in but we have no MongoDB user after all retries → force re-auth
  if (isClerkSignedIn && !authUser) return <Navigate to="/sign-in" replace />;

  // Not authenticated at all
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  // If user is Admin, restrict access to user dashboard pages and keep them strictly on /admin
  if (authUser?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Authenticated + need onboarding (ONLY redirect when authUser is confirmed loaded)
  if (requireOnboarding && authUser && !isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  // 🔒 SUSPENDED USER INSTAGRAM-STYLE SUSPENSION SCREEN
  if (authUser?.isSuspended && !allowSuspended) {
    return <SuspendedAccountScreen authUser={authUser} />;
  }

  return <ErrorBoundary>{element}</ErrorBoundary>;
};

export default ProtectedRoute;
