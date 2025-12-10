import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api"; // Assuming same API as HomePage
import FriendCard from "../components/FriendCard"; // Reuse from HomePage
import NoFriendsFound from "../components/NoFriendsFound"; // Reuse from HomePage

const Friends = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Your Friends</h1>

        {friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;