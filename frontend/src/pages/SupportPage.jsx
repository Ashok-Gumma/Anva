import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupportTicket, getMySupportTickets, getUserFriends } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import {
  LifeBuoy,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
  Sparkles,
  UserX,
  Laptop,
  Lightbulb,
  Lock,
  FileText,
  ChevronRight,
  ShieldAlert,
  Calendar,
  RefreshCw,
} from "lucide-react";

const SupportPage = () => {
  const { authUser } = useAuthUser();
  const [now, setNow] = useState(Date.now());
  const [activeTab, setActiveTab] = useState("submit");
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [appealSubject, setAppealSubject] = useState("Account Suspension Appeal - Request for Review");
  const [appealMessage, setAppealMessage] = useState("");

  const [formData, setFormData] = useState({
    subject: "",
    category: authUser?.isSuspended ? "Account Appeal" : "Bug",
    priority: "Medium",
    message: "",
    reportedUserAccount: "",
    abuseType: "Harassment in Chat",
    accountIssueType: "Login / Authentication Error",
    affectedFeature: "Chat & Messages",
    deviceInfo: "",
    featureImpact: "Important Improvement",
  });

  useEffect(() => {
    if (!authUser?.isSuspended) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [authUser?.isSuspended]);

  const suspensionData = useMemo(() => {
    if (!authUser?.isSuspended) return null;
    const until = authUser?.suspendedUntil
      ? new Date(authUser.suspendedUntil)
      : new Date(now + 15 * 24 * 60 * 60 * 1000);
    const at = authUser?.suspendedAt ? new Date(authUser.suspendedAt) : new Date(until.getTime() - 15 * 24 * 60 * 60 * 1000);

    const totalDurationMs = 15 * 24 * 60 * 60 * 1000;
    const diffMs = Math.max(0, until.getTime() - now);

    const secondsTotal = Math.floor(diffMs / 1000);
    const days = Math.floor(secondsTotal / (24 * 3600));
    const hours = Math.floor((secondsTotal % (24 * 3600)) / 3600);
    const minutes = Math.floor((secondsTotal % 3600) / 60);
    const seconds = secondsTotal % 60;

    const elapsedMs = Math.max(0, totalDurationMs - diffMs);
    const pct = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));

    return {
      daysLeft: days,
      hoursLeft: hours,
      minutesLeft: minutes,
      secondsLeft: seconds,
      percentComplete: pct.toFixed(1),
      suspendedUntilDate: until.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      suspendedAtDate: at.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  }, [authUser, now]);

  const queryClient = useQueryClient();

  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["mySupportTickets"],
    queryFn: getMySupportTickets,
  });

  const { data: friendsData } = useQuery({
    queryKey: ["userFriends"],
    queryFn: getUserFriends,
    enabled: !authUser?.isSuspended,
  });

  const userFriends = friendsData?.friends || friendsData || [];
  const tickets = ticketsData?.tickets || [];

  const submitMutation = useMutation({
    mutationFn: createSupportTicket,
    onSuccess: (data) => {
      toast.success(data.message || "Ticket / Appeal submitted successfully!");
      setFormData({
        subject: "",
        category: authUser?.isSuspended ? "Account Appeal" : "Bug",
        priority: "Medium",
        message: "",
        reportedUserAccount: "",
        abuseType: "Harassment in Chat",
        accountIssueType: "Login / Authentication Error",
        affectedFeature: "Chat & Messages",
        deviceInfo: "",
        featureImpact: "Important Improvement",
      });
      queryClient.invalidateQueries({ queryKey: ["mySupportTickets"] });
      setActiveTab("history");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit ticket.");
    },
  });

  const handleModalAppealSubmit = (e) => {
    e.preventDefault();
    if (!appealSubject.trim() || !appealMessage.trim()) {
      toast.error("Please provide a subject and detailed appeal message");
      return;
    }

    submitMutation.mutate(
      {
        subject: appealSubject,
        category: "Account Appeal",
        priority: "Urgent",
        message: appealMessage,
      },
      {
        onSuccess: () => {
          setIsAppealModalOpen(false);
          setAppealMessage("");
        },
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in subject and message description");
      return;
    }

    if (formData.category === "Abuse/Harassment" && !formData.reportedUserAccount.trim()) {
      toast.error("Please specify the user account being reported");
      return;
    }

    submitMutation.mutate(formData);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2.5 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded-full text-[11px] font-bold flex items-center gap-1 font-minimal">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "In Progress":
        return (
          <span className="px-2.5 py-0.5 bg-info/10 text-info border border-info/20 rounded-full text-[11px] font-bold flex items-center gap-1 font-minimal">
            <AlertCircle className="w-3 h-3" /> In Progress
          </span>
        );
      case "Resolved":
        return (
          <span className="px-2.5 py-0.5 bg-success/10 text-success border border-success/20 rounded-full text-[11px] font-bold flex items-center gap-1 font-minimal">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2.5 py-0.5 bg-error/10 text-error border border-error/20 rounded-full text-[11px] font-bold flex items-center gap-1 font-minimal">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-base-200 text-base-content/60 text-[11px] font-medium rounded-full font-minimal">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Urgent":
        return (
          <span className="px-2 py-0.5 bg-error/10 text-error border border-error/20 rounded-md text-[10px] font-bold uppercase font-minimal">
            Urgent
          </span>
        );
      case "High":
        return (
          <span className="px-2 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded-md text-[10px] font-bold uppercase font-minimal">
            High
          </span>
        );
      case "Medium":
        return (
          <span className="px-2 py-0.5 bg-info/10 text-info border border-info/20 rounded-md text-[10px] font-bold uppercase font-minimal">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-base-200 text-base-content/60 text-[10px] font-semibold rounded-md font-minimal">
            Low
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 font-minimal selection:bg-primary selection:text-primary-content">
      {/* 🔒 SUSPENSION NOTICE & LIVE TIMER BANNER */}
      {authUser?.isSuspended && suspensionData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-error/10 border border-error/30 shadow-lg space-y-5"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-error/20 text-error rounded-2xl shrink-0">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-error/20 text-error border border-error/30 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  15-Day Account Restriction Active
                </span>
                <h2 className="font-curly text-3xl font-bold text-error tracking-wide">
                  Account Currently Suspended
                </h2>
                <p className="text-xs text-base-content/70 font-medium">
                  Other pages are locked. Use this Support & Appeal Desk to review guidelines or submit an official appeal.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, category: "Account Appeal" }));
                setActiveTab("submit");
                setIsAppealModalOpen(true);
              }}
              className="btn btn-error btn-sm rounded-xl text-white font-bold gap-1 text-xs uppercase cursor-pointer shrink-0 shadow-md hover:scale-105 transition-all"
            >
              <ShieldAlert className="w-4 h-4" /> Submit Appeal Ticket
            </button>
          </div>

          {/* Real-time Live Digital Clock */}
          <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-error/20">
            <div className="bg-base-100/90 p-3 rounded-2xl border border-error/20">
              <div className="font-curly text-2xl sm:text-3xl font-bold text-error">
                {suspensionData.daysLeft}
              </div>
              <div className="text-[10px] uppercase font-bold text-base-content/50">Days</div>
            </div>
            <div className="bg-base-100/90 p-3 rounded-2xl border border-error/20">
              <div className="font-curly text-2xl sm:text-3xl font-bold text-error">
                {suspensionData.hoursLeft}
              </div>
              <div className="text-[10px] uppercase font-bold text-base-content/50">Hours</div>
            </div>
            <div className="bg-base-100/90 p-3 rounded-2xl border border-error/20">
              <div className="font-curly text-2xl sm:text-3xl font-bold text-error">
                {suspensionData.minutesLeft}
              </div>
              <div className="text-[10px] uppercase font-bold text-base-content/50">Mins</div>
            </div>
            <div className="bg-base-100/90 p-3 rounded-2xl border border-error/20">
              <div className="font-curly text-2xl sm:text-3xl font-bold text-error animate-pulse">
                {suspensionData.secondsLeft}
              </div>
              <div className="text-[10px] uppercase font-bold text-base-content/50">Secs</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 p-6 sm:p-8 rounded-3xl border border-base-content/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary font-minimal">
            <LifeBuoy className="w-4 h-4" /> Support & Complaints Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            How can we assist you <span className="font-curly italic text-primary font-bold tracking-wide">today?</span>
          </h1>
          <p className="text-sm text-base-content/60 font-medium">
            Submit bug reports, policy appeals, or feature requests directly to system admins.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-base-200/80 p-1.5 rounded-2xl border border-base-content/10 shrink-0 font-minimal">
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "submit"
                ? "bg-primary text-primary-content shadow-sm"
                : "text-base-content/70 hover:bg-base-100"
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Submit Ticket
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "history"
                ? "bg-primary text-primary-content shadow-sm"
                : "text-base-content/70 hover:bg-base-100"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> My History ({tickets.length})
          </button>
        </div>
      </motion.div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "submit" ? (
          <motion.div
            key="submit-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-content/10 shadow-sm space-y-6 font-minimal"
          >
            <div className="flex items-center gap-3 border-b border-base-content/10 pb-4">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-curly text-2xl font-bold text-base-content">
                  Create Support Request
                </h2>
                <p className="text-xs text-base-content/60 font-medium">
                  Provide detailed information so our team can resolve your issue quickly.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="Bug">🐛 Technical Bug Report</option>
                    <option value="Abuse/Harassment">🛡️ Abuse / Harassment Report</option>
                    <option value="Account">👤 Account & Security Issue</option>
                    <option value="Account Appeal">⚖️ Account Suspension Appeal</option>
                    <option value="Feature Request">💡 Feature Suggestion</option>
                    <option value="Other">💬 General Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">🔥 Urgent</option>
                  </select>
                </div>
              </div>

              {/* DYNAMIC CATEGORY-SPECIFIC DETAILS */}
              {formData.category === "Abuse/Harassment" && (
                <div className="p-4 rounded-2xl bg-error/5 border border-error/15 space-y-4 font-minimal">
                  <div className="flex items-center gap-2 text-error">
                    <UserX className="w-4 h-4" />
                    <span className="font-curly text-xl font-bold">Harassment Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-base-content/70">
                        Reported User Account *
                      </label>
                      {userFriends.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              setFormData({ ...formData, reportedUserAccount: e.target.value });
                            }
                          }}
                          className="w-full px-3.5 py-2 bg-base-100 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none mb-1 cursor-pointer"
                        >
                          <option value="">-- Select from Friends --</option>
                          {userFriends.map((friend) => (
                            <option key={friend._id} value={`${friend.fullName} (${friend.email})`}>
                              👤 {friend.fullName} ({friend.email})
                            </option>
                          ))}
                        </select>
                      )}
                      <input
                        type="text"
                        placeholder="Enter username or email of reported user..."
                        value={formData.reportedUserAccount}
                        onChange={(e) => setFormData({ ...formData, reportedUserAccount: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-base-100 text-base-content border border-base-content/10 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-error"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-base-content/70">
                        Abuse Type
                      </label>
                      <select
                        value={formData.abuseType}
                        onChange={(e) => setFormData({ ...formData, abuseType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-base-100 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="Harassment in Chat">Harassment in Chat</option>
                        <option value="Inappropriate Profile / Avatar">Inappropriate Profile / Avatar</option>
                        <option value="Spam / Unsolicited Messages">Spam / Unsolicited Messages</option>
                        <option value="Offensive / Hate Language">Offensive / Hate Language</option>
                        <option value="Other Harassment">Other Harassment</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {formData.category === "Account" && (
                <div className="p-4 rounded-2xl bg-info/5 border border-info/15 space-y-3 font-minimal">
                  <div className="flex items-center gap-2 text-info">
                    <Lock className="w-4 h-4" />
                    <span className="font-curly text-xl font-bold">Account & Security Details</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-base-content/70">
                      Issue Type
                    </label>
                    <select
                      value={formData.accountIssueType}
                      onChange={(e) => setFormData({ ...formData, accountIssueType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-base-100 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="Password Reset Failure">Password Reset Failure</option>
                      <option value="Login / Authentication Error">Login / Authentication Error</option>
                      <option value="Profile Details Update Error">Profile Details Update Error</option>
                      <option value="Account Locked or Suspended">Account Locked or Suspended</option>
                      <option value="Privacy & Data Request">Privacy & Data Request</option>
                    </select>
                  </div>
                </div>
              )}

              {formData.category === "Bug" && (
                <div className="p-4 rounded-2xl bg-warning/5 border border-warning/15 space-y-4 font-minimal">
                  <div className="flex items-center gap-2 text-warning">
                    <Laptop className="w-4 h-4" />
                    <span className="font-curly text-xl font-bold">Technical Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-base-content/70">
                        Affected Feature
                      </label>
                      <select
                        value={formData.affectedFeature}
                        onChange={(e) => setFormData({ ...formData, affectedFeature: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-base-100 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="Chat & Messages">Chat & Messages</option>
                        <option value="Video/Voice Calls">Video / Voice Calls</option>
                        <option value="Code Compiler">Code Compiler</option>
                        <option value="Flashcards & Decks">Flashcards & Decks</option>
                        <option value="AI Language Assistant">AI Language Assistant</option>
                        <option value="Login / Onboarding">Login / Onboarding</option>
                        <option value="Other Feature">Other Feature</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-base-content/70">
                        Device & Browser Info
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chrome on Windows 11..."
                        value={formData.deviceInfo}
                        onChange={(e) => setFormData({ ...formData, deviceInfo: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-base-100 text-base-content border border-base-content/10 rounded-xl text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.category === "Feature Request" && (
                <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/15 space-y-4 font-minimal">
                  <div className="flex items-center gap-2 text-secondary">
                    <Lightbulb className="w-4 h-4" />
                    <span className="font-curly text-xl font-bold">Feature Suggestion Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-base-content/70">
                        Target Feature Area
                      </label>
                      <select
                        value={formData.affectedFeature}
                        onChange={(e) => setFormData({ ...formData, affectedFeature: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-base-100 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="AI Language Assistant">AI Language Assistant</option>
                        <option value="Code Compiler Languages">Code Compiler Languages</option>
                        <option value="Friends & Study Network">Friends & Study Network</option>
                        <option value="Flashcards & Decks">Flashcards & Decks</option>
                        <option value="UI & Themes">UI & Themes</option>
                        <option value="Other Area">Other Area</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase text-base-content/70">
                        Impact / Priority
                      </label>
                      <select
                        value={formData.featureImpact}
                        onChange={(e) => setFormData({ ...formData, featureImpact: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-base-100 text-base-content border border-base-content/10 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="Nice to Have">Nice to Have</option>
                        <option value="Important Improvement">Important Improvement</option>
                        <option value="Critical Feature">Critical Feature</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Subject Title */}
              <div className="space-y-1.5 font-minimal">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Subject Title
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of your request..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary placeholder:font-normal"
                  required
                />
              </div>

              {/* Message Body */}
              <div className="space-y-1.5 font-minimal">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Detailed Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your issue, steps to reproduce, or feedback..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:font-normal"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end font-minimal">
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="btn btn-primary rounded-2xl font-bold gap-2 text-xs uppercase px-8 cursor-pointer shadow-md"
                >
                  {submitMutation.isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Support Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 font-minimal"
          >
            {isLoadingTickets ? (
              <div className="p-12 text-center text-xs font-semibold text-base-content/50 animate-pulse font-minimal">
                Loading support tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-base-100 p-12 rounded-3xl border border-base-content/10 text-center space-y-3 shadow-sm font-minimal">
                <FileText className="w-10 h-10 text-base-content/30 mx-auto" />
                <h3 className="font-curly text-3xl font-bold text-base-content">No Tickets Submitted</h3>
                <p className="text-xs text-base-content/60 font-medium">
                  You haven't submitted any complaints or support tickets yet.
                </p>
                <button
                  onClick={() => setActiveTab("submit")}
                  className="btn btn-primary btn-sm rounded-xl font-bold uppercase text-xs cursor-pointer font-minimal"
                >
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-base-100 p-5 sm:p-6 rounded-3xl border border-base-content/10 shadow-sm space-y-3.5 font-minimal"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-content/10 pb-3 font-minimal">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[10px] font-bold uppercase font-minimal">
                        {ticket.category}
                      </span>
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>
                    <span className="text-[11px] text-base-content/50 font-medium font-minimal">
                      Submitted {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-curly text-xl font-bold text-base-content">{ticket.subject}</h3>
                    <p className="text-xs text-base-content/80 mt-1.5 whitespace-pre-line leading-relaxed font-medium bg-base-200/60 p-3.5 rounded-2xl border border-base-content/5 font-minimal">
                      {ticket.message}
                    </p>
                  </div>

                  {ticket.adminNotes && (
                    <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-2xl space-y-1 font-minimal">
                      <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="font-curly text-base font-bold">Admin Response</span>
                      </div>
                      <p className="text-xs text-base-content/90 font-medium italic font-minimal">
                        "{ticket.adminNotes}"
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🛡️ SUBMIT APPEAL MODAL */}
      <AnimatePresence>
        {isAppealModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-minimal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-base-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-error/30 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-base-content/10 pb-4">
                <div className="flex items-center gap-2 text-error">
                  <ShieldAlert className="w-6 h-6" />
                  <h3 className="font-curly text-2xl font-bold">Submit Account Appeal</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAppealModalOpen(false)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleModalAppealSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-error/10 border border-error/20 text-xs font-semibold text-error flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Your account is under 15-day restriction hold. This appeal will be delivered directly to platform administrators.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-base-content/60">
                    Appeal Subject Title
                  </label>
                  <input
                    type="text"
                    value={appealSubject}
                    onChange={(e) => setAppealSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-error"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-base-content/60">
                    Detailed Appeal Reason / Statement *
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Explain why your account suspension should be reviewed or lifted..."
                    value={appealMessage}
                    onChange={(e) => setAppealMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-base-200 text-base-content border border-base-content/10 rounded-2xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-error resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-content/10">
                  <button
                    type="button"
                    onClick={() => setIsAppealModalOpen(false)}
                    className="btn btn-ghost btn-sm rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="btn btn-error btn-sm rounded-xl font-bold text-xs uppercase gap-1 cursor-pointer text-white shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitMutation.isPending ? "Submitting..." : "Send Appeal to Admins"}
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

export default SupportPage;
