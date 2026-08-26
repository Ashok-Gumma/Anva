import { useState, useEffect, useRef } from "react";
import { ArrowDown, MessageSquare } from "lucide-react";
import WhatsAppMessage from "./WhatsAppMessage";
import WhatsAppChatInput from "./WhatsAppChatInput";

const getDateLabel = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

export const WhatsAppChatView = ({
  channel,
  chatClient,
  authUser,
  targetUser,
}) => {
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const scrollContainerRef = useRef(null);
  const bottomSentinelRef = useRef(null);

  // Sync messages from channel state
  useEffect(() => {
    if (!channel) return;

    const syncMessages = () => {
      setMessages([...channel.state.messages]);
    };

    syncMessages();

    const handleMessageNew = (event) => {
      syncMessages();
      // Scroll to bottom if we were already close to bottom or it's my message
      if (event.user?.id === authUser?._id) {
        setTimeout(scrollToBottom, 50);
      }
    };

    const handleMessageUpdated = () => syncMessages();
    const handleMessageDeleted = () => syncMessages();
    const handleReaction = () => syncMessages();

    channel.on("message.new", handleMessageNew);
    channel.on("message.updated", handleMessageUpdated);
    channel.on("message.deleted", handleMessageDeleted);
    channel.on("reaction.new", handleReaction);
    channel.on("reaction.deleted", handleReaction);

    return () => {
      channel.off("message.new", handleMessageNew);
      channel.off("message.updated", handleMessageUpdated);
      channel.off("message.deleted", handleMessageDeleted);
      channel.off("reaction.new", handleReaction);
      channel.off("reaction.deleted", handleReaction);
    };
  }, [channel, authUser]);

  // Initial scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [channel?.id]);

  const scrollToBottom = (behavior = "smooth") => {
    if (bottomSentinelRef.current) {
      bottomSentinelRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollBottom(isFarFromBottom);
  };

  const handleReact = async (messageId, reactionType) => {
    if (!channel) return;
    try {
      await channel.sendReaction(messageId, { type: reactionType });
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  const handleDelete = async (messageId) => {
    if (!chatClient) return;
    try {
      await chatClient.deleteMessage(messageId);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  // Group messages by date
  const groupedMessages = [];
  let currentDate = null;

  messages.forEach((msg) => {
    const msgDate = getDateLabel(msg.created_at);
    if (msgDate && msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ type: "date_divider", date: msgDate, id: `date-${msgDate}` });
    }
    groupedMessages.push({ type: "message", data: msg, id: msg.id });
  });

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-transparent">
      {/* ── Scrollable Message Feed with WhatsApp Wallpaper ── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto py-4 space-y-1.5 scroll-smooth relative"
      >
        {groupedMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-inner">
              <MessageSquare className="size-8 animate-bounce" />
            </div>
            <h4 className="font-black text-base text-base-content tracking-tight">
              Start the conversation
            </h4>
            <p className="text-xs text-base-content/60 max-w-xs mt-1 font-medium">
              Say hello to {targetUser?.fullName || "your peer"} and practice languages together!
            </p>
          </div>
        ) : (
          groupedMessages.map((item) => {
            if (item.type === "date_divider") {
              return (
                <div key={item.id} className="w-full flex justify-center my-3 select-none">
                  <span className="px-3.5 py-1 rounded-lg bg-white/90 dark:bg-[#182229]/90 backdrop-blur-md shadow-[0_1px_1px_rgba(11,20,26,0.08)] border border-black/5 dark:border-white/5 text-[11.5px] font-medium text-[#54656F] dark:text-[#8696A0] uppercase tracking-wider">
                    {item.date}
                  </span>
                </div>
              );
            }

            return (
              <WhatsAppMessage
                key={item.id}
                message={item.data}
                authUser={authUser}
                targetUser={targetUser}
                channel={channel}
                onReply={(msg) => setReplyingTo(msg)}
                onReact={handleReact}
                onDelete={handleDelete}
              />
            );
          })
        )}

        {/* Bottom Sentinel for Auto-Scrolling */}
        <div ref={bottomSentinelRef} className="h-1" />
      </div>

      {/* ── Floating Scroll-to-Bottom Button ── */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="absolute bottom-20 right-6 z-20 size-9 rounded-full bg-white dark:bg-[#202C33] text-[#54656F] dark:text-[#8696A0] border border-black/10 dark:border-white/10 shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Scroll to latest"
        >
          <ArrowDown className="size-4" />
        </button>
      )}

      {/* ── WhatsApp / Instagram Style Bottom Input Bar ── */}
      <WhatsAppChatInput
        channel={channel}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  );
};

export default WhatsAppChatView;
