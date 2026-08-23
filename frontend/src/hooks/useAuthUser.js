import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useAuth();

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    enabled: isClerkLoaded,
    retry: (failureCount, error) => {
      // Never retry 401 (Unauthenticated) or 404 (Not Found)
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 5 * 60_000,
  });

  return {
    isLoading: query.isPending && isClerkLoaded,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    authUser: query.data?.user,
    refetch: query.refetch,
  };
};

export default useAuthUser;
