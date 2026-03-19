import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const Friends = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 min-h-screen">
        <span className="w-8 h-8 border-4 border-base-content/10 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-base-content/70 font-medium tracking-tight">Loading social graph...</p>
      </div>
    );
  }

  const validFriends = friends.filter(
    (friend) => friend && friend._id
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <motion.div 
        className="container mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-8 text-base-content">
          Your Network
        </motion.h1>

        {validFriends.length === 0 ? (
          <motion.div variants={itemVariants}>
            <NoFriendsFound />
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" variants={containerVariants}>
            {validFriends.map((friend) => (
              <motion.div key={friend._id} variants={itemVariants}>
                <FriendCard friend={friend} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Friends;
