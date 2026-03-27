import mongoose from "mongoose";
import User from "./backend/src/models/User.js";
import "dotenv/config";

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Create two test users
  const user1 = await User.create({ fullName: "Test 1", email: `test1_${Date.now()}@test.com`, password: "password123" });
  const user2 = await User.create({ fullName: "Test 2", email: `test2_${Date.now()}@test.com`, password: "password123" });

  console.log(`Created users: ${user1._id} and ${user2._id}`);

  // Make them friends
  await User.findByIdAndUpdate(user1._id, { $addToSet: { friends: user2._id } });
  await User.findByIdAndUpdate(user2._id, { $addToSet: { friends: user1._id } });

  console.log("Initial status: Friends");

  // Block User 2 from User 1
  await User.findByIdAndUpdate(user1._id, { $addToSet: { blockedUsers: user2._id } });
  
  // Verify status during block
  const u1_blocked = await User.findById(user1._id);
  const u2_blocked = await User.findById(user2._id);
  
  console.log(`User 1 Friends: ${u1_blocked.friends}`);
  console.log(`User 1 Blocked: ${u1_blocked.blockedUsers}`);
  console.log(`User 2 Friends: ${u2_blocked.friends}`);

  const isFriendPreserved = u1_blocked.friends.includes(user2._id) && u2_blocked.friends.includes(user1._id);
  console.log(`Friendship preserved during block? ${isFriendPreserved}`);

  // Unblock
  await User.findByIdAndUpdate(user1._id, { $pull: { blockedUsers: user2._id } });

  // Final verify
  const u1_final = await User.findById(user1._id);
  const u2_final = await User.findById(user2._id);
  
  const isStillFriends = u1_final.friends.includes(user2._id) && u2_final.friends.includes(user1._id);
  console.log(`Still friends after unblock? ${isStillFriends}`);

  // Cleanup
  await User.findByIdAndDelete(user1._id);
  await User.findByIdAndDelete(user2._id);
  
  await mongoose.disconnect();
}

verify();
