import { Video, PhoneMissed, PhoneOff, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useCallContext } from "../context/CallContext";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";

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

const CallHistoryAttachment = ({ attachment, message, targetUser, channel }) => {
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
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // 1. Determine target peer to call
    let peerId = null;
    let peerName = "Peer";
    let peerPic = "";

    if (targetUser?._id) {
      peerId = targetUser._id;
      peerName = targetUser.fullName || targetUser.name || "Peer";
      peerPic = targetUser.profilePic || targetUser.image || "";
    } else if (message?.user?.id && message.user.id !== authUser?._id) {
      peerId = message.user.id;
      peerName = message.user.name || "Peer";
      peerPic = message.user.image || "";
    } else if (att.target_user_id && att.target_user_id !== authUser?._id) {
      peerId = att.target_user_id;
      peerName = att.target_user_name || "Peer";
    } else if (att.caller_id && att.caller_id !== authUser?._id) {
      peerId = att.caller_id;
      peerName = att.caller_name || "Peer";
    } else if (channel?.state?.members) {
      const memberIds = Object.keys(channel.state.members);
      peerId = memberIds.find((id) => id !== authUser?._id);
      if (peerId && channel.state.members[peerId]?.user) {
        const u = channel.state.members[peerId].user;
        peerName = u.name || peerName;
        peerPic = u.image || peerPic;
      }
    } else if (channel?.data?.members) {
      const memberIds = Object.keys(channel.data.members);
      peerId = memberIds.find((id) => id !== authUser?._id);
    } else if (message?.cid || message?.channel_id || channel?.id) {
      const rawCid = (message.cid || message.channel_id || channel?.id || "").replace("messaging:", "");
      const parts = rawCid.split("-");
      peerId = parts.find((id) => id && id !== authUser?._id);
    }

    if (!peerId && targetUser?._id) {
      peerId = targetUser._id;
    }

    const channelId = channel?.id || message?.channel_id || (peerId ? [authUser?._id, peerId].sort().join("-") : null);

    if (peerId) {
      initiateCall({
        targetUser: {
          _id: peerId,
          fullName: peerName,
          profilePic: peerPic,
        },
        channelId,
        channel,
      });
    } else {
      toast.error("Could not find peer to call.");
    }
  };

  // 1. MISSED CALL (Red Theme)
  if (callStatus === "missed") {
    return (
      <div className="w-full max-w-[280px] sm:max-w-[300px] rounded-2xl border border-error/20 bg-base-100 text-base-content shadow-sm p-2.5 sm:p-3 select-none backdrop-blur-md">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 sm:size-9 rounded-xl bg-error/10 border border-error/20 flex items-center justify-center text-error shrink-0">
              <PhoneMissed className="size-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-error truncate flex items-center gap-1">
                <span>{isCaller ? "No Answer" : "Missed Video Call"}</span>
                {isCaller ? (
                  <ArrowUpRight className="size-3 text-error" />
                ) : (
                  <ArrowDownLeft className="size-3 text-error" />
                )}
              </h4>
              <p className="text-[11px] text-base-content/60 font-medium truncate">
                {timeStr ? `${timeStr}` : "Missed"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCallBack}
            className="px-2.5 py-1.5 bg-error/10 hover:bg-error text-error hover:text-white border border-error/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 shadow-2xs"
            title="Call back"
          >
            <Video className="size-3.5" />
            <span>Call</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. DECLINED CALL (Amber Theme)
  if (callStatus === "declined") {
    return (
      <div className="w-full max-w-[280px] sm:max-w-[300px] rounded-2xl border border-warning/20 bg-base-100 text-base-content shadow-sm p-2.5 sm:p-3 select-none backdrop-blur-md">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 sm:size-9 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
              <PhoneOff className="size-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-warning truncate flex items-center gap-1">
                <span>{isCaller ? "Call Declined" : "Declined Call"}</span>
                {isCaller ? (
                  <ArrowUpRight className="size-3 text-warning" />
                ) : (
                  <ArrowDownLeft className="size-3 text-warning" />
                )}
              </h4>
              <p className="text-[11px] text-base-content/60 font-medium truncate">
                {timeStr ? `${timeStr}` : "Unavailable"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCallBack}
            className="px-2.5 py-1.5 bg-warning/10 hover:bg-warning text-warning hover:text-white border border-warning/20 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 shadow-2xs"
            title="Call back"
          >
            <Video className="size-3.5" />
            <span>Call</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. COMPLETED / VIDEO CALL LOG (Theme Aligned)
  return (
    <div className="w-full max-w-[280px] sm:max-w-[300px] rounded-2xl border border-base-content/10 bg-base-100 text-base-content shadow-sm p-2.5 sm:p-3 select-none backdrop-blur-md">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 sm:size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Video className="size-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-base-content truncate flex items-center gap-1">
              <span>Video Call</span>
              {isCaller ? (
                <ArrowUpRight className="size-3 text-primary" />
              ) : (
                <ArrowDownLeft className="size-3 text-primary" />
              )}
            </h4>
            <p className="text-[11px] text-base-content/60 font-medium truncate">
              {durationText ? `Ended • ${durationText}` : timeStr ? `Ended • ${timeStr}` : "Ended"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCallBack}
          className="px-2.5 py-1.5 bg-primary hover:opacity-90 text-primary-content rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95 shadow-xs"
          title="Call again"
        >
          <Video className="size-3.5" />
          <span>Call</span>
        </button>
      </div>
    </div>
  );
};

export default CallHistoryAttachment;
