import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const { isLoaded: isClerkLoaded } = useAuth();

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    enabled: isClerkLoaded,
    retry: 1,
    staleTime: 60_000,
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
