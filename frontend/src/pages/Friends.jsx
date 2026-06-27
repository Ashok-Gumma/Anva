import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { motion } from "framer-motion";
import { UsersIcon, SearchIcon } from "lucide-react";
import { useState, useMemo } from "react";

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
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const Friends = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);

  const validFriends = useMemo(() => {
    return friends.filter((friend) => friend && friend._id);
  }, [friends]);

  const filteredFriends = useMemo(() => {
    return validFriends.filter((friend) => {
      const matchesSearch = 
        friend.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.nativeLanguage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.learningLanguage?.toLowerCase().includes(searchQuery.toLowerCase());

      const isOnline = friend.lastActive && (new Date() - new Date(friend.lastActive)) <= 3 * 60 * 1000;
      const matchesOnline = !onlineOnly || isOnline;

      return matchesSearch && matchesOnline;
    });
  }, [validFriends, searchQuery, onlineOnly]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 min-h-screen bg-base-300">
        <span className="w-8 h-8 border-4 border-base-content/10 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-base-content/60 text-xs font-black uppercase tracking-widest">Loading network graph...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-300 min-h-screen">
      <motion.div 
        className="container mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="ide-panel rounded-2xl shadow-sm">
          <div className="ide-panel-header flex-col sm:flex-row gap-3 h-auto py-3">
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-primary" />
              <span>Your Network</span>
              <span className="badge badge-sm font-extrabold bg-primary/10 text-primary border-none">
                {filteredFriends.length} Connected
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Online Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={onlineOnly} 
                  onChange={(e) => setOnlineOnly(e.target.checked)} 
                  className="checkbox checkbox-primary checkbox-xs rounded" 
                />
                <span className="text-[10px] font-black uppercase tracking-wider text-base-content/60">Online Only</span>
              </label>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Search network..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-base-200 border border-base-content/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-medium text-base-content placeholder:text-base-content/30"
                />
              </div>
            </div>
          </div>

          <div className="ide-panel-body bg-base-100/40">
            {filteredFriends.length === 0 ? (
              <div className="p-8 text-center bg-base-100 rounded-xl border border-base-content/5">
                <h3 className="font-semibold text-base text-base-content">
                  {searchQuery || onlineOnly ? "No matching connections found" : "Your network is empty"}
                </h3>
                <p className="text-xs text-base-content/50 mt-1 font-medium">
                  {searchQuery || onlineOnly ? "Try clearing search filters or toggles." : "Connect with learners on the study dashboard."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFriends.map((friend) => (
                  <FriendCard key={friend._id} friend={friend} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Friends;
