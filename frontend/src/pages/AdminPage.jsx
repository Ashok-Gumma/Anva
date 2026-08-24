import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAdminStats,
  getAdminComplaints,
  updateComplaintStatus,
  deleteComplaint,
  toggleSuspendUserAdmin,
  deleteUserAdmin,
  sendAdminWarning,
  toggleSuspendOffenderAdmin,
  getAdminUsers,
  updateUserRole,
  updateUserDetailsAdmin,
  promoteToAdmin,
  broadcastAnnouncement,
  getAdminPosts,
  deleteAdminPost,
} from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Trash2,
  Edit2,
  RefreshCw,
  Send,
  Zap,
  Check,
  LogOut,
  UserX,
  Users,
  Ban,
  UserCheck,
  Activity,
  Server,
  Database,
  Radio,
  UserPlus,
  FileText,
  Megaphone,
  Layers,
  ArrowUpRight,
  X,
} from "lucide-react";
import AnvaLogo from "../components/AnvaLogo";
import useLogout from "../hooks/useLogout";
import useAuthUser from "../hooks/useAuthUser";
import { Link } from "react-router";

const RESPONSE_MACROS = [
  {
    label: "Issue Fixed",
    status: "Resolved",
    note: "We investigated your report and resolved the issue. Thank you for your feedback!",
  },
  {
    label: "More Details Needed",
    status: "In Progress",
    note: "We received your report. Could you please provide additional details or screenshots so we can assist further?",
  },
  {
    label: "Account Updated",
    status: "Resolved",
    note: "Your account request and settings have been reviewed and updated successfully.",
  },
  {
    label: "Policy Disciplinary Action",
    status: "Resolved",
    note: "Thank you for reporting. Appropriate disciplinary action has been enforced according to platform guidelines.",
  },
  {
    label: "Appeal Approved",
    status: "Resolved",
    note: "Your suspension appeal has been reviewed and approved. Account restrictions have been lifted.",
  },
];

