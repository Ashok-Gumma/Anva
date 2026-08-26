import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { StreamChat } from "stream-chat";
import { callSounds } from "../lib/callSounds";
import { openVideoCallPopup } from "../lib/callWindow";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const [incomingCall, setIncomingCall] = useState(null);
  const [streamClient, setStreamClient] = useState(null);

  const timeoutTimerRef = useRef(null);
  const broadcastChannelRef = useRef(null);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Setup BroadcastChannel for zero-latency communication across local browser tabs & popup windows
  useEffect(() => {
    try {
      const bc = new BroadcastChannel("anva_call_signaling");
      broadcastChannelRef.current = bc;

      bc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (!type) return;

        switch (type) {
          case "INCOMING_CALL": {
            if (payload?.targetUserId === authUser?._id) {
              triggerIncomingCall(payload);
            }
            break;
          }
          case "CALL_ACCEPTED": {
            if (incomingCall && (!payload?.callId || incomingCall.callId === payload.callId)) {
              callSounds.stopAll();
              setIncomingCall(null);
            }
            break;
          }
          case "CALL_REJECTED":
          case "CALL_CANCELLED":
          case "CALL_TIMEOUT":
          case "CALL_ENDED": {
            if (incomingCall && (!payload?.callId || incomingCall.callId === payload.callId)) {
              callSounds.stopAll();
              setIncomingCall(null);
              if (type === "CALL_CANCELLED") {
                toast("Call was cancelled by the caller.", { icon: "📞" });
              }
            }
            break;
          }
          default:
            break;
        }
      };

      return () => {
        bc.close();
      };
    } catch (err) {
      console.warn("BroadcastChannel error:", err);
    }
  }, [authUser, incomingCall]);

  // Connect StreamChat client globally to listen for call events & messages anywhere in the app
  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    let isMounted = true;
    const client = StreamChat.getInstance(STREAM_API_KEY);

    const initStream = async () => {
      try {
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

        if (isMounted) {
          setStreamClient(client);
        }

        // Global custom event listener
        const handleCustomEvent = (event) => {
          if (!isMounted) return;
          const { type: eventType, callId, caller, targetUserId } = event;

          if (
            (eventType === "call_incoming" || eventType === "call.incoming") &&
            (!targetUserId || String(targetUserId) === String(authUser._id))
          ) {
            triggerIncomingCall({
              callId: callId || event.channel_id,
              channelId: event.channel_id || callId,
              caller: caller || {
                _id: event.user?.id,
                fullName: event.user?.name || "Peer",
                profilePic: event.user?.image || "",
              },
              targetUserId: authUser._id,
              timestamp: Date.now(),
            });
          } else if (
            (eventType === "call_cancelled" ||
              eventType === "call_ended" ||
              eventType === "call.cancelled" ||
              eventType === "call.ended") &&
            (!targetUserId || String(targetUserId) === String(authUser._id))
          ) {
            callSounds.stopAll();
            setIncomingCall(null);
            if (eventType === "call_cancelled" || eventType === "call.cancelled") {
              toast("Call cancelled by peer.", { icon: "📞" });
            }
          } else if (
            eventType === "call_accepted" ||
            eventType === "call_rejected" ||
            eventType === "call_timeout" ||
            eventType === "call.accepted" ||
            eventType === "call.rejected" ||
            eventType === "call.timeout"
          ) {
            if (incomingCall && (!callId || incomingCall.callId === callId)) {
              callSounds.stopAll();
              setIncomingCall(null);
            }
          }
        };

        // Global message event listener (catches calls even across un-watched channels)
        const handleMessageEvent = (event) => {
          if (!isMounted) return;
          const msg = event.message;
          if (!msg || !msg.user || msg.user.id === authUser._id) return;

          const custom = msg.custom || {};
          const isIncomingCall =
            custom.type === "call_incoming" ||
            msg.attachments?.some(
              (att) => att.type === "call_history" && att.call_status === "started"
            ) ||
            (msg.text && (msg.text.includes("📹 Video Call") || msg.text.includes("started a video call")));

          if (isIncomingCall) {
            if (custom.targetUserId && String(custom.targetUserId) !== String(authUser._id)) {
              return;
            }

            const channelId =
              event.channel?.id ||
              event.channel_id ||
              custom.channelId ||
              custom.callId ||
              [authUser._id, msg.user.id].sort().join("-");
            const callId = custom.callId || channelId;

            triggerIncomingCall({
              callId,
              channelId,
              caller: custom.caller || {
                _id: msg.user.id,
                fullName: msg.user.name || "Peer",
                profilePic: msg.user.image || "",
              },
              targetUserId: authUser._id,
              timestamp: Date.now(),
            });
          } else if (custom.type === "call_accepted") {
            broadcastChannelRef.current?.postMessage({
              type: "CALL_ACCEPTED",
              payload: { callId: custom.callId },
            });
            if (incomingCall && (!custom.callId || incomingCall.callId === custom.callId)) {
              callSounds.stopAll();
              setIncomingCall(null);
            }
          } else if (
            custom.type === "call_rejected" ||
            msg.attachments?.some((att) => att.type === "call_history" && att.call_status === "declined")
          ) {
            broadcastChannelRef.current?.postMessage({
              type: "CALL_REJECTED",
              payload: { callId: custom.callId, reason: custom.reason || "declined" },
            });
            if (incomingCall && (!custom.callId || incomingCall.callId === custom.callId)) {
              callSounds.stopAll();
              setIncomingCall(null);
            }
          } else if (
            custom.type === "call_cancelled" ||
            custom.type === "call_timeout" ||
            custom.type === "call_ended" ||
            msg.attachments?.some(
              (att) => att.type === "call_history" && (att.call_status === "missed" || att.call_status === "ended")
            )
          ) {
            broadcastChannelRef.current?.postMessage({
              type: custom.type === "call_cancelled" ? "CALL_CANCELLED" : "CALL_ENDED",
              payload: { callId: custom.callId },
            });
            if (incomingCall && (!custom.callId || incomingCall.callId === custom.callId)) {
              callSounds.stopAll();
              setIncomingCall(null);
              if (custom.type === "call_cancelled") {
                toast("Call cancelled by peer.", { icon: "📞" });
              }
            }
          }
        };

        client.on("custom", handleCustomEvent);
        client.on("call_incoming", handleCustomEvent);
        client.on("call_cancelled", handleCustomEvent);
        client.on("call_accepted", handleCustomEvent);
        client.on("call_rejected", handleCustomEvent);
        client.on("call_timeout", handleCustomEvent);
        client.on("call_ended", handleCustomEvent);
        client.on("message.new", handleMessageEvent);
        client.on("notification.message_new", handleMessageEvent);

        return () => {
          client.off("custom", handleCustomEvent);
          client.off("call_incoming", handleCustomEvent);
          client.off("call_cancelled", handleCustomEvent);
          client.off("call_accepted", handleCustomEvent);
          client.off("call_rejected", handleCustomEvent);
          client.off("call_timeout", handleCustomEvent);
          client.off("call_ended", handleCustomEvent);
          client.off("message.new", handleMessageEvent);
          client.off("notification.message_new", handleMessageEvent);
        };
      } catch (err) {
        console.error("Stream call signaling listener init error:", err);
      }
    };

    initStream();

    return () => {
      isMounted = false;
    };
  }, [tokenData, authUser, incomingCall]);

  /**
   * Triggers the incoming call UI & plays the melodic incoming ringtone
   */
  const triggerIncomingCall = useCallback(
    (callData) => {
      if (incomingCall && incomingCall.callId === callData.callId) return;

      setIncomingCall(callData);
      callSounds.playIncomingRingtone();

      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }

      // Auto-timeout after 35 seconds (Callee does not pick up / not lifting)
      timeoutTimerRef.current = setTimeout(() => {
        callSounds.stopAll();
        setIncomingCall(null);
        toast(`Missed video call from ${callData.caller?.fullName || "a peer"}`, {
          icon: "📵",
          duration: 5000,
        });

        // Broadcast timeout to other tabs/popups and via Stream
        broadcastChannelRef.current?.postMessage({
          type: "CALL_TIMEOUT",
          payload: { callId: callData.callId, callerId: callData.caller?._id },
        });

        const client = streamClient || StreamChat.getInstance(STREAM_API_KEY);
        if (client) {
          const channelId = callData.channelId || callData.callId;
          const channel = client.channel("messaging", channelId);
          channel
            .sendEvent({
              type: "call_timeout",
              callId: callData.callId,
              targetUserId: callData.caller?._id,
            })
            .catch(() => {});

          channel
            .sendMessage({
              text: "📵 Missed Video Call",
              attachments: [
                {
                  type: "call_history",
                  call_type: "video",
                  call_status: "missed",
                  call_id: callData.callId,
                  caller_id: callData.caller?._id,
                  caller_name: callData.caller?.fullName,
                  timestamp: Date.now(),
                },
              ],
              custom: {
                type: "call_timeout",
                callId: callData.callId,
              },
            })
            .catch(() => {});
        }
      }, 35000);
    },
    [incomingCall, streamClient]
  );

