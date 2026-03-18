import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      queryClient.setQueryData(["authUser"], {
        user: data.user,
      });

      toast.success("Login successful");
      navigate("/", { replace: true });
    },
  });

  return { loginMutation: mutate, isPending };
};

export default useLogin;