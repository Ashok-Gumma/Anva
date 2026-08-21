import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { StreamChat } from "stream-chat";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Share2,
  Copy,
  Check,
  Search,
  Send,
  Users,
  FileText,
  ImageIcon,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import { getUserFriends, getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { Link } from "react-router";

const SharePostModal = ({ isOpen, onClose, post }) => {
  const { authUser } = useAuthUser();
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [sendingMap, setSendingMap] = useState({}); // { [friendId]: boolean }
  const [sentMap, setSentMap] = useState({}); // { [friendId]: boolean }

  // Fetch Friends
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    enabled: isOpen && !!authUser,
  });

  // Fetch Stream Token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: isOpen && !!authUser,
  });

  const postUrl = useMemo(() => {
    if (!post?._id) return window.location.href;
    return `${window.location.origin}/feed#post-${post._id}`;
  }, [post]);

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    const q = searchQuery.toLowerCase();
    return friends.filter(
      (f) =>
        f.fullName?.toLowerCase().includes(q) ||
        f.headline?.toLowerCase().includes(q) ||
        f.nativeLanguage?.toLowerCase().includes(q) ||
        f.learningLanguage?.toLowerCase().includes(q)
    );
  }, [friends, searchQuery]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success("Link copied to clipboard! 📋");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleNativeShare = async () => {
    const authorName = post?.user?.fullName || "Community Member";
    const shareTitle = `${authorName} on Anva`;
    const shareText = post?.caption
      ? post.caption.length > 120
        ? post.caption.slice(0, 117) + "..."
        : post.caption
      : "Check out this educational post on Anva!";

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: postUrl,
        });
        toast.success("Post shared!");
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSendToFriend = async (friend) => {
    if (!authUser || !tokenData?.token) {
      toast.error("Chat is initializing. Please try again.");
      return;
    }

    const friendId = friend._id;
    setSendingMap((prev) => ({ ...prev, [friendId]: true }));

    try {
      const apiKey = import.meta.env.VITE_STREAM_API_KEY;
      if (!apiKey) throw new Error("Stream API key is not configured.");

      const client = StreamChat.getInstance(apiKey, { timeout: 15000 });

      if (client.userID !== authUser._id) {
        if (client.userID) await client.disconnectUser();
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );
      }

      const channelId = [authUser._id, friendId].sort().join("-");
      const channel = client.channel("messaging", channelId, {
        members: [authUser._id, friendId],
      });

      await channel.watch();

      const authorName = post?.user?.fullName ? post.user.fullName.slice(0, 60) : "Community Member";
      const snippet = post?.caption
        ? post.caption.length > 120
          ? post.caption.slice(0, 117) + "..."
          : post.caption
        : "";

      // Only pass external URLs, never big base64 strings to avoid StreamChat 5KB limit
      const cleanAuthorPic =
        typeof post.user?.profilePic === "string" &&
        post.user.profilePic.startsWith("http") &&
        !post.user.profilePic.startsWith("data:")
          ? post.user.profilePic
          : "/avatar.png";

      const cleanImage =
        typeof post.image === "string" &&
        post.image.startsWith("http") &&
        !post.image.startsWith("data:")
          ? post.image
          : undefined;

      const postAttachment = {
        type: "post",
        post_id: post._id?.toString(),
        post_author_name: authorName,
        post_author_pic: cleanAuthorPic,
        post_caption: snippet,
        post_image: cleanImage,
        has_image: Boolean(post.image || post.hasImage),
        has_pdf: Boolean(post.pdfUrl || post.hasPdf),
        post_pdf_name: post.pdfFileName ? post.pdfFileName.slice(0, 50) : undefined,
        post_url: postUrl,
      };

      const messageContent = customNote.trim() || undefined;

      await channel.sendMessage({
        text: messageContent,
        attachments: [postAttachment],
      });

      setSentMap((prev) => ({ ...prev, [friendId]: true }));
      toast.success(`Shared with ${friend.fullName}! 🚀`);
    } catch (error) {
      console.error("Error sending post via chat:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSendingMap((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  if (!isOpen || !post) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-base-100 rounded-3xl border border-base-content/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-content/10 bg-base-200/40">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Share2 className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-base-content">
                  Share Post
                </h3>
                <span className="text-[10px] text-base-content/50 font-bold uppercase tracking-wider block">
                  Send to friends or copy link
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/50 hover:text-base-content transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar">
            {/* Post Summary Preview Card */}
            <div className="p-3.5 bg-base-200/60 rounded-2xl border border-base-content/5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={post.user?.profilePic || "/avatar.png"}
                    alt={post.user?.fullName}
                    className="size-7 rounded-xl object-cover border border-base-content/10 shrink-0"
                  />
                  <span className="text-xs font-bold text-base-content truncate">
                    {post.user?.fullName || "Community Member"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {(post.image || post.hasImage) && (
                    <span className="px-2 py-0.5 rounded-md bg-base-300 text-base-content/70 text-[9px] font-black uppercase flex items-center gap-1">
                      <ImageIcon className="size-3" /> Image
                    </span>
                  )}
                  {(post.pdfUrl || post.hasPdf) && (
                    <span className="px-2 py-0.5 rounded-md bg-secondary/15 text-secondary text-[9px] font-black uppercase flex items-center gap-1">
                      <FileText className="size-3" /> PDF
                    </span>
                  )}
                </div>
              </div>
              {post.caption && (
                <p className="text-xs text-base-content/80 font-medium line-clamp-2 leading-relaxed italic">
                  "{post.caption}"
                </p>
              )}
            </div>

            {/* Copy Link Section */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                Post Link
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-base-200/70 border border-base-content/10 text-xs font-mono text-base-content/70 truncate select-all">
                  <span className="truncate">{postUrl}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`btn btn-sm rounded-xl font-bold gap-1.5 text-xs transition-all cursor-pointer ${
                    copied
                      ? "btn-success text-white"
                      : "btn-primary shadow-sm hover:scale-102"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy Link
                    </>
                  )}
                </button>
                {typeof navigator !== "undefined" && navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="btn btn-ghost btn-sm border border-base-content/10 rounded-xl px-2.5 hover:bg-base-200"
                    title="More sharing options"
                  >
                    <ExternalLink className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Note before sending (optional) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 block">
                Add a Note (Optional)
              </span>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Check this out! Helpful for our interview prep..."
                className="w-full px-3.5 py-2 rounded-xl bg-base-200/50 border border-base-content/10 text-xs text-base-content placeholder:text-base-content/40 focus:outline-primary font-medium"
              />
            </div>

            {/* Send to Friends List */}
            <div className="space-y-3 pt-2 border-t border-base-content/10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-base-content/50 flex items-center gap-1.5">
                  <Users className="size-3.5" /> Send Directly to Friends ({friends.length})
                </span>
              </div>

              {/* Search Friends Input */}
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search connected peers..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-base-200/50 border border-base-content/10 text-xs text-base-content placeholder:text-base-content/40 focus:outline-primary font-medium"
                />
              </div>

              {/* Friends List Scroll Area */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {loadingFriends ? (
                  <div className="p-8 text-center text-xs font-bold text-base-content/40 animate-pulse">
                    Loading your peers...
                  </div>
                ) : friends.length === 0 ? (
                  <div className="p-6 text-center bg-base-200/40 rounded-2xl border border-base-content/5 space-y-2">
                    <Users className="size-8 mx-auto text-base-content/30" />
                    <p className="text-xs font-bold text-base-content/70">
                      You haven't connected with any peers yet
                    </p>
                    <Link
                      to="/friends"
                      onClick={onClose}
                      className="btn btn-primary btn-xs rounded-lg font-black uppercase tracking-wider text-[10px] px-3"
                    >
                      Find Peers
                    </Link>
                  </div>
                ) : filteredFriends.length === 0 ? (
                  <div className="p-6 text-center text-xs font-bold text-base-content/50">
                    No peers matching "{searchQuery}"
                  </div>
                ) : (
                  filteredFriends.map((friend) => {
                    const isSending = !!sendingMap[friend._id];
                    const isSent = !!sentMap[friend._id];

                    return (
                      <div
                        key={friend._id}
                        className="flex items-center justify-between gap-3 p-2.5 bg-base-200/40 hover:bg-base-200/80 rounded-2xl border border-base-content/5 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={friend.profilePic || "/avatar.png"}
                              alt={friend.fullName}
                              className="size-9 rounded-xl object-cover border border-base-content/10"
                            />
                            {friend.lastActive &&
                              new Date() - new Date(friend.lastActive) <= 5 * 60 * 1000 && (
                                <span className="size-2.5 rounded-full bg-emerald-500 ring-2 ring-base-100 absolute -bottom-0.5 -right-0.5" />
                              )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-base-content truncate">
                              {friend.fullName}
                            </h4>
                            <p className="text-[10px] text-base-content/50 font-medium truncate">
                              {friend.headline ||
                                (friend.learningLanguage
                                  ? `Learning ${friend.learningLanguage}`
                                  : "Anva Learner")}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSendToFriend(friend)}
                          disabled={isSending}
                          className={`btn btn-xs rounded-xl font-bold uppercase tracking-wider text-[10px] px-3.5 shrink-0 transition-all cursor-pointer ${
                            isSent
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : "btn-primary shadow-xs"
                          }`}
                        >
                          {isSending ? (
                            <span className="loading loading-spinner size-3" />
                          ) : isSent ? (
                            <>
                              <Check className="size-3" /> Sent
                            </>
                          ) : (
                            <>
                              <Send className="size-3" /> Send
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-base-content/10 bg-base-200/40 flex items-center justify-between text-xs">
            <span className="text-[11px] text-base-content/50 font-medium">
              💡 Messages are sent via Peers Chat
            </span>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-xs font-bold text-base-content/70 hover:text-base-content"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SharePostModal;
