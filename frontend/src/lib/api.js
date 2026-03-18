import { axiosInstance } from "./axios";

// 🔐 AUTH
export const signup = async (data) => {
  const res = await axiosInstance.post("/auth/signup", data);
  return res.data;
};

export const login = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
};

export const completeOnboarding = async (data) => {
  const res = await axiosInstance.put("/auth/onboard", data);
  return res.data;
};

// 👥 USERS
export const getUserFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getOutgoingFriendReqs = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
};

export const acceptFriendRequest = async (requestId) => {
  const res = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return res.data;
};

// 💬 CHAT
export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chat/token");
  return res.data;
};