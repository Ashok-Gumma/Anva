import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Video, PhoneOff, Phone, Volume2, User } from "lucide-react";
import { useCallContext } from "../context/CallContext";

const IncomingCallModal = () => {
  const { incomingCall, acceptIncomingCall, declineIncomingCall } = useCallContext();
  const [secondsRemaining, setSecondsRemaining] = useState(35);
  const navigate = useNavigate();

  useEffect(() => {
    if (!incomingCall) {
      setSecondsRemaining(35);
      return;
    }

    setSecondsRemaining(35);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingCall]);

  if (!incomingCall) return null;

  const callerName = incomingCall.caller?.fullName || "A Peer";
  const callerPic = incomingCall.caller?.profilePic;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
        {/* Animated Background Ambience */}
        <div className="absolute inset-0 bg-radial from-emerald-950/20 via-transparent to-black pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className="relative w-full max-w-md bg-zinc-950/95 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center backdrop-blur-2xl"
        >
          {/* Top Live Calling Badge */}
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-black uppercase tracking-wider mb-6">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
            </span>
            <Volume2 className="size-3.5 animate-bounce" />
            <span>Incoming Video Call</span>
          </div>

          {/* Caller Avatar with WhatsApp-Style Radar Pulsing Waves */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Ripple Pulse Rings */}
            <div className="absolute -inset-4 rounded-full bg-emerald-500/10 animate-ping opacity-75" />
            <div className="absolute -inset-8 rounded-full bg-emerald-500/5 animate-pulse" />

            <div className="relative size-28 sm:size-32 rounded-full overflow-hidden border-4 border-emerald-500/60 shadow-2xl bg-zinc-900 flex items-center justify-center z-10">
              {callerPic ? (
                <img
                  src={callerPic}
                  alt={callerName}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-16 text-zinc-500" />
              )}
            </div>
          </div>

          {/* Caller Name and Title */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
            {callerName}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium mb-6 flex items-center gap-1.5 justify-center">
            <Video className="size-4 text-emerald-400" />
            <span>Inviting you to a live 1-on-1 collaborative video call...</span>
          </p>

          {/* Countdown Indicator */}
          <div className="w-full bg-zinc-900/80 rounded-full h-1.5 mb-6 overflow-hidden border border-zinc-800">
            <motion.div
              className="bg-emerald-500 h-full rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: `${(secondsRemaining / 35) * 100}%` }}
              transition={{ ease: "linear", duration: 1 }}
            />
          </div>

          {/* Action Buttons: Decline (Red) & Accept (Green) */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Decline Button */}
            <button
              type="button"
              onClick={declineIncomingCall}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3.5 px-4 bg-red-600/90 hover:bg-red-600 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg border border-red-500/40 transition-all cursor-pointer group"
            >
              <div className="size-9 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <PhoneOff className="size-5 text-white" />
              </div>
              <span>Decline</span>
            </button>

            {/* Accept Button */}
            <button
              type="button"
              onClick={() => acceptIncomingCall(navigate)}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 border border-emerald-400 transition-all cursor-pointer group"
            >
              <div className="size-9 rounded-xl bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="size-5 text-black" />
              </div>
              <span>Accept & Join</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default IncomingCallModal;
