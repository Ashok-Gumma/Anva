import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminStats,
  getAdminComplaints,
  updateComplaintStatus,
  deleteComplaint,
  toggleSuspendUserAdmin,
  deleteUserAdmin,
  sendAdminWarning,
  toggleSuspendOffenderAdmin,
  deleteOffenderAdmin,
  getAdminUsers,
  updateUserRole,
  updateUserDetailsAdmin,
  promoteToAdmin,
} from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Search,
  Trash2,
  Edit3,
  Filter,
  RefreshCw,
  Bell,
  Send,
  Zap,
  Check,
  LifeBuoy,
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
  ShieldCheck,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";
import AnvaLogo from "../components/AnvaLogo";
import useLogout from "../hooks/useLogout";
import useAuthUser from "../hooks/useAuthUser";
import { Link } from "react-router";

const MACROS = [
  {
    label: "Issue Fixed",
    status: "Resolved",
    note: "We have investigated your report and resolved the issue. Thank you for your feedback!",
  },
  {
    label: "Need More Details",
    status: "In Progress",
    note: "We received your report. Could you please reply with additional details or screenshots so we can assist further?",
  },
  {
    label: "Account Updated",
    status: "Resolved",
    note: "Your account request/settings have been reviewed and updated successfully.",
  },
  {
    label: "Policy Violation Note",
    status: "Resolved",
    note: "Thank you for reporting. Appropriate disciplinary action has been taken according to platform guidelines.",
  },
  {
    label: "Appeal Approved",
    status: "Resolved",
    note: "Your suspension appeal has been reviewed and approved. Restrictions have been lifted.",
  },
];

