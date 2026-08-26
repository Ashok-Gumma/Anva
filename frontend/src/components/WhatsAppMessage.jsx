import { useState } from "react";
import { 
  Check, 
  CheckCheck, 
  Reply, 
  Copy, 
  Trash2, 
  Ban, 
  Smile, 
  Heart, 
  Flame, 
  ThumbsUp, 
  Laugh 
} from "lucide-react";
import toast from "react-hot-toast";
import PostAttachment from "./PostAttachment";
import CallHistoryAttachment from "./CallHistoryAttachment";

const formatTime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const QUICK_REACTIONS = [
  { emoji: "❤️", type: "love" },
  { emoji: "😂", type: "laugh" },
  { emoji: "🔥", type: "fire" },
  { emoji: "👍", type: "like" },
  { emoji: "😮", type: "wow" },
];

export const WhatsAppMessage = ({
  message,
  isMyMessage: isMyMessageProp,
  authUser,
  targetUser,
  channel,
  onReply,
  onReact,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  if (!message) return null;

  const isMe =
    typeof isMyMessageProp === "function"
      ? isMyMessageProp()
      : message.user?.id === authUser?._id;

  const isDeleted =
    message.type === "deleted" || Boolean(message.deleted_at);

  // Handle Call System Attachments
  const callAttachment = message.attachments?.find(
    (att) => att.type === "call_history"
  );
  const isCall =
    Boolean(callAttachment) ||
    (message.text &&
      (message.text.includes("/call/") ||
        message.text.includes("Video Call") ||
        message.text.includes("video call") ||
        message.text.includes("Missed Video") ||
        message.text.includes("Declined Video")));

  if (isCall) {
    const attachment = callAttachment || {
      type: "call_history",
      call_status: message.text?.toLowerCase().includes("missed")
        ? "missed"
        : message.text?.toLowerCase().includes("declined")
        ? "declined"
        : "ended",
      call_id: message.channel_id || channel?.id,
      timestamp: message.created_at,
    };

    return (
      <div className="w-full flex justify-center my-2 px-2 select-none">
        <CallHistoryAttachment
          attachment={attachment}
          message={message}
          targetUser={targetUser}
          channel={channel}
        />
      </div>
    );
  }

  const postAttachment = message.attachments?.find((att) => att.type === "post");
  const mediaAttachments = message.attachments?.filter(
    (att) => att.type === "image" || att.image_url || att.asset_url
  );

  const formattedTime = formatTime(message.created_at);

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      toast.success("Message copied!");
    }
  };

  // Reactions summary calculation
  const reactionCounts = message.reaction_counts || {};
  const hasReactions = Object.keys(reactionCounts).length > 0;

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`group w-full flex items-end gap-2 my-1 px-3 sm:px-6 relative transition-all duration-150 ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      {/* Left Avatar for Received Messages */}
      {!isMe && (
        <div className="size-7 sm:size-8 rounded-full bg-primary/20 text-primary border border-base-content/10 shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs select-none mb-0.5 shadow-2xs">
          {message.user?.image ? (
            <img
              src={message.user.image}
              alt={message.user.name || "Peer"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{message.user?.name?.charAt(0)?.toUpperCase() || "P"}</span>
          )}
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`relative max-w-[85%] sm:max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        
        {/* Floating Quick Action Bar (Theme Adaptive) */}
        {showActions && !isDeleted && (
          <div
            className={`absolute -top-9 z-30 flex items-center gap-1 bg-base-100/95 backdrop-blur-md border border-base-content/15 shadow-xl rounded-full px-2 py-1 animate-in fade-in zoom-in-90 duration-150 ${
              isMe ? "right-1" : "left-1"
            }`}
          >
            {/* Quick Reactions */}
            <div className="flex items-center gap-0.5 pr-1 border-r border-base-content/10">
              {QUICK_REACTIONS.map((r) => (
                <button
                  key={r.type}
                  type="button"
                  onClick={() => onReact && onReact(message.id, r.type)}
                  className="size-6 hover:scale-125 active:scale-95 transition-transform flex items-center justify-center text-sm cursor-pointer"
                  title={`React ${r.emoji}`}
                >
                  {r.emoji}
                </button>
              ))}
            </div>

            {/* Reply Button */}
            <button
              type="button"
              onClick={() => onReply && onReply(message)}
              className="p-1 rounded-full hover:bg-base-content/10 text-base-content/70 hover:text-base-content transition-colors cursor-pointer"
              title="Reply"
            >
              <Reply className="size-3.5" />
            </button>

            {/* Copy Button */}
            {message.text && (
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-full hover:bg-base-content/10 text-base-content/70 hover:text-base-content transition-colors cursor-pointer"
                title="Copy text"
              >
                <Copy className="size-3.5" />
              </button>
            )}

            {/* Delete Button (Own Message Only) */}
            {isMe && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(message.id)}
                className="p-1 rounded-full hover:bg-error/20 text-base-content/70 hover:text-error transition-colors cursor-pointer"
                title="Delete message"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* The Visual Bubble - 100% Theme Aligned */}
        <div
          className={`relative px-3.5 py-2 sm:px-4 sm:py-2.5 transition-all shadow-sm ${
            isMe
              ? "bg-primary text-primary-content rounded-2xl rounded-tr-xs shadow-primary/20 border border-primary/20"
              : "bg-base-100 text-base-content border border-base-content/10 rounded-2xl rounded-tl-xs"
          }`}
        >
          {/* Quoted Message Card (if this is a reply) */}
          {message.quoted_message && (
            <div
              className={`mb-2 p-2 rounded-r-xl border-l-4 text-xs select-none ${
                isMe
                  ? "bg-primary-content/10 border-primary-content text-primary-content"
                  : "bg-base-200 border-primary text-base-content"
              }`}
            >
              <p className={`font-bold text-[11px] truncate ${isMe ? "text-primary-content" : "text-primary"}`}>
                {message.quoted_message.user?.name || "Peer"}
              </p>
              <p className="opacity-80 line-clamp-2 mt-0.5 text-[11px] font-medium">
                {message.quoted_message.text || "Attachment"}
              </p>
            </div>
          )}

          {/* Shared Post Attachment */}
          {postAttachment && <PostAttachment attachment={postAttachment} />}

          {/* Media Images */}
          {mediaAttachments && mediaAttachments.length > 0 && (
            <div className="flex flex-col gap-1.5 my-1 rounded-xl overflow-hidden">
              {mediaAttachments.map((m, idx) => (
                <img
                  key={idx}
                  src={m.image_url || m.asset_url || m.thumb_url}
                  alt="Attachment"
                  className="rounded-xl max-h-60 object-cover w-full cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => window.open(m.asset_url || m.image_url, "_blank")}
                />
              ))}
            </div>
          )}

          {/* Message Text Content */}
          {isDeleted ? (
            <div className={`flex items-center gap-1.5 text-xs italic py-0.5 select-none ${isMe ? "text-primary-content/75" : "text-base-content/60"}`}>
              <Ban className="size-3.5" />
              <span>This message was deleted</span>
            </div>
          ) : (
            message.text && (
              <p className="text-[14px] leading-relaxed font-normal whitespace-pre-wrap break-words">
                {message.text}
              </p>
            )
          )}

          {/* Bottom Timestamp & Delivery Status */}
          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none font-mono ${isMe ? "text-primary-content/75" : "text-base-content/60"}`}>
            <span>{formattedTime}</span>
            {isMe && !isDeleted && (
              <span title="Read">
                <CheckCheck className="size-3.5 text-primary-content opacity-90" />
              </span>
            )}
          </div>
        </div>

        {/* Emoji Reactions Badge */}
        {hasReactions && !isDeleted && (
          <div
            className={`flex items-center gap-1 -mt-2 z-10 px-2 py-0.5 rounded-full bg-base-100 border border-base-content/15 shadow-md text-xs select-none ${
              isMe ? "mr-1.5" : "ml-1.5"
            }`}
          >
            {Object.entries(reactionCounts).map(([type, count]) => {
              const reactionObj = QUICK_REACTIONS.find((r) => r.type === type);
              return (
                <span key={type} className="flex items-center gap-0.5 text-[11px] font-medium text-base-content">
                  <span>{reactionObj ? reactionObj.emoji : "👍"}</span>
                  {count > 1 && <span className="text-[10px] text-base-content/70 font-bold">{count}</span>}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppMessage;
