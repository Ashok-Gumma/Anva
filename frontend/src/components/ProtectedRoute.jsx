import { useAuth } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "./PageLoader";
import { Lock, ShieldAlert, LifeBuoy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import ErrorBoundary from "./ErrorBoundary";
import ServerErrorPage from "./ServerErrorPage";

/**
 * Handles auth-guarded routes safely for both Clerk and legacy JWT users.
 *
 * If allowSuspended is false and authUser is suspended, displays a Lock Screen Overlay 🔒
 * directing the user to the Support Page (/support) where they can view details and submit appeals.
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

  // 🔒 SUSPENDED USER LOCK SCREEN OVERLAY
  if (authUser?.isSuspended && !allowSuspended) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-minimal">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-base-100 p-8 rounded-3xl border border-error/30 shadow-2xl text-center space-y-6"
        >
          {/* Lock Icon */}
          <div className="size-20 bg-error/10 text-error rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-error/20">
            <Lock className="size-10 text-error animate-pulse" />
          </div>

          {/* Locked Notice */}
          <div className="space-y-2">
            <span className="px-3.5 py-1 bg-error/15 text-error border border-error/30 rounded-full text-xs font-bold uppercase tracking-wider font-minimal">
              15-Day Account Restriction
            </span>
            <h2 className="font-curly text-3xl sm:text-4xl font-bold text-error tracking-wide">
              Feature Locked
            </h2>
            <p className="text-xs sm:text-sm text-base-content/70 font-medium leading-relaxed">
              Your account <strong className="text-base-content font-bold">{authUser?.email}</strong> is under a 15-day policy restriction hold. This page is currently locked.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-error/5 border border-error/20 text-xs font-semibold text-base-content/80 text-left space-y-2">
            <div className="flex items-center gap-2 text-error font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>What can you do?</span>
            </div>
            <p className="text-base-content/70 leading-relaxed">
              You can access the <strong>Support & Appeals Desk</strong> to review your suspension countdown, check guidelines, and submit an official appeal to system admins.
            </p>
          </div>

          {/* Action Button */}
          <Link
            to="/support"
            className="btn btn-error btn-block rounded-2xl font-bold gap-2 text-white cursor-pointer hover:shadow-lg transition-all text-xs uppercase"
          >
            <LifeBuoy className="w-4 h-4" /> Go to Support Page & Submit Appeal <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return <ErrorBoundary>{element}</ErrorBoundary>;
};

export default ProtectedRoute;