const createSafeCallUrl = (channelId, { isCaller = false, isCallee = false, peerId = "", peerName = "", peerPic = "" }) => {
  // Store rich peer information into sessionStorage so CallPage can retrieve full profile image even if it's base64
  try {
    sessionStorage.setItem(
      `anva_call_peer_${channelId}`,
      JSON.stringify({
        peerId,
        peerName: peerName || "Peer",
        peerPic: peerPic || "",
      })
    );
  } catch (err) {
    console.warn("Could not cache call peer info in sessionStorage:", err);
  }

  const params = new URLSearchParams();
  if (isCaller) params.set("isCaller", "true");
  if (isCallee) params.set("isCallee", "true");
  if (peerId) params.set("peerId", peerId);
  if (peerName) params.set("peerName", peerName);

  // ONLY attach peerPic to URL if it's a short URL string (< 500 chars) and NOT a raw data URI
  if (peerPic && typeof peerPic === "string" && !peerPic.startsWith("data:") && peerPic.length < 500) {
    params.set("peerPic", peerPic);
  }

  return `/call/${channelId}?${params.toString()}`;
};

  /**
   * Callee accepts the call: stops ringtone, opens call window synchronously, and notifies caller
   */
  const acceptIncomingCall = useCallback(
    (navigateFallback) => {
      if (!incomingCall) return;

      if (timeoutTimerRef.current) {
        clearTimeout(timeoutTimerRef.current);
      }
      callSounds.stopAll();

      const currentCall = { ...incomingCall };
      setIncomingCall(null);

      // 1. Synchronously open video call popup window in Callee mode
      const callUrl = createSafeCallUrl(currentCall.callId, {
        isCallee: true,
        peerId: currentCall.caller?._id || "",
        peerName: currentCall.caller?.fullName || "",
        peerPic: currentCall.caller?.profilePic || "",
      });
      const popup = openVideoCallPopup(callUrl);
      if (!popup) {
        // If browser popup blocker blocked it, use navigation fallback
        if (navigateFallback) {
          navigateFallback(`/call/${currentCall.callId}?isCallee=true`);
        } else {
          window.location.href = callUrl;
        }
      }

      // 2. Notify caller via BroadcastChannel
      broadcastChannelRef.current?.postMessage({
        type: "CALL_ACCEPTED",
        payload: { callId: currentCall.callId },
      });

      // 3. Notify caller via StreamChat event
      const client = streamClient || StreamChat.getInstance(STREAM_API_KEY);
      if (client) {
        const channelId = currentCall.channelId || currentCall.callId;
        const channel = client.channel("messaging", channelId);

        channel
          .sendEvent({
            type: "call_accepted",
            callId: currentCall.callId,
            acceptedBy: authUser?._id,
          })
          .catch(() => {});
      }
    },
    [incomingCall, streamClient, authUser]
  );

  /**
   * Callee declines the call: stops ringtone, sends rejection signal to caller
   */
  const declineIncomingCall = useCallback(async () => {
    if (!incomingCall) return;

    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
    }
    callSounds.stopAll();

    const currentCall = { ...incomingCall };
    setIncomingCall(null);

    // Notify caller via BroadcastChannel
    broadcastChannelRef.current?.postMessage({
      type: "CALL_REJECTED",
      payload: { callId: currentCall.callId, reason: "declined" },
    });

    // Notify caller via StreamChat event & message
    const client = streamClient || StreamChat.getInstance(STREAM_API_KEY);
    if (client) {
      const channelId = currentCall.channelId || currentCall.callId;
      const channel = client.channel("messaging", channelId);

      channel
        .sendEvent({
          type: "call_rejected",
          callId: currentCall.callId,
          reason: "declined",
          rejectedBy: authUser?._id,
        })
        .catch(() => {});

      channel
        .sendMessage({
          text: "🔴 Declined Video Call",
          attachments: [
            {
              type: "call_history",
              call_type: "video",
              call_status: "declined",
              call_id: currentCall.callId,
              caller_id: currentCall.caller?._id,
              caller_name: currentCall.caller?.fullName,
              timestamp: Date.now(),
            },
          ],
          custom: {
            type: "call_rejected",
            callId: currentCall.callId,
            reason: "declined",
            rejectedBy: authUser?._id,
          },
        })
        .catch(() => {});
    }
  }, [incomingCall, streamClient, authUser]);

  /**
   * Initiates an outgoing call to a target user:
   * Opens dedicated call window synchronously and sends signaling events across all channels
   */
  const initiateCall = useCallback(
    ({ targetUser, channelId: providedChannelId, channel: existingChannel, navigateFallback }) => {
      if (!authUser || !targetUser) return;

      const channelId =
        providedChannelId ||
        [authUser._id, targetUser._id].sort().join("-");

      const payload = {
        callId: channelId,
        channelId,
        caller: {
          _id: authUser._id,
          fullName: authUser.fullName,
          profilePic: authUser.profilePic || "",
        },
        targetUserId: targetUser._id,
        timestamp: Date.now(),
      };

      // 1. Synchronously open dedicated call window in Caller mode
      const callPopupUrl = createSafeCallUrl(channelId, {
        isCaller: true,
        peerId: targetUser._id,
        peerName: targetUser.fullName || "",
        peerPic: targetUser.profilePic || "",
      });
      const popup = openVideoCallPopup(callPopupUrl);
      if (!popup) {
        if (navigateFallback) {
          navigateFallback(callPopupUrl);
        } else {
          window.location.href = callPopupUrl;
        }
      }

      // 2. Broadcast across local browser contexts
      broadcastChannelRef.current?.postMessage({
        type: "INCOMING_CALL",
        payload,
      });

      // 3. Send real-time Stream custom event & chat message with call history attachment
      const client = streamClient || StreamChat.getInstance(STREAM_API_KEY);
      if (client || existingChannel) {
        try {
          const ch =
            existingChannel ||
            client.channel("messaging", channelId, {
              members: [authUser._id, targetUser._id],
            });

          const sendSignal = async () => {
            try {
              await ch.create().catch(() => {});
              await ch.watch().catch(() => {});
              await ch.sendEvent({
                type: "call_incoming",
                ...payload,
              });
              await ch.sendMessage({
                text: "📹 Video Call",
                attachments: [
                  {
                    type: "call_history",
                    call_type: "video",
                    call_status: "started",
                    call_id: channelId,
                    caller_id: authUser._id,
                    caller_name: authUser.fullName,
                    timestamp: Date.now(),
                  },
                ],
                custom: {
                  type: "call_incoming",
                  ...payload,
                },
              });
            } catch (err) {
              console.error("Error broadcasting call signal:", err);
            }
          };

          sendSignal();
        } catch (err) {
          console.error("Error setting up stream channel call signal:", err);
        }
      }
    },
    [authUser, streamClient]
  );

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        initiateCall,
        acceptIncomingCall,
        declineIncomingCall,
        streamClient,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCallContext must be used within a CallProvider");
  }
  return context;
};

export default CallContext;
