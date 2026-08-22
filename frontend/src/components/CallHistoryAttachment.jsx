import { Video, PhoneMissed, PhoneOff, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useCallContext } from "../context/CallContext";
import useAuthUser from "../hooks/useAuthUser";

const formatCallDuration = (seconds) => {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
};

const CallHistoryAttachment = ({ attachment, message }) => {
  const { initiateCall } = useCallContext();
  const { authUser } = useAuthUser();

  if (!attachment && !message) return null;

  const att = attachment || {};
  const callStatus = att.call_status || "ended"; // "started" | "accepted" | "declined" | "missed" | "ended"
  const isCaller = att.caller_id
    ? att.caller_id === authUser?._id
    : message?.user?.id === authUser?._id;
  const durationText = formatCallDuration(att.duration);
  const timeStr = formatTime(att.timestamp || message?.created_at);

  const handleCallBack = (e) => {
    e.stopPropagation();

    // Determine the target peer to call
    let peerId = null;
    let peerName = "Peer";
    let peerPic = "";

    if (message?.user?.id && message.user.id !== authUser?._id) {
      peerId = message.user.id;
      peerName = message.user.name || "Peer";
      peerPic = message.user.image || "";
    } else if (att.target_user_id && att.target_user_id !== authUser?._id) {
      peerId = att.target_user_id;
      peerName = att.target_user_name || "Peer";
    } else if (message?.channel_id) {
      const parts = message.channel_id.split("-");
      peerId = parts.find((id) => id !== authUser?._id);
    }

    if (peerId) {
      initiateCall({
        targetUser: {
          _id: peerId,
          fullName: peerName,
          profilePic: peerPic,
        },
        channelId: message?.channel_id,
      });
    }
  };

  // 1. MISSED CALL (Red Theme)
  if (callStatus === "missed") {
    return (
      <div className="w-full max-w-[290px] sm:max-w-[310px] rounded-2xl border border-red-500/30 bg-zinc-900/95 text-white shadow-lg p-3 select-none backdrop-blur-md">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <PhoneMissed className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-red-400 truncate flex items-center gap-1">
                <span>{isCaller ? "No Answer" : "Missed Video Call"}</span>
                {isCaller ? (
                  <ArrowUpRight className="size-3 text-red-400" />
                ) : (
                  <ArrowDownLeft className="size-3 text-red-400" />
                )}
              </h4>
              <p className="text-[11px] text-zinc-400 font-medium truncate">
                {timeStr ? `${timeStr}` : "Missed"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCallBack}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 shadow-sm"
            title="Call back"
          >
            <Video className="size-3.5" />
            <span>Call Back</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. DECLINED CALL (Amber Theme)
  if (callStatus === "declined") {
    return (
      <div className="w-full max-w-[290px] sm:max-w-[310px] rounded-2xl border border-amber-500/30 bg-zinc-900/95 text-white shadow-lg p-3 select-none backdrop-blur-md">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <PhoneOff className="size-4.5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-amber-400 truncate flex items-center gap-1">
                <span>{isCaller ? "Call Declined" : "Declined Call"}</span>
                {isCaller ? (
                  <ArrowUpRight className="size-3 text-amber-400" />
                ) : (
                  <ArrowDownLeft className="size-3 text-amber-400" />
                )}
              </h4>
              <p className="text-[11px] text-zinc-400 font-medium truncate">
                {timeStr ? `${timeStr}` : "Unavailable"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCallBack}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 shadow-sm"
            title="Call back"
          >
            <Video className="size-3.5" />
            <span>Call Back</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. COMPLETED / VIDEO CALL LOG (WhatsApp Signature Dark Pill with Emerald Accent)
  return (
    <div className="w-full max-w-[290px] sm:max-w-[310px] rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-xl p-3 select-none backdrop-blur-md">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Video className="size-4.5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-zinc-100 truncate flex items-center gap-1">
              <span>Video call</span>
              {isCaller ? (
                <ArrowUpRight className="size-3.5 text-emerald-400" title="Outgoing call" />
              ) : (
                <ArrowDownLeft className="size-3.5 text-emerald-400" title="Incoming call" />
              )}
            </h4>
            <p className="text-[11px] text-zinc-400 font-medium truncate flex items-center gap-1">
              {durationText ? <span>{durationText}</span> : <span>Ended</span>}
              {timeStr && <span>• {timeStr}</span>}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCallBack}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95"
          title="Start video call"
        >
          <Video className="size-3.5 fill-black" />
          <span>Call</span>
        </button>
      </div>
    </div>
  );
};

export default CallHistoryAttachment;
