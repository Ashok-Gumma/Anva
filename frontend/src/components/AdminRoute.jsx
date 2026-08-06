import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "./PageLoader";
import toast from "react-hot-toast";
import { useEffect } from "react";

const AdminRoute = ({ element }) => {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();
  const { isLoading, isFetching, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser) || isClerkSignedIn;
  const isAdmin = authUser?.role === "admin";

  const isResolving =
    !isClerkLoaded ||
    isLoading ||
    (isClerkSignedIn && !authUser && isFetching);

  useEffect(() => {
    if (!isResolving && isAuthenticated && authUser && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
    }
  }, [isResolving, isAuthenticated, authUser, isAdmin]);

  if (isResolving) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin) return <Navigate to="/" replace />;

  return element;
};

export default AdminRoute;
