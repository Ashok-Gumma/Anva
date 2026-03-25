import { useAuth } from "@clerk/clerk-react";
import { setClerkGetToken } from "../lib/axios";

/**
 * Invisible component that registers Clerk's getToken with the axios module.
 * 
 * IMPORTANT: setClerkGetToken is called DURING RENDER (not in useEffect)
 * so it's available before React Query fires its first request in useEffect.
 */
const AxiosClerkInterceptor = () => {
  const { getToken, isSignedIn } = useAuth();

  // Set synchronously during render — this runs before any useEffect (including React Query)
  setClerkGetToken(isSignedIn ? getToken : null);

  return null;
};

export default AxiosClerkInterceptor;
