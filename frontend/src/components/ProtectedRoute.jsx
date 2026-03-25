import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "./PageLoader";

/**
 * Handles auth-guarded routes safely for both Clerk and legacy JWT users.
 *
 * Waits until we have a DEFINITIVE answer on auth state before redirecting:
 *  - Clerk loaded + authUser fetched (or confirmed missing) → decide
 *  - Still loading / fetching → show PageLoader
 */
const ProtectedRoute = ({ element, requireOnboarding = true }) => {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();
  const { isLoading, isFetching, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser) || isClerkSignedIn;
  const isOnboarded = authUser?.isOnboarded;

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

  // Authenticated + need onboarding (ONLY redirect when authUser is confirmed loaded)
  if (requireOnboarding && authUser && !isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return element;
};

export default ProtectedRoute;
