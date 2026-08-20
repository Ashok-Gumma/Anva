import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/clerk-react";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();
  const { signOut } = useClerk();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      try {
        await logout();
      } catch (err) {
        console.warn("Backend logout error:", err);
      }
      try {
        await signOut();
      } catch (err) {
        console.warn("Clerk signOut error:", err);
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      sessionStorage.removeItem("anva_has_loaded_app");
      window.location.href = "/login";
    },
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;
