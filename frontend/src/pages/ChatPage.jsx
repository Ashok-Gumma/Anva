import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useNavigate } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, checkGrammar, getUserFriends, getUserProfile } from "../lib/api";
import { 
  Wand2, 
  X, 
  User, 
  Search, 
  MessageSquare,
  UsersIcon,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { capitalize } from "../lib/utils";
import { getLanguageIcon } from "../lib/languageUtils";

import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  MessageSimple,
  Thread,
  Window,
  Attachment as DefaultAttachment,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import PostAttachment from "../components/PostAttachment";
import CallHistoryAttachment from "../components/CallHistoryAttachment";
import WhatsAppChatView from "../components/WhatsAppChatView";
import { openVideoCallPopup } from "../lib/callWindow";
import { useCallContext } from "../context/CallContext";

const CustomAttachment = (props) => {
  const { attachments } = props;
  const postAttachment = attachments?.find((att) => att.type === "post");
  if (postAttachment) {
    return <PostAttachment attachment={postAttachment} />;
  }

  // Call history is rendered exclusively by CustomMessage as a top-level system card
  if (attachments?.some((att) => att.type === "call_history")) {
    return null;
  }

  return <DefaultAttachment {...props} />;
};

const CustomMessage = (props) => {
  const { message } = props;
  const callAttachment = message?.attachments?.find((att) => att.type === "call_history");
  const isCall =
    Boolean(callAttachment) ||
    (message?.text &&
      (message.text.includes("/call/") ||
        message.text.includes("Video Call") ||
        message.text.includes("video call") ||
        message.text.includes("Missed Video") ||
        message.text.includes("Declined Video")));

  if (isCall) {
    const attachment = callAttachment || {
      type: "call_history",
      call_status: message?.text?.toLowerCase().includes("missed")
        ? "missed"
        : message?.text?.toLowerCase().includes("declined")
        ? "declined"
        : "ended",
      call_id: message?.channel_id,
      timestamp: message?.created_at,
    };

    return (
      <div className="w-full flex justify-center my-3 px-2 select-none">
        <CallHistoryAttachment attachment={attachment} message={message} />
      </div>
    );
  }

  return <MessageSimple {...props} />;
};

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();
  const { initiateCall } = useCallContext();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Grammar Modal State
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [grammarText, setGrammarText] = useState("");
  const [grammarResult, setGrammarResult] = useState("");
  const [isGrammarLoading, setIsGrammarLoading] = useState(false);

  const { authUser } = useAuthUser();

  /* ── Friends Query for Sidebar ── */
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: !!authUser,
  });

  /* ── Target User Profile Query ── */
  const { data: targetUser } = useQuery({
    queryKey: ["userProfile", targetUserId],
    queryFn: () => getUserProfile(targetUserId),
    enabled: !!targetUserId,
  });

  /* ── Stream Token ── */
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    // If no target user is specified (e.g. /chat route), we don't connect to a channel
    if (!targetUserId) {
      setChannel(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const initChat = async () => {
      if (!tokenData?.token || !authUser || !targetUserId) return;
      setLoading(true);
      setChannel(null);

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY, {
          timeout: 15000,
        });

        if (client.userID !== authUser._id) {
          if (client.userID) await client.disconnectUser();
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
            },
            tokenData.token
          );
        }

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        // Retry watch up to 2 times on timeout
        let watched = false;
        for (let attempt = 0; attempt < 3 && !watched; attempt++) {
          try {
            await currChannel.watch();
            watched = true;
          } catch (err) {
            if (attempt === 2) throw err;
            await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          }
        }

        // Mark channel read immediately when entering chat
        await currChannel.markRead().catch(console.error);

        // Listen for new messages while viewing this channel to auto-mark read
        const handleNewMessage = () => {
          currChannel.markRead().catch(console.error);
        };
        currChannel.on("message.new", handleNewMessage);

        if (isMounted) {
          setChatClient(client);
          setChannel(currChannel);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initChat();

    return () => {
      isMounted = false;
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    const peer = currentFriend || {
      _id: targetUserId,
      fullName: targetUser?.fullName || "Peer",
      profilePic: targetUser?.profilePic || "",
    };

    initiateCall({
      targetUser: peer,
      channelId: channel?.id,
      channel,
      navigateFallback: navigate,
    });
  };

  const handleChatContainerClick = (e) => {
    const anchor = e.target.closest("a");
    if (anchor && anchor.href) {
      try {
        const url = new URL(anchor.href);
        if (url.pathname.startsWith("/call/")) {
          e.preventDefault();
          e.stopPropagation();
          openVideoCallPopup(anchor.href);
        }
      } catch {
        // no-op
      }
    }
  };

  const handleCheckGrammar = async () => {
    if (!grammarText.trim()) return;
    setIsGrammarLoading(true);
    try {
      const response = await checkGrammar(grammarText);
      setGrammarResult(response.reply);
    } catch {
      setGrammarResult("Failed to check grammar.");
    } finally {
      setIsGrammarLoading(false);
    }
  };

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    const q = searchQuery.toLowerCase();
    return friends.filter(
      (f) =>
        f.fullName?.toLowerCase().includes(q) ||
        f.nativeLanguage?.toLowerCase().includes(q) ||
        f.learningLanguage?.toLowerCase().includes(q)
    );
  }, [friends, searchQuery]);

  const currentFriend = useMemo(() => {
    return targetUser || friends.find((f) => f._id === targetUserId);
  }, [targetUser, friends, targetUserId]);

  const isOnline = useMemo(() => {
    if (!currentFriend?.lastActive) return false;
    return new Date() - new Date(currentFriend.lastActive) <= 5 * 60 * 1000;
  }, [currentFriend]);

  // Peer Selection Handler (navigates and closes any active drawer)
  const handleSelectPeer = (friendId) => {
    setMobileMenuOpen(false);
    navigate(`/chat/${friendId}`);
  };

  // Reusable Sidebar & List Content
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-base-100 w-full select-none">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-base-content/10 bg-base-100 shrink-0">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-inner text-primary">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest uppercase text-base-content">Peers Chat</h1>
              <span className="text-[10px] text-base-content/50 font-bold uppercase tracking-wider">
                {friends.length} {friends.length === 1 ? "Peer" : "Peers"} Connected
              </span>
            </div>
          </div>
          {mobileMenuOpen && (
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search peer or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-base-200/60 border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium text-base-content placeholder:text-base-content/40 transition-all"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em]">Active Conversations</h2>
          <span className="text-[10px] font-mono text-base-content/40">{filteredFriends.length}</span>
        </div>

        {loadingFriends ? (
          <div className="space-y-2 p-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-base-200 animate-pulse" />
            ))}
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="size-12 rounded-2xl bg-base-200 mx-auto flex items-center justify-center text-base-content/30">
              <UsersIcon className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-base-content/70">No peers found</p>
              <p className="text-[11px] text-base-content/40 mt-0.5">
                {searchQuery ? "Try searching another name or language" : "Connect with learners to start messaging"}
              </p>
            </div>
            <Link
              to="/friends"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-content text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
            >
              <UsersIcon className="size-3.5" /> Find Peers
            </Link>
          </div>
        ) : (
          filteredFriends.map((friend) => {
            const isSelected = friend._id === targetUserId;
            const friendOnline = friend.lastActive && (new Date() - new Date(friend.lastActive)) <= 5 * 60 * 1000;

            return (
              <button
                key={friend._id}
                type="button"
                onClick={() => handleSelectPeer(friend._id)}
                className={`w-full p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between text-left group relative ${
                  isSelected
                    ? "bg-primary/10 border-primary/30 text-primary shadow-xs"
                    : "bg-base-100 border-base-content/5 text-base-content hover:bg-base-200/70 hover:border-base-content/10 active:scale-[0.98]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative size-11 rounded-xl bg-primary text-primary-content flex items-center justify-center font-black text-sm overflow-hidden shrink-0 shadow-sm">
                    <span>{friend.fullName?.charAt(0)?.toUpperCase()}</span>
                    {friend.profilePic && (
                      <img src={friend.profilePic} alt={friend.fullName} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {friendOnline && (
                      <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full bg-success border-2 border-base-100" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate ${isSelected ? "text-primary" : "text-base-content"}`}>
                        {friend.fullName}
                      </p>
                      {friendOnline && (
                        <span className="text-[9px] font-bold text-success uppercase tracking-wider shrink-0">Online</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-base-content/50 mt-0.5 truncate">
                      <span>{getLanguageIcon(friend.learningLanguage)} Learning {capitalize(friend.learningLanguage || "Language")}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Navigation Back to Friends */}
      <div className="p-3.5 border-t border-base-content/10 bg-base-100 shrink-0">
        <Link
          to="/friends"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/70 hover:text-base-content p-2.5 rounded-xl border border-base-content/10 hover:bg-base-200 transition-all w-full"
        >
          <UsersIcon className="size-4" />
          Find More Peers
        </Link>
      </div>
    </div>
  );

  // 1. Mobile Full-Screen Peers List / Desktop Blank State (when no target peer selected)
  if (!targetUserId) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] bg-base-200 text-base-content overflow-hidden font-sans selection:bg-primary/20 w-full">
        {/* Full-width on Mobile, Left Sidebar on Desktop */}
        <aside className="w-full md:w-80 border-r border-base-content/10 bg-base-100 flex flex-col shrink-0 h-full">
          {renderSidebarContent()}
        </aside>

        {/* Desktop Blank State */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-base-200/50 space-y-4">
          <div className="size-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <MessageCircle className="size-10" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-xl font-black tracking-tight text-base-content">Select a Peer to Chat</h3>
            <p className="text-xs text-base-content/60 leading-relaxed">
              Choose a study partner from your active conversations on the left to practice languages and collaborate in real-time.
            </p>
          </div>
          <Link
            to="/friends"
            className="btn btn-primary btn-sm rounded-full font-bold px-6 shadow-sm uppercase tracking-wider text-xs"
          >
            <UsersIcon className="size-4 mr-1" /> Discover New Peers
          </Link>
        </div>
      </div>
    );
  }

  // 2. Active Chat Loading Screen
  if (loading || !chatClient || !channel) return <ChatLoader />;

  // 3. Active Conversation View
  return (
    <div className="flex h-[calc(100dvh-4rem)] bg-base-200 text-base-content overflow-hidden font-sans selection:bg-primary/20 w-full">
      {/* Desktop Left Sidebar */}
      <aside className="w-80 border-r border-base-content/10 bg-base-100 hidden md:flex flex-col shrink-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Slide-in Drawer via Portal (escapes all stacking/overflow constraints) */}
      {createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100dvh",
                  backgroundColor: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(4px)",
                  zIndex: 99998,
                  cursor: "pointer",
                }}
              />

              {/* Drawer Sheet */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "320px",
                  maxWidth: "85vw",
                  height: "100dvh",
                  zIndex: 99999,
                  overflowY: "auto",
                }}
                className="bg-base-100 border-r border-base-content/15 shadow-2xl flex flex-col"
              >
                {renderSidebarContent()}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative chat-wallpaper w-full overflow-hidden">
        {/* Custom Header Bar */}
        <header className="px-3 sm:px-6 py-3 bg-base-100/95 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-20 flex items-center justify-between shrink-0 shadow-2xs min-h-[64px] gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Mobile Controls: Back button to Peers List & Quick Drawer trigger */}
            <div className="flex items-center gap-1.5 md:hidden shrink-0">
              <Link
                to="/chat"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Back to Peers List"
              >
                <ArrowLeft className="size-4" />
                <span>Peers</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-extrabold tracking-wide transition-all cursor-pointer shadow-2xs"
                title="Open Peers Drawer"
              >
                <UsersIcon className="size-4" />
              </button>
            </div>

            {/* Target User Profile Info */}
            {currentFriend && (
              <div className="flex items-center gap-2.5 min-w-0">
                <Link to={`/user/${targetUserId}`} className="relative shrink-0 group">
                  <div className="size-10 rounded-xl bg-primary text-primary-content flex items-center justify-center font-black text-sm overflow-hidden shadow-sm border border-base-content/10 group-hover:scale-105 transition-transform">
                    <span>{currentFriend.fullName?.charAt(0)?.toUpperCase()}</span>
                    {currentFriend.profilePic && (
                      <img src={currentFriend.profilePic} alt={currentFriend.fullName} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </div>
                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-success border-2 border-base-100 shadow-sm" />
                  )}
                </Link>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link to={`/user/${targetUserId}`} className="font-black text-sm text-base-content tracking-tight truncate hover:underline">
                      {currentFriend.fullName}
                    </Link>
                    {isOnline ? (
                      <span className="px-1.5 py-0.5 bg-success/15 text-success text-[8px] font-black uppercase rounded-md tracking-wider">Online</span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-base-300 text-base-content/40 text-[8px] font-black uppercase rounded-md tracking-wider">Offline</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-base-content/60 font-bold mt-0.5 truncate">
                    {currentFriend.nativeLanguage && (
                      <span className="flex items-center gap-1">
                        Native: {getLanguageIcon(currentFriend.nativeLanguage)} {capitalize(currentFriend.nativeLanguage)}
                      </span>
                    )}
                    {currentFriend.learningLanguage && (
                      <span className="flex items-center gap-1 text-primary">
                        Learning: {getLanguageIcon(currentFriend.learningLanguage)} {capitalize(currentFriend.learningLanguage)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <CallButton handleVideoCall={handleVideoCall} />

            <button
              type="button"
              onClick={() => setIsGrammarModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-content border border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              title="AI Grammar Assistant"
            >
              <Wand2 className="size-4" />
              <span className="hidden sm:inline">AI Grammar</span>
            </button>

            <Link
              to={`/user/${targetUserId}`}
              className="p-2 border border-base-content/10 hover:border-base-content/20 rounded-full hover:bg-base-content/5 transition-all text-base-content cursor-pointer"
              title="View Profile"
            >
              <User className="size-4" />
            </Link>
          </div>
        </header>

        {/* WhatsApp / Instagram Style Real-time Chat Feed */}
        <div
          onClickCapture={handleChatContainerClick}
          className="flex-1 w-full h-full relative overflow-hidden flex flex-col"
        >
          <WhatsAppChatView
            channel={channel}
            chatClient={chatClient}
            authUser={authUser}
            targetUser={currentFriend || targetUser}
          />
        </div>
      </div>

      {/* Grammar Modal */}
      {isGrammarModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-base-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-base-content/10 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="p-5 border-b border-base-content/10 flex justify-between items-center bg-primary/10">
              <h3 className="font-black flex items-center gap-2 text-base text-base-content uppercase tracking-wider">
                <Wand2 className="text-primary size-5" /> AI Grammar Assistant
              </h3>
              <button onClick={() => setIsGrammarModalOpen(false)} className="btn btn-sm btn-circle btn-ghost">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-bold uppercase tracking-wider text-base-content/70">Enter text to verify before sending to peer:</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-28 text-sm focus:ring-2 focus:ring-primary/30 font-medium text-base-content"
                  placeholder="e.g. How is you doing today?"
                  value={grammarText}
                  onChange={(e) => setGrammarText(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary w-full text-xs font-black uppercase tracking-widest shadow-md"
                onClick={handleCheckGrammar}
                disabled={isGrammarLoading || !grammarText.trim()}
              >
                {isGrammarLoading ? <span className="loading loading-spinner" /> : "Analyze & Correct Grammar"}
              </button>

              {grammarResult && (
                <div className="mt-4 p-4 rounded-2xl bg-base-200 border border-base-content/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">AI Suggestions</h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(grammarResult);
                        toast.success("Result copied to clipboard!");
                      }}
                      className="btn btn-ghost btn-xs text-[10px] font-bold uppercase"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-base-content/90 font-medium whitespace-pre-wrap">
                    {grammarResult}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
