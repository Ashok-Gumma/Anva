import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const { isLoaded: isClerkLoaded } = useAuth();

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    // Do NOT fire until Clerk has initialized — ensures AxiosClerkInterceptor
    // has already set the Bearer token getter before the first request goes out
    enabled: isClerkLoaded,
    retry: false,
    staleTime: 60_000,
  });

  return {
    isLoading: query.isPending && isClerkLoaded, // treat as loading only when enabled
    isFetching: query.isFetching,
    authUser: query.data?.user,
  };
};
export default useAuthUser;
