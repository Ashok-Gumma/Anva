import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      // ✅ clear user
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear();

      toast.success("Logged out");

      navigate("/login", { replace: true });
    },
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;