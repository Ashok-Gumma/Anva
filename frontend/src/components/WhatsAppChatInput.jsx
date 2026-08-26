import { useState, useRef, useEffect } from "react";
import { Send, Plus, X, Image as ImageIcon, Smile, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const COMMON_EMOJIS = ["😊", "❤️", "🔥", "👍", "😂", "✨", "🙌", "🎉"];

export const WhatsAppChatInput = ({
  channel,
  replyingTo,
  onCancelReply,
  onSendMessage,
}) => {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-focus and adjust height on text change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${nextHeight}px`;
    }
  }, [text]);

  // Focus textarea when replyingTo changes
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isSending || !channel) return;

    setIsSending(true);
    try {
      const messagePayload = {
        text: trimmed,
      };

      if (replyingTo) {
        messagePayload.quoted_message_id = replyingTo.id;
      }

      if (onSendMessage) {
        await onSendMessage(messagePayload);
      } else {
        await channel.sendMessage(messagePayload);
      }

      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      if (onCancelReply) onCancelReply();
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !channel) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const toastId = toast.loading("Uploading image...");
    try {
      const response = await channel.sendImage(file);
      await channel.sendMessage({
        text: text.trim(),
        attachments: [
          {
            type: "image",
            image_url: response.file,
            asset_url: response.file,
            name: file.name,
          },
        ],
      });
      setText("");
      toast.success("Image sent!", { id: toastId });
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const insertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full bg-base-100/95 backdrop-blur-md border-t border-base-content/10 px-3 sm:px-6 py-2.5 z-30 shrink-0 select-none">
      {/* ── Quoted Reply Banner ── */}
      {replyingTo && (
        <div className="mb-2 p-2.5 rounded-2xl bg-base-200 border-l-4 border-primary flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200 shadow-xs">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-primary truncate">
              Replying to {replyingTo.user?.name || "Peer"}
            </p>
            <p className="text-xs text-base-content/75 truncate mt-0.5 font-medium">
              {replyingTo.text || "Attachment"}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            className="p-1 rounded-full hover:bg-base-content/10 text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
            title="Cancel reply"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ── Emoji Quick Bar (Pop-up) ── */}
      {showEmojiPicker && (
        <div className="mb-2 p-2 rounded-2xl bg-base-200 border border-base-content/10 flex items-center gap-2 overflow-x-auto animate-in slide-in-from-bottom-1 shadow-lg">
          {COMMON_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="size-8 hover:scale-125 active:scale-95 transition-transform flex items-center justify-center text-lg cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* ── Main Input Bar ── */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Attachment & Emoji Triggers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="size-9 rounded-full hover:bg-base-content/10 text-base-content/70 hover:text-base-content transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
            title="Attach image"
          >
            <Plus className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`size-9 rounded-full transition-all flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 ${
              showEmojiPicker
                ? "bg-primary/20 text-primary"
                : "hover:bg-base-content/10 text-base-content/70 hover:text-base-content"
            }`}
            title="Emoji"
          >
            <Smile className="size-5" />
          </button>
        </div>

        {/* Center Pill Textarea */}
        <div className="flex-1 min-w-0 bg-base-200/90 border border-base-content/10 rounded-3xl px-4 py-2 flex items-center shadow-xs focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent border-0 outline-none text-base-content placeholder:text-base-content/40 text-[14.5px] font-normal resize-none leading-relaxed max-h-32"
          />
        </div>

        {/* Right Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isSending}
          className={`size-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
            text.trim() && !isSending
              ? "bg-primary text-primary-content hover:opacity-90 shadow-md shadow-primary/25 hover:scale-105 active:scale-95"
              : "bg-base-200 text-base-content/30 cursor-not-allowed opacity-50"
          }`}
          title="Send message"
        >
          <Send className="size-4.5" />
        </button>
      </form>
    </div>
  );
};

export default WhatsAppChatInput;
