import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlockedUsers, unblockUser } from "../lib/api";
import { ArrowLeftIcon, CheckCircleIcon, SlashIcon } from "lucide-react";
import PageLoader from "../components/PageLoader";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const BlockedUsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: blockedUsers = [], isLoading } = useQuery({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
  });

  const unblockMutation = useMutation({
    mutationFn: (id) => unblockUser(id),
    onSuccess: () => {
      toast.success("User unblocked successfully");
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    },
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="btn btn-sm btn-circle btn-ghost bg-base-100/50 hover:bg-base-100 backdrop-blur">
            <ArrowLeftIcon className="size-4" />
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-base-content">
            Blocked Accounts
          </h1>
        </div>

        {blockedUsers.length === 0 ? (
          <div className="text-center py-20 bg-base-100 rounded-3xl border border-base-content/10 shadow-sm">
            <div className="size-16 bg-base-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SlashIcon className="size-8 opacity-20" />
            </div>
            <h2 className="text-xl font-bold mb-2">No blocked accounts</h2>
            <p className="text-base-content/60">Users you block will appear here.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {blockedUsers.map((user) => (
              <div 
                key={user._id} 
                className="flex items-center gap-4 p-4 bg-base-100 rounded-2xl border border-base-content/10 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className="size-12 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-lg overflow-hidden shadow-sm">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.fullName?.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base-content tracking-tight truncate">{user.fullName}</h3>
                  <p className="text-xs text-base-content/60 truncate">{user.location || "No location set"}</p>
                </div>

                {/* Action */}
                <button 
                  onClick={() => unblockMutation.mutate(user._id)}
                  disabled={unblockMutation.isPending}
                  className="btn btn-outline btn-success btn-sm rounded-full px-4"
                >
                  <CheckCircleIcon className="size-4 mr-2" />
                  Unblock
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlockedUsersPage;