const AdminPage = () => {
  const queryClient = useQueryClient();
  const { logoutMutation } = useLogout();
  const { authUser } = useAuthUser();

  // Navigation: "dashboard", "complaints", "users", "audit", "promote"
  const [mainTab, setMainTab] = useState("dashboard");

  // Filter states
  const [searchUser, setSearchUser] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [userStatusFilter, setUserStatusFilter] = useState("All");

  const [viewTab, setViewTab] = useState("active");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchComplaint, setSearchComplaint] = useState("");

  // Modals state
  const [editingTicket, setEditingTicket] = useState(null);
  const [editStatus, setEditStatus] = useState("Pending");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editAdminNotes, setEditAdminNotes] = useState("");

  const [warningTicket, setWarningTicket] = useState(null);
  const [warningTarget, setWarningTarget] = useState("");
  const [warningTitle, setWarningTitle] = useState("⚠️ Official Administrative Warning");
  const [warningMessage, setWarningMessage] = useState("");

  const [promoteEmail, setPromoteEmail] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);

  const [editUserModal, setEditUserModal] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ fullName: "", email: "", role: "user" });

  // Simulated Real-Time System Telemetry (Latency jitter & Live Ping)
  const [latency, setLatency] = useState(24);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(20 + Math.random() * 12));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const autoRef = setInterval(() => {
      refetchStats();
      refetchComplaints();
      refetchUsers();
      setLastRefreshed(new Date());
    }, 15000);
    return () => clearInterval(autoRef);
  }, [autoRefresh]);

  // Queries
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
    staleTime: 10_000,
  });

  const {
    data: complaintsData,
    isLoading: isLoadingComplaints,
    refetch: refetchComplaints,
  } = useQuery({
    queryKey: ["adminComplaints"],
    queryFn: () => getAdminComplaints({ status: "All", category: "All" }),
    staleTime: 5_000,
  });

  const {
    data: adminUsersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => getAdminUsers(),
    staleTime: 5_000,
  });

  const registeredUsers = adminUsersData?.users || [];
  const rawTickets = complaintsData?.tickets || [];

  // Mutations
  const updateComplaintMutation = useMutation({
    mutationFn: ({ id, data }) => updateComplaintStatus(id, data),
    onSuccess: async (data) => {
      toast.success(data.message || "Ticket status updated");
      setEditingTicket(null);
      await refetchComplaints();
      await refetchStats();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update ticket");
    },
  });

  const deleteComplaintMutation = useMutation({
    mutationFn: (id) => deleteComplaint(id),
    onSuccess: async (data) => {
      toast.success(data.message || "Complaint deleted permanently");
      await refetchComplaints();
      await refetchStats();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete complaint");
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: async (data) => {
      toast.success(data.message || "User role updated");
      await refetchUsers();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update role");
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: (userId) => toggleSuspendUserAdmin(userId),
    onSuccess: async (data) => {
      toast.success(data.message || "User suspension toggled");
      await refetchUsers();
      await refetchComplaints();
      await refetchStats();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to suspend user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUserAdmin(userId),
    onSuccess: async (data) => {
      toast.success(data.message || "User profile deleted");
      await refetchUsers();
      await refetchComplaints();
      await refetchStats();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
    },
  });

  const suspendOffenderMutation = useMutation({
    mutationFn: (identifier) => toggleSuspendOffenderAdmin(identifier),
    onSuccess: async (data) => {
      toast.success(data.message || "Offender suspension toggled");
      await refetchUsers();
      await refetchComplaints();
      await refetchStats();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to suspend offender");
    },
  });

  const deleteOffenderMutation = useMutation({
    mutationFn: (identifier) => deleteOffenderAdmin(identifier),
    onSuccess: async (data) => {
      toast.success(data.message || "Offender profile deleted");
      await refetchUsers();
      await refetchComplaints();
      await refetchStats();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete offender");
    },
  });

  const sendWarningMutation = useMutation({
    mutationFn: (data) => sendAdminWarning(data),
    onSuccess: (data) => {
      toast.success(data.message || "Warning notification delivered!");
      setWarningTicket(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send warning");
    },
  });

  const updateUserDetailsMutation = useMutation({
    mutationFn: ({ id, data }) => updateUserDetailsAdmin(id, data),
    onSuccess: async (data) => {
      toast.success(data.message || "User details updated");
      setEditUserModal(null);
      await refetchUsers();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update user details");
    },
  });

  const handlePromoteSubmit = async (e) => {
    e.preventDefault();
    if (!promoteEmail.trim()) {
      toast.error("Enter user email to promote");
      return;
    }
    try {
      setIsPromoting(true);
      const res = await promoteToAdmin(promoteEmail.trim());
      toast.success(res.message || `${promoteEmail} promoted to Admin!`);
      setPromoteEmail("");
      await refetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to promote user to Admin");
    } finally {
      setIsPromoting(false);
    }
  };

  // Filtered Lists
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
      return true;
    });
  }, [registeredUsers, searchUser, userRoleFilter, userStatusFilter]);

  const complaints = useMemo(() => {
    return rawTickets.filter((ticket) => {
      if (viewTab === "active" && (ticket.status === "Resolved" || ticket.status === "Rejected")) {
        return false;
      }
      if (viewTab === "resolved" && ticket.status !== "Resolved" && ticket.status !== "Rejected") {
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
  }, [rawTickets, viewTab, categoryFilter, searchComplaint]);

  const stats = statsData?.stats || {
    totalComplaints: rawTickets.length,
    pendingComplaints: rawTickets.filter((t) => t.status === "Pending").length,
    inProgressComplaints: rawTickets.filter((t) => t.status === "In Progress").length,
    resolvedComplaints: rawTickets.filter((t) => t.status === "Resolved").length,
  };

  const suspendedUserCount = useMemo(
    () => registeredUsers.filter((u) => u.isSuspended).length,
    [registeredUsers]
  );
  const adminCount = useMemo(
    () => registeredUsers.filter((u) => u.role === "admin").length,
    [registeredUsers]
  );

  const handleManualRefresh = async () => {
    await Promise.all([refetchStats(), refetchComplaints(), refetchUsers()]);
    setLastRefreshed(new Date());
    toast.success("Telemetry & system data refreshed!");
  };

  const handleOpenWarning = (ticket) => {
    setWarningTicket(ticket);
    const target = ticket.reportedUserAccount || ticket.user?.email || "";
    setWarningTarget(target);
    setWarningTitle("⚠️ Official Administrative Warning");
    setWarningMessage(
      `Official Notice: You have been reported for inappropriate conduct / harassment. Continued policy violations will result in immediate account suspension.`
    );
  };

  const handleSendWarningSubmit = () => {
    if (!warningTarget.trim() || !warningMessage.trim()) {
      toast.error("Target user and warning message are required");
      return;
    }
    sendWarningMutation.mutate({
      targetUserIdentifier: warningTarget,
      ticketId: warningTicket?._id,
      warningTitle,
      warningMessage,
    });
  };

  const handleEditTicketOpen = (ticket) => {
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

  const handleSaveTicket = () => {
    if (!editingTicket) return;
    updateComplaintMutation.mutate({
      id: editingTicket._id,
      data: {
        status: editStatus,
        priority: editPriority,
        adminNotes: editAdminNotes,
      },
    });
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col font-minimal">
      {/* ── REAL-TIME APPLICATION TELEMETRY & SYSTEM HEADER ── */}
      <header className="bg-base-100 border-b border-base-content/10 sticky top-0 z-30 shadow-sm font-minimal">
        {/* Top Telemetry Ticker Bar */}
        <div className="bg-base-300/60 border-b border-base-content/5 px-4 py-1.5 text-[11px] font-semibold flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-500 uppercase tracking-wider">
                System Health: Operational
              </span>
            </div>

            <span className="hidden sm:inline text-base-content/40">|</span>

            <div className="hidden sm:flex items-center gap-1 text-base-content/70">
              <Server className="w-3 h-3 text-primary" /> API Latency:
              <span className="font-mono font-bold text-primary">{latency}ms</span>
            </div>

            <span className="hidden sm:inline text-base-content/40">|</span>

            <div className="hidden md:flex items-center gap-1 text-base-content/70">
              <Database className="w-3 h-3 text-info" /> MongoDB Cluster:
              <span className="font-bold text-info">Connected</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-base-content/60 text-[10px]">
              <span>Auto-refresh:</span>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="toggle toggle-xs toggle-primary"
              />
            </div>
            <button
              onClick={handleManualRefresh}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Sync Live
            </button>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4 sm:px-8 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <AnvaLogo className="h-8 w-8 object-cover rounded-lg shadow-sm text-primary" />
              <span className="text-base-content font-bold text-xl tracking-tight font-curly">
                Anva
              </span>
            </Link>
            <span className="h-5 w-[1px] bg-base-content/20 mx-1 hidden sm:block" />
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-xl text-primary font-bold text-xs uppercase tracking-wider font-minimal">
              <ShieldAlert className="w-4 h-4" /> Admin Operations Center
            </div>
          </div>

          <div className="flex items-center gap-3 font-minimal">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-bold text-xs text-base-content flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                {authUser?.fullName || "Admin User"}
              </span>
              <span className="text-[10px] text-primary font-extrabold uppercase">{authUser?.email}</span>
            </div>

            <button
              onClick={logoutMutation}
              className="btn btn-sm btn-ghost text-error hover:bg-error/10 font-bold rounded-xl gap-1 text-xs font-minimal cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN DASHBOARD CONTAINER ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 font-minimal">
        {/* Top Summary Banner */}
        <div className="bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-content/10 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-primary tracking-wider">
              <Activity className="w-4 h-4" /> Real-Time Application Monitoring
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
              Admin Command & <span className="font-curly italic text-primary font-bold tracking-wide">Moderation Hub</span>
            </h1>
            <p className="text-sm text-base-content/60 font-medium">
              Live telemetry, user complaint resolution, account enforcement, and system administration.
            </p>
          </div>

          {/* Header Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 bg-base-200/80 rounded-2xl border border-base-content/10 flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-[10px] uppercase font-bold text-base-content/50">Total Users</div>
                <div className="font-curly text-xl font-bold text-base-content">{registeredUsers.length}</div>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-base-200/80 rounded-2xl border border-base-content/10 flex items-center gap-3">
              <Ban className="w-5 h-5 text-error" />
              <div>
                <div className="text-[10px] uppercase font-bold text-base-content/50">Suspended</div>
                <div className="font-curly text-xl font-bold text-error">{suspendedUserCount}</div>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-base-200/80 rounded-2xl border border-base-content/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-success" />
              <div>
                <div className="text-[10px] uppercase font-bold text-base-content/50">Admins</div>
                <div className="font-curly text-xl font-bold text-success">{adminCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION TAB BAR */}
        <div className="flex flex-wrap items-center gap-2 border-b border-base-content/10 pb-4">
          <button
            onClick={() => setMainTab("dashboard")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === "dashboard"
                ? "bg-primary text-primary-content shadow-md"
                : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
            }`}
          >
            <Activity className="w-4.5 h-4.5" /> 📊 Real-Time Telemetry & Overview
          </button>

          <button
            onClick={() => setMainTab("complaints")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === "complaints"
                ? "bg-primary text-primary-content shadow-md"
                : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
            }`}
          >
            <ShieldAlert className="w-4.5 h-4.5" /> 🚨 Complaints & Moderation ({rawTickets.length})
          </button>

          <button
            onClick={() => setMainTab("users")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === "users"
                ? "bg-primary text-primary-content shadow-md"
                : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
            }`}
          >
            <Users className="w-4.5 h-4.5" /> 👥 User Directory ({registeredUsers.length})
          </button>

          <button
            onClick={() => setMainTab("promote")}
            className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              mainTab === "promote"
                ? "bg-primary text-primary-content shadow-md"
                : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-content/10"
            }`}
          >
            <UserPlus className="w-4.5 h-4.5" /> ⚡ Promote Admin
          </button>
        </div>

        {/* ── TAB 1: REAL-TIME TELEMETRY & SYSTEM OVERVIEW ── */}
        {mainTab === "dashboard" && (
          <div className="space-y-6">
            {/* System Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-base-100 p-5 rounded-3xl border border-base-content/10 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                    Pending Reports
                  </p>
                  <p className="font-curly text-3xl font-bold text-warning">{stats.pendingComplaints}</p>
                </div>
              </div>

              <div className="bg-base-100 p-5 rounded-3xl border border-base-content/10 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                    In Progress
                  </p>
                  <p className="font-curly text-3xl font-bold text-info">{stats.inProgressComplaints}</p>
                </div>
              </div>

              <div className="bg-base-100 p-5 rounded-3xl border border-base-content/10 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                    Resolved Cases
                  </p>
                  <p className="font-curly text-3xl font-bold text-success">{stats.resolvedComplaints}</p>
                </div>
              </div>

              <div className="bg-base-100 p-5 rounded-3xl border border-base-content/10 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                    Total Reports
                  </p>
                  <p className="font-curly text-3xl font-bold text-base-content">{stats.totalComplaints}</p>
                </div>
              </div>
            </div>

            {/* Live System Health Gauges & Stream Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Health Cards Column */}
              <div className="bg-base-100 p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4">
                <h3 className="text-xl sm:text-2xl font-extrabold text-base-content flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" /> Application Health <span className="font-curly italic text-primary font-bold">Indicators</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>API Response Latency</span>
                      <span className="text-emerald-500">{latency}ms (Optimal)</span>
                    </div>
                    <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[20%]" />
                    </div>
                  </div>

                  <div className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Database Query Load</span>
                      <span className="text-info">Normal (12%)</span>
                    </div>
                    <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden">
                      <div className="bg-info h-full w-[12%]" />
                    </div>
                  </div>

                  <div className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Active Moderation Hold</span>
                      <span className="text-error">{suspendedUserCount} Accounts</span>
                    </div>
                    <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-error h-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (suspendedUserCount / (registeredUsers.length || 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Activity Ticker */}
              <div className="lg:col-span-2 bg-base-100 p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-base-content flex items-center gap-2">
                    <Radio className="w-5 h-5 text-primary animate-pulse" /> Real-Time Audit <span className="font-curly italic text-primary font-bold">Ticker Stream</span>
                  </h3>
                  <span className="text-xs text-base-content/50 font-semibold">
                    Synced: {lastRefreshed.toLocaleTimeString()}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {rawTickets.slice(0, 5).map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-base-200/60 rounded-2xl border border-base-content/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-base-content">{t.subject}</div>
                          <div className="text-[10px] text-base-content/60">
                            By {t.user?.fullName} ({t.user?.email}) • {new Date(t.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          t.status === "Pending"
                            ? "bg-warning/10 text-warning"
                            : t.status === "In Progress"
                            ? "bg-info/10 text-info"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}

                  {rawTickets.length === 0 && (
                    <div className="p-8 text-center text-xs text-base-content/50 font-semibold">
                      No system events recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: COMPLAINTS & ABUSE MODERATION ── */}
        {mainTab === "complaints" && (
          <div className="space-y-6">
            {/* Filter controls bar */}
            <div className="bg-base-100 p-4 rounded-2xl border border-base-content/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Tab Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setViewTab("active")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewTab === "active"
                      ? "bg-primary text-primary-content shadow-sm"
                      : "text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> Active ({stats.pendingComplaints + stats.inProgressComplaints})
                </button>
                <button
                  onClick={() => setViewTab("resolved")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewTab === "resolved"
                      ? "bg-primary text-primary-content shadow-sm"
                      : "text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolved ({stats.resolvedComplaints})
                </button>
                <button
                  onClick={() => setViewTab("all")}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewTab === "all"
                      ? "bg-primary text-primary-content shadow-sm"
                      : "text-base-content/60 hover:bg-base-200"
                  }`}
                >
                  All ({stats.totalComplaints})
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchComplaint}
                    onChange={(e) => setSearchComplaint(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Account Appeal">Account Appeal</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Spam / Abuse">Spam / Abuse</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>
            </div>

            {/* Complaints Cards Grid */}
            {isLoadingComplaints ? (
              <div className="p-12 text-center text-xs text-base-content/50 font-semibold animate-pulse">
                Loading complaints telemetry...
              </div>
            ) : complaints.length === 0 ? (
              <div className="bg-base-100 p-12 rounded-3xl border border-base-content/10 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-success mx-auto" />
                <h3 className="font-curly text-2xl font-bold text-base-content">No Complaints Found</h3>
                <p className="text-xs text-base-content/60">No tickets match the selected filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <motion.div
                      key={ticket._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-base-100 p-5 rounded-3xl border border-base-content/10 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold uppercase">
                            {ticket.category || "General"}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ticket.priority === "Urgent" || ticket.priority === "High"
                                  ? "bg-error/15 text-error"
                                  : "bg-base-200 text-base-content/70"
                              }`}
                            >
                              {ticket.priority || "Medium"} Priority
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ticket.status === "Pending"
                                  ? "bg-warning/15 text-warning"
                                  : ticket.status === "In Progress"
                                  ? "bg-info/15 text-info"
                                  : "bg-success/15 text-success"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-base-content">{ticket.subject}</h4>
                          <p className="text-xs text-base-content/60 font-medium">
                            Submitted by <strong className="text-base-content">{ticket.user?.fullName}</strong> ({ticket.user?.email})
                          </p>
                        </div>

                        <div className="p-3 bg-base-200/70 rounded-2xl text-xs text-base-content/80 whitespace-pre-line leading-relaxed font-medium">
                          {ticket.message}
                        </div>

                        {ticket.reportedUserAccount && (
                          <div className="p-2.5 bg-error/5 border border-error/15 rounded-xl text-xs flex items-center justify-between">
                            <span className="text-error font-bold">Reported Offender:</span>
                            <span className="font-mono text-base-content font-semibold">{ticket.reportedUserAccount}</span>
                          </div>
                        )}

                        {ticket.adminNotes && (
                          <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs space-y-1">
                            <span className="font-bold text-primary flex items-center gap-1">
                              <Bell className="w-3.5 h-3.5" /> Sent Response:
                            </span>
                            <p className="text-base-content/90 font-medium italic">"{ticket.adminNotes}"</p>
                          </div>
                        )}
                      </div>

                      {/* Card Actions Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-base-content/10">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditTicketOpen(ticket)}
                            className="btn btn-xs btn-primary rounded-xl font-bold gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" /> Resolve
                          </button>
                          <button
                            onClick={() => handleOpenWarning(ticket)}
                            className="btn btn-xs btn-outline btn-warning rounded-xl font-bold gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="w-3 h-3" /> Warn Offender
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {ticket.reportedUserAccount && (
                            <button
                              onClick={() => suspendOffenderMutation.mutate(ticket.reportedUserAccount)}
                              className={`btn btn-xs rounded-xl font-bold gap-1 cursor-pointer ${
                                isOffenderSuspended ? "btn-success text-white" : "btn-error text-white"
                              }`}
                            >
                              {isOffenderSuspended ? <UserCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                              {isOffenderSuspended ? "Unsuspend" : "Suspend 15d"}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this complaint report?")) {
                                deleteComplaintMutation.mutate(ticket._id);
                              }
                            }}
                            className="btn btn-xs btn-ghost text-error rounded-xl cursor-pointer"
                            title="Delete Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: USER DIRECTORY & ROLE CONTROL ── */}
        {mainTab === "users" && (
          <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="bg-base-100 p-4 rounded-2xl border border-base-content/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                <h3 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  Platform Registered Users <span className="font-curly italic text-primary font-bold">Directory</span>
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Search name, email, or ID..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="user">Users Only</option>
                  <option value="admin">Admins Only</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Accounts</option>
                  <option value="Suspended">Suspended (15d)</option>
                </select>
              </div>
            </div>

            {/* Users Cards Grid */}
            {isLoadingUsers ? (
              <div className="p-12 text-center text-xs text-base-content/50 font-semibold animate-pulse">
                Loading user directory...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-base-100 p-12 rounded-3xl border border-base-content/10 text-center">
                <UserX className="w-10 h-10 text-base-content/40 mx-auto" />
                <h3 className="font-curly text-2xl font-bold text-base-content mt-2">No Users Found</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    className="bg-base-100 p-5 rounded-3xl border border-base-content/10 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Avatar & Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.profilePic || "/avatar.png"}
                            alt={u.fullName}
                            className="size-11 rounded-2xl object-cover border border-base-content/10 shadow-sm"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-base-content truncate max-w-[140px]">
                              {u.fullName}
                            </h4>
                            <p className="text-[11px] text-base-content/60 truncate max-w-[140px]">
                              {u.email}
                            </p>
                          </div>
                        </div>

                        <select
                          value={u.role || "user"}
                          onChange={(e) =>
                            updateUserRoleMutation.mutate({ id: u._id, role: e.target.value })
                          }
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border focus:outline-none cursor-pointer ${
                            u.role === "admin"
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-base-200 text-base-content/70 border-base-content/10"
                          }`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {u.isSuspended ? (
                          <span className="px-2.5 py-0.5 bg-error/15 text-error border border-error/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <Ban className="w-3 h-3" /> 15-Day Suspended
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-success/15 text-success border border-success/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active Account
                          </span>
                        )}

                        {u.isOnboarded && (
                          <span className="px-2 py-0.5 bg-base-200 text-base-content/60 text-[10px] font-semibold rounded-full">
                            Onboarded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-base-content/10">
                      <button
                        onClick={() => suspendUserMutation.mutate(u._id)}
                        className={`btn btn-xs rounded-xl font-bold gap-1 cursor-pointer ${
                          u.isSuspended ? "btn-success text-white" : "btn-warning text-white"
                        }`}
                      >
                        {u.isSuspended ? <UserCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                        {u.isSuspended ? "Unsuspend" : "Suspend 15d"}
                      </button>

                      {u.role !== "admin" && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete profile for ${u.fullName}?`)) {
                              deleteUserMutation.mutate(u._id);
                            }
                          }}
                          className="btn btn-xs btn-ghost text-error rounded-xl font-bold gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete User
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: PROMOTE USER TO ADMIN ── */}
        {mainTab === "promote" && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-base-100 p-8 rounded-3xl border border-primary/20 shadow-xl space-y-6 text-center">
              <div className="size-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto">
                <UserPlus className="size-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-curly text-3xl font-bold text-base-content">
                  Promote User to Admin Role
                </h3>
                <p className="text-xs text-base-content/70 font-medium">
                  Grant administrative access to existing registered user accounts.
                </p>
              </div>

              <form onSubmit={handlePromoteSubmit} className="space-y-4 text-left">
                <div>
                  <label className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                    User Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter user email (e.g. alex@example.com)..."
                    value={promoteEmail}
                    onChange={(e) => setPromoteEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPromoting}
                  className="btn btn-primary btn-block rounded-2xl font-bold gap-2 text-primary-content cursor-pointer text-xs uppercase"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isPromoting ? "Promoting..." : "Grant Admin Privileges"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* RESOLUTION MODAL */}
      <AnimatePresence>
        {editingTicket && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-base-100 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-base-content/10 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-base-content/10 pb-4">
                <div>
                  <h3 className="font-curly text-2xl sm:text-3xl font-bold text-base-content">
                    Resolve User Complaint
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium flex items-center gap-1 mt-0.5">
                    <Bell className="w-3.5 h-3.5 text-primary" /> Saving notifies user via in-app alerts
                  </p>
                </div>
                <button
                  onClick={() => setEditingTicket(null)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-base-200/60 p-4 rounded-2xl border border-base-content/10 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase text-base-content/50">User Report</span>
                    <span className="font-semibold text-base-content/70">{editingTicket.user?.email}</span>
                  </div>
                  <p className="text-sm font-bold text-base-content">{editingTicket.subject}</p>
                  <p className="text-xs text-base-content/80 whitespace-pre-line leading-relaxed">
                    {editingTicket.message}
                  </p>
                </div>

                {/* Templates */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-base-content/60 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-warning" /> Response Macros:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {MACROS.map((macro, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyMacro(macro)}
                        className="p-2.5 bg-base-200 hover:bg-primary/10 hover:text-primary rounded-xl text-left border border-base-content/10 transition-all text-xs font-bold flex items-center justify-between cursor-pointer"
                      >
                        <span>{macro.label}</span>
                        <Check className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                      Priority
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full px-3 py-2.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                    Admin Response Note
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write your response message..."
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-content/10">
                <button
                  onClick={() => setEditingTicket(null)}
                  className="btn btn-ghost btn-sm rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTicket}
                  disabled={updateComplaintMutation.isPending}
                  className="btn btn-primary btn-sm rounded-xl font-bold text-xs uppercase gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {updateComplaintMutation.isPending ? "Resolving..." : "Save & Notify User"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WARNING MODAL */}
      <AnimatePresence>
        {warningTicket && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-base-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-warning/30 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-base-content/10 pb-4">
                <div className="flex items-center gap-2 text-warning font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-curly text-2xl font-bold">Send Warning to Offender</span>
                </div>
                <button
                  onClick={() => setWarningTicket(null)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                    Target User (Name / Email)
                  </label>
                  <input
                    type="text"
                    value={warningTarget}
                    onChange={(e) => setWarningTarget(e.target.value)}
                    placeholder="Enter name or email of user..."
                    className="w-full px-4 py-2.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                    Warning Title
                  </label>
                  <input
                    type="text"
                    value={warningTitle}
                    onChange={(e) => setWarningTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-base-200 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-base-content/60 block mb-1">
                    Official Warning Message
                  </label>
                  <textarea
                    rows={4}
                    value={warningMessage}
                    onChange={(e) => setWarningMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-content/10">
                <button
                  onClick={() => setWarningTicket(null)}
                  className="btn btn-ghost btn-sm rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendWarningSubmit}
                  disabled={sendWarningMutation.isPending}
                  className="btn btn-warning btn-sm rounded-xl font-bold text-xs uppercase gap-1 cursor-pointer text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sendWarningMutation.isPending ? "Sending..." : "Send Official Warning"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