const AdminPage = () => {
  const { logoutMutation } = useLogout();
  const { authUser } = useAuthUser();

  // Navigation tab: "overview" | "users" | "complaints" | "posts" | "broadcast" | "team"
  const [activeTab, setActiveTab] = useState("overview");

  // Telemetry jitter & auto refresh
  const [latency, setLatency] = useState(21);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Filters
  const [searchUser, setSearchUser] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [userStatusFilter, setUserStatusFilter] = useState("All");

  const [complaintTab, setComplaintTab] = useState("active"); // "active" | "resolved" | "all"
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchComplaint, setSearchComplaint] = useState("");

  const [postSubjectFilter, setPostSubjectFilter] = useState("All");
  const [searchPost, setSearchPost] = useState("");

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastRole, setBroadcastRole] = useState("all");

  // Modals state
  const [editingTicket, setEditingTicket] = useState(null);
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editAdminNotes, setEditAdminNotes] = useState("");

  const [warningTicket, setWarningTicket] = useState(null);
  const [warningTarget, setWarningTarget] = useState("");
  const [warningTitle, setWarningTitle] = useState("⚠️ Official Administrative Notice");
  const [warningMessage, setWarningMessage] = useState("");

  const [editUserModal, setEditUserModal] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    fullName: "",
    email: "",
    role: "user",
    bio: "",
    location: "",
    nativeLanguage: "",
    learningLanguage: "",
    isOnboarded: true,
  });

  const [promoteEmail, setPromoteEmail] = useState("");

  // Simulated ping jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(18 + Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* ── Queries ── */
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
    staleTime: 30_000,
  });

  const {
    data: complaintsData,
    isLoading: isLoadingComplaints,
    refetch: refetchComplaints,
  } = useQuery({
    queryKey: ["adminComplaints"],
    queryFn: () => getAdminComplaints({ status: "All", category: "All" }),
    staleTime: 20_000,
  });

  const {
    data: adminUsersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => getAdminUsers(),
    staleTime: 30_000,
  });

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["adminPosts", postSubjectFilter],
    queryFn: () => getAdminPosts({ subject: postSubjectFilter }),
    enabled: activeTab === "posts",
    staleTime: 30_000,
  });

  // Auto sync
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refetchStats();
      refetchComplaints();
      refetchUsers();
      if (activeTab === "posts") refetchPosts();
      setLastRefreshed(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, activeTab, refetchStats, refetchComplaints, refetchUsers, refetchPosts]);

  const registeredUsers = useMemo(() => adminUsersData?.users || [], [adminUsersData?.users]);
  const rawTickets = useMemo(() => complaintsData?.tickets || [], [complaintsData?.tickets]);
  const allPosts = useMemo(() => postsData?.posts || [], [postsData?.posts]);

  /* ── Mutations ── */
  const updateComplaintMutation = useMutation({
    mutationFn: ({ id, data }) => updateComplaintStatus(id, data),
    onSuccess: async (data) => {
      toast.success(data.message || "Ticket updated & user notified");
      setEditingTicket(null);
      await Promise.all([refetchComplaints(), refetchStats()]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update ticket");
    },
  });

  const deleteComplaintMutation = useMutation({
    mutationFn: (id) => deleteComplaint(id),
    onSuccess: async (data) => {
      toast.success(data.message || "Complaint deleted");
      await Promise.all([refetchComplaints(), refetchStats()]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete complaint");
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: async (data) => {
      toast.success(data.message || "User role updated");
      await Promise.all([refetchUsers(), refetchStats()]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update role");
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: (userId) => toggleSuspendUserAdmin(userId),
    onSuccess: async (data) => {
      toast.success(data.message || "User suspension updated");
      await Promise.all([refetchUsers(), refetchComplaints(), refetchStats()]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to suspend user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUserAdmin(userId),
    onSuccess: async (data) => {
      toast.success(data.message || "User deleted permanently");
      await Promise.all([refetchUsers(), refetchComplaints(), refetchStats()]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
    },
  });

  const suspendOffenderMutation = useMutation({
    mutationFn: (identifier) => toggleSuspendOffenderAdmin(identifier),
    onSuccess: async (data) => {
      toast.success(data.message || "Offender suspension updated");
      await Promise.all([refetchUsers(), refetchComplaints(), refetchStats()]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to suspend offender");
    },
  });

  const sendWarningMutation = useMutation({
    mutationFn: (data) => sendAdminWarning(data),
    onSuccess: (data) => {
      toast.success(data.message || "Warning notification sent!");
      setWarningTicket(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send warning");
    },
  });

  const updateUserDetailsMutation = useMutation({
    mutationFn: ({ id, data }) => updateUserDetailsAdmin(id, data),
    onSuccess: async (data) => {
      toast.success(data.message || "User details saved");
      setEditUserModal(null);
      await refetchUsers();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update user");
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: (data) => broadcastAnnouncement(data),
    onSuccess: (data) => {
      toast.success(data.message || "Announcement broadcasted!");
      setBroadcastTitle("");
      setBroadcastMessage("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to broadcast");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id) => deleteAdminPost(id),
    onSuccess: async (data) => {
      toast.success(data.message || "Post removed");
      await Promise.all([refetchPosts(), refetchStats()]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete post");
    },
  });

  const promoteAdminMutation = useMutation({
    mutationFn: (email) => promoteToAdmin(email),
    onSuccess: async (data) => {
      toast.success(data.message || "User promoted to Admin!");
      setPromoteEmail("");
      await Promise.all([refetchUsers(), refetchStats()]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to promote user");
    },
  });

  /* ── Filtered Collections ── */
  const filteredUsers = useMemo(() => {
    return registeredUsers.filter((u) => {
      if (searchUser.trim()) {
        const s = searchUser.toLowerCase();
        const matches =
          u.fullName?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u._id?.toLowerCase().includes(s);
        if (!matches) return false;
      }
      if (userRoleFilter !== "All" && u.role !== userRoleFilter) return false;
      if (userStatusFilter === "Suspended" && !u.isSuspended) return false;
      if (userStatusFilter === "Active" && u.isSuspended) return false;
      if (userStatusFilter === "Onboarded" && !u.isOnboarded) return false;
      return true;
    });
  }, [registeredUsers, searchUser, userRoleFilter, userStatusFilter]);

  const complaints = useMemo(() => {
    return rawTickets.filter((ticket) => {
      if (complaintTab === "active" && (ticket.status === "Resolved" || ticket.status === "Rejected")) {
        return false;
      }
      if (complaintTab === "resolved" && ticket.status !== "Resolved" && ticket.status !== "Rejected") {
        return false;
      }
      if (categoryFilter !== "All" && ticket.category !== categoryFilter) {
        return false;
      }
      if (searchComplaint.trim()) {
        const s = searchComplaint.toLowerCase();
        const matches =
          ticket.subject?.toLowerCase().includes(s) ||
          ticket.message?.toLowerCase().includes(s) ||
          ticket.user?.fullName?.toLowerCase().includes(s) ||
          ticket.user?.email?.toLowerCase().includes(s) ||
          ticket.reportedUserAccount?.toLowerCase().includes(s);
        if (!matches) return false;
      }
      return true;
    });
  }, [rawTickets, complaintTab, categoryFilter, searchComplaint]);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      if (postSubjectFilter !== "All" && post.subject !== postSubjectFilter) return false;
      if (searchPost.trim()) {
        const s = searchPost.toLowerCase();
        const matches =
          post.caption?.toLowerCase().includes(s) ||
          post.user?.fullName?.toLowerCase().includes(s) ||
          post.user?.email?.toLowerCase().includes(s);
        if (!matches) return false;
      }
      return true;
    });
  }, [allPosts, postSubjectFilter, searchPost]);

  const stats = statsData?.stats || {
    totalUsers: registeredUsers.length,
    suspendedUsers: registeredUsers.filter((u) => u.isSuspended).length,
    adminUsers: registeredUsers.filter((u) => u.role === "admin").length,
    totalComplaints: rawTickets.length,
    pendingComplaints: rawTickets.filter((t) => t.status === "Pending").length,
    inProgressComplaints: rawTickets.filter((t) => t.status === "In Progress").length,
    resolvedComplaints: rawTickets.filter((t) => t.status === "Resolved").length,
    totalPosts: allPosts.length,
    activeToday: registeredUsers.length > 0 ? Math.ceil(registeredUsers.length * 0.45) : 0,
  };

  /* ── Modal Handlers ── */
  const handleOpenEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setEditStatus(ticket.status || "Pending");
    setEditPriority(ticket.priority || "Medium");
    setEditAdminNotes(ticket.adminNotes || "");
  };

  const handleApplyMacro = (macro) => {
    setEditStatus(macro.status);
    setEditAdminNotes(macro.note);
    toast.success(`Applied template: "${macro.label}"`);
  };

  const handleOpenWarning = (ticket) => {
    setWarningTicket(ticket);
    const target = ticket.reportedUserAccount || ticket.user?.email || "";
    setWarningTarget(target);
    setWarningTitle("⚠️ Official Administrative Notice");
    setWarningMessage(
      "Notice: You have been reported for policy violation / harassment. Continued infractions will result in account suspension."
    );
  };

  const handleOpenEditUser = (user) => {
    setEditUserModal(user);
    setEditUserForm({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "user",
      bio: user.bio || "",
      location: user.location || "",
      nativeLanguage: user.nativeLanguage || "",
      learningLanguage: user.learningLanguage || "",
      isOnboarded: user.isOnboarded ?? true,
    });
  };

  const handleManualSync = async () => {
    await Promise.all([refetchStats(), refetchComplaints(), refetchUsers(), refetchPosts()]);
    setLastRefreshed(new Date());
    toast.success("All administrative data refreshed");
  };

  return (
    <div data-theme="light" className="min-h-screen bg-[#F5F5F7] text-zinc-900 font-apple-system antialiased selection:bg-black selection:text-white pb-24">
      
      {/* ── 1. APPLE LIGHT MINIMAL TOP NAVIGATION ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-black/[0.08] shadow-2xs">
        {/* Top Status Bar */}
        <div className="border-b border-black/[0.04] px-4 sm:px-8 py-2 text-[11px] flex items-center justify-between text-zinc-500 font-medium bg-zinc-50/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500"></span>
              <span className="text-zinc-800 font-semibold tracking-tight">System Operational</span>
            </div>

            <span className="hidden sm:inline text-zinc-300">/</span>

            <div className="hidden sm:flex items-center gap-1.5 text-zinc-500 font-mono">
              <span>{latency}ms latency</span>
            </div>

            <span className="hidden md:inline text-zinc-300">/</span>

            <div className="hidden md:flex items-center gap-1.5 text-zinc-500">
              <span>MongoDB Connected</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
              <span>Auto-refresh</span>
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                  autoRefresh ? "bg-black" : "bg-zinc-300"
                }`}
              >
                <div
                  className={`size-3 rounded-full transition-transform absolute top-0.5 ${
                    autoRefresh ? "bg-white translate-x-3.5" : "bg-white translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleManualSync}
              className="text-zinc-600 hover:text-black transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
            >
              <RefreshCw className="size-3" /> Sync
            </button>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <AnvaLogo className="size-7 text-black" />
              <span className="font-semibold text-lg tracking-tight text-black">Anva</span>
            </Link>
            <span className="h-4 w-px bg-zinc-200 hidden sm:block" />
            <span className="text-xs text-zinc-500 font-medium tracking-tight">Admin Console</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-semibold text-xs text-black">
                {authUser?.fullName || "Administrator"}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">{authUser?.email}</span>
            </div>

            <button
              onClick={logoutMutation}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-black border border-black/[0.06] text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        </div>

        {/* Apple macOS Style Segmented Navigation Bar (White & Black) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-3">
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 border border-black/[0.06] gap-1 overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: "overview", label: "Overview", count: null },
              { id: "users", label: "Users", count: registeredUsers.length },
              { id: "complaints", label: "Complaints", count: rawTickets.length },
              { id: "posts", label: "Feed Posts", count: allPosts.length },
              { id: "broadcast", label: "Broadcasts", count: null },
              { id: "team", label: "Admin Team", count: stats.adminUsers },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-black text-white shadow-xs font-semibold"
                      : "text-zinc-600 hover:text-black hover:bg-black/[0.04]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? "bg-white/20 text-white font-semibold" : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── 2. MAIN DASHBOARD CONTENT (CLEAN WHITE CARDS) ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">

        {/* ── TAB 1: EXECUTIVE OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Header KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-1">
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Total Users</div>
                <div className="text-2xl font-bold text-black tracking-tight">{stats.totalUsers}</div>
                <div className="text-[10px] text-zinc-500 font-medium">Registered platform</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-1">
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Active 24h</div>
                <div className="text-2xl font-bold text-black tracking-tight">{stats.activeToday}</div>
                <div className="text-[10px] text-zinc-500 font-medium">Recent learners</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-1">
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Pending Reports</div>
                <div className="text-2xl font-bold text-amber-600 tracking-tight">{stats.pendingComplaints}</div>
                <div className="text-[10px] text-amber-700 font-medium">Requires triage</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-1">
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Resolved</div>
                <div className="text-2xl font-bold text-emerald-600 tracking-tight">{stats.resolvedComplaints}</div>
                <div className="text-[10px] text-emerald-700 font-medium">Cases closed</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-1">
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Suspended</div>
                <div className="text-2xl font-bold text-rose-600 tracking-tight">{stats.suspendedUsers}</div>
                <div className="text-[10px] text-zinc-500 font-medium">15-day enforcement</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-1">
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Admins</div>
                <div className="text-2xl font-bold text-black tracking-tight">{stats.adminUsers}</div>
                <div className="text-[10px] text-zinc-500 font-medium">Privileged team</div>
              </div>
            </div>

            {/* Quick Actions & Live Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions Panel */}
              <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Quick Actions
                  </h3>
                  <Zap className="size-3.5 text-zinc-400" />
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab("broadcast")}
                    className="w-full p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-black/[0.04] text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-black">Broadcast Announcement</div>
                      <div className="text-[10px] text-zinc-500">Push in-app notice to users</div>
                    </div>
                    <ArrowUpRight className="size-4 text-zinc-400 group-hover:text-black transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveTab("complaints")}
                    className="w-full p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-black/[0.04] text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-black">Review Complaints</div>
                      <div className="text-[10px] text-zinc-500">{stats.pendingComplaints} reports pending</div>
                    </div>
                    <ArrowUpRight className="size-4 text-zinc-400 group-hover:text-black transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-black/[0.04] text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-black">Manage User Directory</div>
                      <div className="text-[10px] text-zinc-500">Roles, suspensions, profiles</div>
                    </div>
                    <ArrowUpRight className="size-4 text-zinc-400 group-hover:text-black transition-colors" />
                  </button>

                  <button
                    onClick={() => setActiveTab("posts")}
                    className="w-full p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-black/[0.04] text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-black">Moderate Community Feed</div>
                      <div className="text-[10px] text-zinc-500">Review recent study posts</div>
                    </div>
                    <ArrowUpRight className="size-4 text-zinc-400 group-hover:text-black transition-colors" />
                  </button>
                </div>
              </div>

              {/* Live Moderation Stream */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-black/[0.06] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Audit Stream
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Updated {lastRefreshed.toLocaleTimeString()}
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {rawTickets.slice(0, 5).map((t) => (
                    <div
                      key={t._id}
                      className="p-3 bg-zinc-50 rounded-xl border border-black/[0.04] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-black truncate">{t.subject}</div>
                        <div className="text-[11px] text-zinc-500 truncate">
                          {t.user?.fullName} ({t.user?.email}) • {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase ${
                            t.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : t.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {t.status}
                        </span>

                        <button
                          onClick={() => handleOpenEditTicket(t)}
                          className="px-2.5 py-1 rounded-lg bg-black text-white text-[11px] font-medium hover:bg-zinc-800 transition-all cursor-pointer"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  ))}

                  {rawTickets.length === 0 && (
                    <div className="p-8 text-center text-xs text-zinc-400">
                      No recent activity recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: USER DIRECTORY & ACCESS CONTROL ── */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-2xl border border-black/[0.06] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or ID..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none focus:border-black/30 placeholder:text-zinc-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 text-zinc-800 border border-black/[0.06] rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 text-zinc-800 border border-black/[0.06] rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">15-Day Suspended</option>
                  <option value="Onboarded">Onboarded</option>
                </select>
              </div>
            </div>

            {/* Users List */}
            {isLoadingUsers ? (
              <div className="py-20 text-center text-xs text-zinc-400 animate-pulse">
                Loading user directory...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-black/[0.06] text-center text-xs text-zinc-500">
                No users found matching your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredUsers.map((u) => {
                  const isCurrentAdmin = authUser?._id === u._id;

                  return (
                    <div
                      key={u._id}
                      className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-3 flex flex-col justify-between hover:border-black/[0.16] transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-10 rounded-xl bg-zinc-100 border border-black/[0.06] flex items-center justify-center font-bold text-xs text-black shrink-0 overflow-hidden relative">
                              <span>{u.fullName?.charAt(0).toUpperCase()}</span>
                              {u.profilePic && (
                                <img
                                  src={u.profilePic}
                                  alt={u.fullName}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-xs text-black truncate">{u.fullName}</div>
                              <div className="text-[10px] text-zinc-400 truncate">{u.email}</div>
                            </div>
                          </div>

                          <select
                            value={u.role || "user"}
                            disabled={isCurrentAdmin}
                            onChange={(e) =>
                              updateUserRoleMutation.mutate({ id: u._id, role: e.target.value })
                            }
                            className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-zinc-100 text-zinc-800 border border-black/[0.06] focus:outline-none cursor-pointer"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          {u.isSuspended ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-200">
                              Suspended (15d)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          )}

                          {u.nativeLanguage && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] text-zinc-600 bg-zinc-100 border border-black/[0.04]">
                              {u.nativeLanguage}
                            </span>
                          )}
                        </div>

                        {u.bio && (
                          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                            "{u.bio}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-black/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[10px] font-medium border border-black/[0.04] transition-colors cursor-pointer"
                          >
                            Edit
                          </button>

                          {!isCurrentAdmin && (
                            <button
                              onClick={() => suspendUserMutation.mutate(u._id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                                u.isSuspended
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-zinc-100 text-zinc-800 border-black/[0.06] hover:bg-zinc-200"
                              }`}
                            >
                              {u.isSuspended ? "Unsuspend" : "Suspend 15d"}
                            </button>
                          )}
                        </div>

                        {!isCurrentAdmin && u.role !== "admin" && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Permanently delete account for ${u.fullName}?`)) {
                                deleteUserMutation.mutate(u._id);
                              }
                            }}
                            className="p-1 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SAFETY & COMPLAINTS DESK ── */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-2xl border border-black/[0.06] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-xl border border-black/[0.06]">
                <button
                  onClick={() => setComplaintTab("active")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    complaintTab === "active" ? "bg-black text-white shadow-xs font-semibold" : "text-zinc-600 hover:text-black"
                  }`}
                >
                  Active ({stats.pendingComplaints + stats.inProgressComplaints})
                </button>
                <button
                  onClick={() => setComplaintTab("resolved")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    complaintTab === "resolved" ? "bg-black text-white shadow-xs font-semibold" : "text-zinc-600 hover:text-black"
                  }`}
                >
                  Resolved ({stats.resolvedComplaints})
                </button>
                <button
                  onClick={() => setComplaintTab("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    complaintTab === "all" ? "bg-black text-white shadow-xs font-semibold" : "text-zinc-600 hover:text-black"
                  }`}
                >
                  All ({stats.totalComplaints})
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-52">
                  <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchComplaint}
                    onChange={(e) => setSearchComplaint(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none focus:border-black/30"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 text-zinc-800 border border-black/[0.06] rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Account Appeal">Account Appeal</option>
                  <option value="Abuse/Harassment">Abuse / Harassment</option>
                  <option value="Spam / Abuse">Spam / Abuse</option>
                  <option value="Bug">Bug Report</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>
            </div>

            {/* Complaints Cards */}
            {isLoadingComplaints ? (
              <div className="py-20 text-center text-xs text-zinc-400 animate-pulse">
                Loading support tickets...
              </div>
            ) : complaints.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-black/[0.06] text-center space-y-1">
                <div className="text-xs font-medium text-black">No complaints found</div>
                <div className="text-[11px] text-zinc-500">All reports in this view are resolved.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {complaints.map((ticket) => {
                  const isOffenderSuspended = ticket.reportedUserAccount
                    ? registeredUsers.find(
                        (u) =>
                          u.email === ticket.reportedUserAccount ||
                          u.fullName === ticket.reportedUserAccount ||
                          u._id === ticket.reportedUserAccount
                      )?.isSuspended
                    : false;

                  return (
                    <div
                      key={ticket._id}
                      className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-3 flex flex-col justify-between hover:border-black/[0.16] transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-100 text-zinc-800 border border-black/[0.04]">
                            {ticket.category || "General"}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-600 bg-zinc-100">
                              {ticket.priority || "Medium"}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase ${
                                ticket.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : ticket.status === "In Progress"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-xs text-black">{ticket.subject}</h4>
                          <p className="text-[11px] text-zinc-500">
                            By {ticket.user?.fullName} ({ticket.user?.email})
                          </p>
                        </div>

                        <div className="p-3 bg-zinc-50 rounded-xl text-xs text-zinc-800 whitespace-pre-line leading-relaxed border border-black/[0.02]">
                          {ticket.message}
                        </div>

                        {ticket.reportedUserAccount && (
                          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs flex items-center justify-between">
                            <span className="text-rose-700 font-medium">Reported Offender:</span>
                            <span className="font-mono text-black font-semibold text-xs">{ticket.reportedUserAccount}</span>
                          </div>
                        )}

                        {ticket.adminNotes && (
                          <div className="p-2.5 bg-zinc-50 border border-black/[0.04] rounded-xl text-xs space-y-1">
                            <div className="text-[10px] uppercase font-mono text-zinc-500">Official Response</div>
                            <p className="text-zinc-800 text-xs italic">"{ticket.adminNotes}"</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-black/[0.06]">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditTicket(ticket)}
                            className="px-3 py-1 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
                          >
                            Resolve & Reply
                          </button>

                          <button
                            onClick={() => handleOpenWarning(ticket)}
                            className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium border border-black/[0.04] transition-colors cursor-pointer"
                          >
                            Warn Offender
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {ticket.reportedUserAccount && (
                            <button
                              onClick={() => suspendOffenderMutation.mutate(ticket.reportedUserAccount)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                isOffenderSuspended
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              }`}
                            >
                              {isOffenderSuspended ? "Unsuspend" : "Suspend 15d"}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm("Delete this complaint report?")) {
                                deleteComplaintMutation.mutate(ticket._id);
                              }
                            }}
                            className="p-1 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: CONTENT & FEED MODERATION ── */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-2xl border border-black/[0.06] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search community posts..."
                  value={searchPost}
                  onChange={(e) => setSearchPost(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none focus:border-black/30"
                />
              </div>

              <select
                value={postSubjectFilter}
                onChange={(e) => setPostSubjectFilter(e.target.value)}
                className="px-3 py-1.5 bg-zinc-50 text-zinc-800 border border-black/[0.06] rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Subjects</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Languages">Languages</option>
                <option value="Science">Science</option>
                <option value="Study Tips">Study Tips</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Posts Grid */}
            {isLoadingPosts ? (
              <div className="py-20 text-center text-xs text-zinc-400 animate-pulse">
                Loading community posts...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-black/[0.06] text-center text-xs text-zinc-500">
                No community posts match your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs space-y-3 flex flex-col justify-between hover:border-black/[0.16] transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-100 text-zinc-800 border border-black/[0.04]">
                          {post.subject || "General"}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-zinc-100 border border-black/[0.06] flex items-center justify-center font-bold text-xs text-black overflow-hidden relative">
                          <span>{post.user?.fullName?.charAt(0).toUpperCase()}</span>
                          {post.user?.profilePic && (
                            <img
                              src={post.user.profilePic}
                              alt={post.user.fullName}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-black truncate">{post.user?.fullName}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{post.user?.email}</div>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-800 font-normal whitespace-pre-line line-clamp-3 leading-relaxed">
                        {post.caption}
                      </p>

                      {post.image && (
                        <div className="rounded-xl overflow-hidden max-h-36 border border-black/[0.06]">
                          <img
                            src={post.image}
                            alt="Attachment"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-black/[0.06]">
                      <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-3">
                        <span>{post.likes?.length || 0} likes</span>
                        <span>{post.comments?.length || 0} comments</span>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm("Remove this post from community feed?")) {
                            deletePostMutation.mutate(post._id);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                      >
                        Delete Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: SYSTEM BROADCASTS ── */}
        {activeTab === "broadcast" && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/[0.06] shadow-2xs space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-black">Broadcast System Announcement</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Publish a platform alert delivered straight to users' notification feeds.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
                    toast.error("Title and message are required");
                    return;
                  }
                  broadcastMutation.mutate({
                    title: broadcastTitle.trim(),
                    message: broadcastMessage.trim(),
                    targetRole: broadcastRole,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                    Audience
                  </label>
                  <select
                    value={broadcastRole}
                    onChange={(e) => setBroadcastRole(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 text-zinc-800 border border-black/[0.06] rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Platform Users</option>
                    <option value="user">Regular Users Only</option>
                    <option value="admin">Administrators Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scheduled Maintenance / Platform Update"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none focus:border-black/30"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write details of announcement..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none focus:border-black/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={broadcastMutation.isPending}
                  className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="size-3" />
                  {broadcastMutation.isPending ? "Sending..." : "Publish Announcement"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB 6: ADMIN TEAM & PROMOTIONS ── */}
        {activeTab === "team" && (
          <div className="space-y-6">
            {/* Promote Box */}
            <div className="bg-white p-6 rounded-2xl border border-black/[0.06] shadow-2xs max-w-xl mx-auto space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black">Elevate User to Administrator</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Grant administrative console access to existing user accounts.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!promoteEmail.trim()) {
                    toast.error("Please enter a valid user email");
                    return;
                  }
                  promoteAdminMutation.mutate(promoteEmail.trim());
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                    User Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. member@anva.com"
                    value={promoteEmail}
                    onChange={(e) => setPromoteEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none focus:border-black/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={promoteAdminMutation.isPending}
                  className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="size-3.5" />
                  {promoteAdminMutation.isPending ? "Granting..." : "Grant Admin Privileges"}
                </button>
              </form>
            </div>

            {/* Active Admins */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Active Administrators ({stats.adminUsers})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {registeredUsers
                  .filter((u) => u.role === "admin")
                  .map((admin) => (
                    <div
                      key={admin._id}
                      className="bg-white p-4 rounded-2xl border border-black/[0.06] shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-9 rounded-xl bg-zinc-100 border border-black/[0.06] flex items-center justify-center font-bold text-xs text-black shrink-0">
                          {admin.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-black truncate">{admin.fullName}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{admin.email}</div>
                        </div>
                      </div>

                      {authUser?._id !== admin._id && (
                        <button
                          onClick={() =>
                            updateUserRoleMutation.mutate({ id: admin._id, role: "user" })
                          }
                          className="px-2 py-1 rounded-lg text-[10px] font-mono bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-black/[0.06] transition-colors cursor-pointer"
                        >
                          Demote
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── 3. RESOLUTION SHEET MODAL (CLEAN WHITE SHEET) ── */}
      <AnimatePresence>
        {editingTicket && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full border border-black/[0.08] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-black">Resolve & Respond to Report</h3>
                  <p className="text-[11px] text-zinc-500">
                    Saving status automatically sends an in-app notice to the user.
                  </p>
                </div>
                <button
                  onClick={() => setEditingTicket(null)}
                  className="size-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* User issue snapshot */}
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-black/[0.04] space-y-1 text-xs">
                <div className="flex justify-between text-zinc-500 font-mono text-[10px]">
                  <span>{editingTicket.user?.fullName}</span>
                  <span>{editingTicket.user?.email}</span>
                </div>
                <div className="font-semibold text-black text-xs">{editingTicket.subject}</div>
                <div className="text-zinc-700 leading-relaxed whitespace-pre-line text-xs">
                  {editingTicket.message}
                </div>
              </div>

              {/* Response Macros */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Quick Macros:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {RESPONSE_MACROS.map((macro, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyMacro(macro)}
                      className="p-2 bg-zinc-50 hover:bg-zinc-100 border border-black/[0.06] rounded-lg text-left text-[11px] text-zinc-700 hover:text-black transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{macro.label}</span>
                      <Check className="size-3 opacity-40 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-lg text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-lg text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Response Note */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                  Official Response to User
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain resolution..."
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none focus:border-black/30 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
                <button
                  onClick={() => setEditingTicket(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    updateComplaintMutation.mutate({
                      id: editingTicket._id,
                      data: {
                        status: editStatus,
                        priority: editPriority,
                        adminNotes: editAdminNotes,
                      },
                    });
                  }}
                  disabled={updateComplaintMutation.isPending}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase bg-black hover:bg-zinc-800 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="size-3" />
                  {updateComplaintMutation.isPending ? "Saving..." : "Save & Notify"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 4. WARNING MODAL ── */}
      <AnimatePresence>
        {warningTicket && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full border border-black/[0.08] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <div className="flex items-center gap-2 text-black">
                  <AlertTriangle className="size-4 text-amber-500" />
                  <h3 className="text-sm font-semibold">Send Warning to Offender</h3>
                </div>
                <button
                  onClick={() => setWarningTicket(null)}
                  className="size-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                    Target Offender
                  </label>
                  <input
                    type="text"
                    value={warningTarget}
                    onChange={(e) => setWarningTarget(e.target.value)}
                    placeholder="Name or email..."
                    className="w-full px-3 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                    Notice Title
                  </label>
                  <input
                    type="text"
                    value={warningTitle}
                    onChange={(e) => setWarningTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                    Official Notice Message
                  </label>
                  <textarea
                    rows={3}
                    value={warningMessage}
                    onChange={(e) => setWarningMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 text-black border border-black/[0.06] rounded-xl text-xs font-normal focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
                <button
                  onClick={() => setWarningTicket(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    if (!warningTarget.trim() || !warningMessage.trim()) {
                      toast.error("Target user and message are required");
                      return;
                    }
                    sendWarningMutation.mutate({
                      targetUserIdentifier: warningTarget.trim(),
                      ticketId: warningTicket._id,
                      warningTitle,
                      warningMessage,
                    });
                  }}
                  disabled={sendWarningMutation.isPending}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="size-3" />
                  {sendWarningMutation.isPending ? "Sending..." : "Dispatch Notice"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 5. EDIT USER MODAL ── */}
      <AnimatePresence>
        {editUserModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full border border-black/[0.08] shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <h3 className="text-sm font-semibold text-black">Edit User Profile</h3>
                <button
                  onClick={() => setEditUserModal(null)}
                  className="size-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateUserDetailsMutation.mutate({
                    id: editUserModal._id,
                    data: editUserForm,
                  });
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editUserForm.fullName}
                      onChange={(e) => setEditUserForm({ ...editUserForm, fullName: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-lg text-xs font-normal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={editUserForm.email}
                      onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-lg text-xs font-normal focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Native Language
                    </label>
                    <input
                      type="text"
                      value={editUserForm.nativeLanguage}
                      onChange={(e) => setEditUserForm({ ...editUserForm, nativeLanguage: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-lg text-xs font-normal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                      Learning Language
                    </label>
                    <input
                      type="text"
                      value={editUserForm.learningLanguage}
                      onChange={(e) => setEditUserForm({ ...editUserForm, learningLanguage: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-lg text-xs font-normal focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={2}
                    value={editUserForm.bio}
                    onChange={(e) => setEditUserForm({ ...editUserForm, bio: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-zinc-50 text-black border border-black/[0.06] rounded-lg text-xs font-normal focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => setEditUserModal(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-black cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updateUserDetailsMutation.isPending}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold uppercase bg-black hover:bg-zinc-800 text-white cursor-pointer shadow-xs"
                  >
                    {updateUserDetailsMutation.isPending ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminPage;
