import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    // 401 is expected when the user is not logged in — don't pollute the console
    if (error?.response?.status !== 401) {
      console.error("Error in getAuthUser:", error);
    }
    return null;
  }
};


export const updateProfile = async (data) => {
  const response = await axiosInstance.put("/users/profile", data);
  return response.data;
};

export const sendPing = async () => {
  await axiosInstance.post("/auth/ping");
};

export const checkGrammar = async (text) => {
  const response = await axiosInstance.post("/assistant/grammar", { text });
  return response.data;
};



export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await axiosInstance.put("/users/password", data);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function cancelFriendRequest(userId) {
  const response = await axiosInstance.delete(`/users/friend-request/${userId}/cancel`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function getUserProfile(userId) {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
}

export async function executeCompilerCode(data) {
  const response = await axiosInstance.post("/compiler/execute", data);
  return response.data;
}

export async function unfriend(userId) {
  const response = await axiosInstance.delete(`/users/friend/${userId}`);
  return response.data;
}

export async function blockUser(userId) {
  const response = await axiosInstance.post(`/users/block/${userId}`);
  return response.data;
}

export async function unblockUser(userId) {
  const response = await axiosInstance.delete(`/users/block/${userId}`);
  return response.data;
}

export async function getBlockedUsers() {
  const response = await axiosInstance.get("/users/blocked");
  return response.data;
}

/* ── Support & Complaints API ── */
export async function createSupportTicket(ticketData) {
  const response = await axiosInstance.post("/support", ticketData);
  return response.data;
}

export async function getMySupportTickets() {
  const response = await axiosInstance.get("/support/my-tickets");
  return response.data;
}

/* ── Admin API ── */
export async function getAdminStats() {
  const response = await axiosInstance.get("/admin/stats");
  return response.data;
}

export async function getAdminComplaints(params = {}) {
  const response = await axiosInstance.get("/admin/complaints", { params });
  return response.data;
}

export async function updateComplaintStatus(id, updateData) {
  const response = await axiosInstance.patch(`/admin/complaints/${id}`, updateData);
  return response.data;
}

export async function deleteComplaint(id) {
  const response = await axiosInstance.delete(`/admin/complaints/${id}`);
  return response.data;
}

export async function getAdminUsers(params = {}) {
  const response = await axiosInstance.get("/admin/users", { params });
  return response.data;
}

export async function updateUserRole(id, role) {
  const response = await axiosInstance.patch(`/admin/users/${id}/role`, { role });
  return response.data;
}

export async function updateUserDetailsAdmin(id, data) {
  const response = await axiosInstance.put(`/admin/users/${id}`, data);
  return response.data;
}

export async function deleteUserAdmin(id) {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
}

export async function toggleSuspendUserAdmin(id) {
  const response = await axiosInstance.patch(`/admin/users/${id}/suspend`);
  return response.data;
}

export async function sendAdminWarning(data) {
  const response = await axiosInstance.post("/admin/send-warning", data);
  return response.data;
}

export async function toggleSuspendOffenderAdmin(identifier) {
  const response = await axiosInstance.post("/admin/offenders/suspend", { identifier });
  return response.data;
}

export async function deleteOffenderAdmin(identifier) {
  const response = await axiosInstance.post("/admin/offenders/delete", { identifier });
  return response.data;
}

export async function promoteToAdmin(email) {
  const response = await axiosInstance.post("/admin/promote", { email });
  return response.data;
}

/* ── Notifications API ── */
export async function getUserNotifications() {
  const response = await axiosInstance.get("/notifications");
  return response.data;
}

export async function markNotificationRead(id) {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
}

export async function deleteNotification(id) {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
}


