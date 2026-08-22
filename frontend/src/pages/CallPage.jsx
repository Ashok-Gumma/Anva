import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, executeCompilerCode } from "../lib/api";
import Editor from "@monaco-editor/react";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { callSounds } from "../lib/callSounds";
import {
  Code,
  Edit3,
  FileText,
  Play,
  Copy,
  RotateCcw,
  Trash2,
  Download,
  X,
  Maximize2,
  Minimize2,
  Clock,
  Layout,
  Columns,
  Square,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Terminal,
  LogIn,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  PhoneMissed,
  Laptop,
  ChevronsLeftRight,
  Radio,
  Users,
  User,
  Volume2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CODE_LANGUAGES = {
  javascript: {
    label: "JavaScript (Node.js)",
    version: "18.15.0",
    monacoLang: "javascript",
    defaultCode: `// 🚀 Live Collaborative Code Session\nfunction solveProblem(input) {\n  console.log("Input received:", input);\n  return \`Solved with input: \${input}\`;\n}\n\nconsole.log(solveProblem("Anva Pair Programming"));`,
  },
  python: {
    label: "Python 3",
    version: "3.10.0",
    monacoLang: "python",
    defaultCode: `# 🚀 Live Collaborative Code Session\ndef solve_problem(input_val):\n    print(f"Input received: {input_val}")\n    return f"Solved with: {input_val}"\n\nprint(solve_problem("Anva Pair Programming"))`,
  },
  typescript: {
    label: "TypeScript",
    version: "5.0.3",
    monacoLang: "typescript",
    defaultCode: `// 🚀 Live Collaborative Code Session\ninterface PeerSession {\n  room: string;\n  status: string;\n}\n\nconst session: PeerSession = {\n  room: "Live Study Room",\n  status: "Active"\n};\n\nconsole.log("Session:", session);`,
  },
  cpp: {
    label: "C++ (GCC)",
    version: "10.2.0",
    monacoLang: "cpp",
    defaultCode: `#include <iostream>\n#include <vector>\n#include <string>\n\nint main() {\n    std::cout << "🚀 Hello from Anva Collaborative Call Session!\\n";\n    std::vector<std::string> topics = {"Data Structures", "Algorithms", "Speaking"};\n    for (const auto& t : topics) {\n        std::cout << "• " << t << "\\n";\n    }\n    return 0;\n}`,
  },
  c: {
    label: "C (GCC)",
    version: "10.2.0",
    monacoLang: "c",
    defaultCode: `#include <stdio.h>\n\nint main() {\n    printf("🚀 Hello from C in Anva Call Session!\\n");\n    return 0;\n}`,
  },
  java: {
    label: "Java (OpenJDK)",
    version: "15.0.2",
    monacoLang: "java",
    defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("🚀 Live Session Code Runner");\n        System.out.println("Ready to solve problems together!");\n    }\n}`,
  },
  go: {
    label: "Go",
    version: "1.16.2",
    monacoLang: "go",
    defaultCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("🚀 Hello from Go in Anva Call Session!")\n}`,
  },
  rust: {
    label: "Rust",
    version: "1.68.2",
    monacoLang: "rust",
    defaultCode: `fn main() {\n    println!("🚀 Hello from Rust in Anva Call Session!");\n}`,
  },
  php: {
    label: "PHP",
    version: "8.2.3",
    monacoLang: "php",
    defaultCode: `<?php\necho "🚀 Hello from PHP in Anva Call Session!\\n";\n?>`,
  },
  ruby: {
    label: "Ruby",
    version: "3.2.1",
    monacoLang: "ruby",
    defaultCode: `puts "🚀 Hello from Ruby in Anva Call Session!"`,
  },
  swift: {
    label: "Swift",
    version: "5.3.3",
    monacoLang: "swift",
    defaultCode: `import Foundation\n\nprint("🚀 Hello from Swift in Anva Call Session!")`,
  },
  kotlin: {
    label: "Kotlin",
    version: "1.8.20",
    monacoLang: "kotlin",
    defaultCode: `fun main() {\n    println!("🚀 Hello from Kotlin in Anva Call Session!")\n}`,
  },
  csharp: {
    label: "C# (.NET)",
    version: "9.0",
    monacoLang: "csharp",
    defaultCode: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("🚀 Hello from C# in Anva Call Session!");\n    }\n}`,
  },
  dart: {
    label: "Dart (Flutter)",
    version: "2.12.0",
    monacoLang: "dart",
    defaultCode: `void main() {\n  print("🚀 Hello from Dart in Anva Call Session!");\n}`,
  },
  mysql: {
    label: "MySQL",
    version: "8.0",
    monacoLang: "sql",
    defaultCode: `-- MySQL Database query\nCREATE TABLE study_sessions (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  topic VARCHAR(100),\n  status VARCHAR(20)\n);\n\nINSERT INTO study_sessions (topic, status) VALUES ('English Conversation', 'Active');\nSELECT * FROM study_sessions;`,
  },
  postgresql: {
    label: "PostgreSQL",
    version: "13",
    monacoLang: "sql",
    defaultCode: `-- PostgreSQL query\nCREATE TABLE study_notes (\n  id SERIAL PRIMARY KEY,\n  title TEXT NOT NULL\n);\n\nINSERT INTO study_notes (title) VALUES ('Algorithms & Vocab Review');\nSELECT * FROM study_notes;`,
  },
  mongodb: {
    label: "MongoDB",
    version: "5.0",
    monacoLang: "javascript",
    defaultCode: `// MongoDB query\ndb.peerSessions.insertOne({\n  partner: "Alex",\n  topic: "Live Coding & English",\n  createdAt: new Date()\n});\n\ndb.peerSessions.find();`,
  },
  html: {
    label: "HTML5",
    version: "5",
    monacoLang: "html",
    defaultCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Anva Sandbox</title>\n</head>\n<body>\n  <h1>🚀 Live Peer Coding in Anva</h1>\n  <p>Collaborate in real time!</p>\n</body>\n</html>`,
  },
  css: {
    label: "CSS3",
    version: "3",
    monacoLang: "css",
    defaultCode: `/* Anva Live Stylesheet */\nbody {\n  background-color: #000000;\n  color: #ffffff;\n  font-family: system-ui, sans-serif;\n}\n\nh1 {\n  color: #ffffff;\n  text-align: center;\n}`,
  },
};

const CallPage = () => {
  const { id: callId } = useParams();
  const [searchParams] = useSearchParams();
  const isCallerParam = searchParams.get("isCaller") === "true";
  const isCalleeParam = searchParams.get("isCallee") === "true";
  const peerId = searchParams.get("peerId") || "";
  const peerName = searchParams.get("peerName") || "Peer";
  const peerPic = searchParams.get("peerPic") || "";

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // Call lifecycle status: "CALLING" | "RINGING" | "CONNECTED" | "DECLINED" | "NOT_LIFTING"
  const [callStatus, setCallStatus] = useState(() => {
    if (isCallerParam) return "CALLING";
    return "CONNECTED";
  });

  const { authUser, isLoading } = useAuthUser();
  const navigate = useNavigate();
  const broadcastChannelRef = useRef(null);
  const timeoutTimerRef = useRef(null);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  // Handle Outgoing Ringing and Signaling State Machine
  useEffect(() => {
    if (!isCallerParam) {
      setCallStatus("CONNECTED");
      return;
    }

    // 1. Play Outgoing Dial / Ringback Tone
    callSounds.playOutgoingRingtone();

    // 2. Transition from "Calling" to "Ringing" after 2 seconds
    const ringingTimer = setTimeout(() => {
      setCallStatus((prev) => (prev === "CALLING" ? "RINGING" : prev));
    }, 2000);

    // 3. 35-second Timeout: If receiver doesn't answer, show "NOT_LIFTING"
    timeoutTimerRef.current = setTimeout(() => {
      callSounds.stopAll();
      callSounds.playEndTone();
      setCallStatus("NOT_LIFTING");

      // Broadcast timeout to callee to close incoming popup
      broadcastChannelRef.current?.postMessage({
        type: "CALL_TIMEOUT",
        payload: { callId },
      });

      // Auto close after 4 seconds
      setTimeout(() => {
        window.close();
        if (window.history.length > 1) {
          navigate(-1);
        } else {
          navigate("/chat");
        }
      }, 4000);
    }, 35000);

    return () => {
      clearTimeout(ringingTimer);
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      callSounds.stopAll();
    };
  }, [isCallerParam, callId, navigate]);

  const handleRemoteHangup = useCallback(() => {
    callSounds.stopAll();
    callSounds.playEndTone();
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    setCallStatus("ENDED");
    toast("Call ended by peer", { icon: "📞" });
    setTimeout(() => {
      window.close();
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/chat");
      }
    }, 1500);
  }, [navigate]);

  // Setup BroadcastChannel for Instant Cross-Window / Cross-Tab Signaling
  useEffect(() => {
    try {
      const bc = new BroadcastChannel("anva_call_signaling");
      broadcastChannelRef.current = bc;

      bc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (payload?.callId && payload.callId !== callId) return;

        if (type === "CALL_ACCEPTED") {
          callSounds.stopAll();
          if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
          setCallStatus("CONNECTED");
          toast.success(`${peerName} joined the call!`);
        } else if (type === "CALL_REJECTED") {
          callSounds.stopAll();
          callSounds.playDeclinedTone();
          if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
          setCallStatus("DECLINED");

          setTimeout(() => {
            window.close();
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/chat");
            }
          }, 3500);
        } else if (type === "CALL_TIMEOUT") {
          callSounds.stopAll();
          callSounds.playEndTone();
          if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
          setCallStatus("NOT_LIFTING");
        } else if (type === "CALL_ENDED" || type === "CALL_CANCELLED") {
          handleRemoteHangup();
        }
      };

      return () => {
        bc.close();
      };
    } catch (err) {
      console.warn("BroadcastChannel error:", err);
    }
  }, [callId, peerName, navigate, handleRemoteHangup]);

  // Initialize Stream Video Call Client and cross-device sync
  useEffect(() => {
    let videoClient;
    let callInstance;
    let participantSub;
    let remoteSub;
    let customEventUnsub;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
        };

        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
          options: {
            logLevel: "error",
          },
        });

        callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        // 1. Remote participants subscription (immediate detection of peer)
        remoteSub = callInstance.state.remoteParticipants$.subscribe((remotes) => {
          if (remotes && remotes.length > 0) {
            callSounds.stopAll();
            if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
            setCallStatus("CONNECTED");
          }
        });

        // 2. Total participants subscription
        participantSub = callInstance.state.participants$.subscribe((participants) => {
          if (participants && participants.length > 1) {
            callSounds.stopAll();
            if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
            setCallStatus("CONNECTED");
          }
        });

        // 3. Stream Video custom signaling events
        customEventUnsub = callInstance.on("custom", (event) => {
          const data = event.custom;
          if (data?.actionType === "CALL_ACCEPTED") {
            callSounds.stopAll();
            if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
            setCallStatus("CONNECTED");
          } else if (data?.actionType === "CALL_REJECTED") {
            callSounds.stopAll();
            callSounds.playDeclinedTone();
            if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
            setCallStatus("DECLINED");
          } else if (data?.actionType === "CALL_ENDED" || data?.actionType === "CALL_CANCELLED") {
            handleRemoteHangup();
          }
        });

        // 4. Remote participant left / call ended natively in WebRTC room
        callInstance.on("call.ended", () => {
          handleRemoteHangup();
        });
        callInstance.on("call.session_participant_left", (event) => {
          if (event.participant?.user?.id && event.participant.user.id !== authUser._id) {
            handleRemoteHangup();
          }
        });

        // If callee joined, broadcast acceptance signal directly via Stream Video room
        if (isCalleeParam) {
          callInstance
            .sendCustomEvent({
              actionType: "CALL_ACCEPTED",
              senderId: authUser._id,
            })
            .catch(() => {});
        }

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      if (participantSub) participantSub.unsubscribe();
      if (remoteSub) remoteSub.unsubscribe();
      if (customEventUnsub) customEventUnsub();
      if (callInstance) callInstance.leave().catch(console.error);
      if (videoClient) videoClient.disconnectUser().catch(console.error);
    };
  }, [tokenData, authUser, callId, isCalleeParam, handleRemoteHangup]);

  // Stream Chat Channel signaling sync inside CallPage (cross-device & remote sync)
  useEffect(() => {
    if (!tokenData?.token || !authUser || !callId) return;

    let isMounted = true;
    const chatClient = StreamChat.getInstance(STREAM_API_KEY);

    const initChatSignaling = async () => {
      try {
        if (chatClient.userID !== authUser._id) {
          if (chatClient.userID) await chatClient.disconnectUser();
          await chatClient.connectUser(
            { id: authUser._id, name: authUser.fullName },
            tokenData.token
          );
        }

        const ch = chatClient.channel("messaging", callId);
        await ch.watch().catch(() => {});

        const handleChatSignal = (event) => {
          if (!isMounted) return;
          const type = event.type || event.custom?.type;

          if (
            type === "call_accepted" ||
            type === "call.accepted"
          ) {
            callSounds.stopAll();
            if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
            setCallStatus("CONNECTED");
          } else if (
            type === "call_rejected" ||
            type === "call.rejected"
          ) {
            callSounds.stopAll();
            callSounds.playDeclinedTone();
            if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
            setCallStatus("DECLINED");
          } else if (
            type === "call_timeout" ||
            type === "call.timeout"
          ) {
            callSounds.stopAll();
            callSounds.playEndTone();
            if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
            setCallStatus("NOT_LIFTING");
          } else if (
            type === "call_ended" ||
            type === "call.ended" ||
            type === "call_cancelled" ||
            type === "call.cancelled"
          ) {
            handleRemoteHangup();
          }
        };

        ch.on("call_accepted", handleChatSignal);
        ch.on("call_rejected", handleChatSignal);
        ch.on("call_timeout", handleChatSignal);
        ch.on("call_ended", handleChatSignal);
        ch.on("call_cancelled", handleChatSignal);
        ch.on("message.new", (e) => {
          if (e.message?.custom) handleChatSignal(e.message.custom);
        });

        return () => {
          ch.off("call_accepted", handleChatSignal);
          ch.off("call_rejected", handleChatSignal);
          ch.off("call_timeout", handleChatSignal);
          ch.off("call_ended", handleChatSignal);
          ch.off("call_cancelled", handleChatSignal);
        };
      } catch (err) {
        console.warn("CallPage chat signaling error:", err);
      }
    };

    initChatSignaling();

    return () => {
      isMounted = false;
    };
  }, [tokenData, authUser, callId, handleRemoteHangup]);

  const handleCancelOutgoingCall = async () => {
    callSounds.stopAll();
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);

    // 1. Broadcast cancellation signal via BroadcastChannel
    broadcastChannelRef.current?.postMessage({
      type: "CALL_CANCELLED",
      payload: { callId },
    });

    // 2. Broadcast cancellation via Stream Video
    call?.sendCustomEvent({ actionType: "CALL_CANCELLED", senderId: authUser?._id }).catch(() => {});

    // 3. Broadcast cancellation via Stream Chat
    if (tokenData?.token && authUser && callId) {
      try {
        const chatClient = StreamChat.getInstance(STREAM_API_KEY);
        const ch = chatClient.channel("messaging", callId);
        ch.sendEvent({ type: "call_cancelled", callId, targetUserId: peerId }).catch(() => {});
        ch.sendMessage({
          text: "📵 Video call cancelled.",
          custom: { type: "call_cancelled", callId, targetUserId: peerId },
        }).catch(() => {});
      } catch (err) {
        console.warn("Could not send call cancellation:", err);
      }
    }

    if (call) {
      try {
        await call.leave();
      } catch (err) {
        console.error(err);
      }
    }

    window.close();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/chat");
    }
  };

  if (isLoading || isConnecting) return <PageLoader />;

  // ══════════════════════════════════════════════════════════════════════════
  // OUTGOING CALLING / RINGING / NOT LIFTING SCREEN (WhatsApp Style)
  // ══════════════════════════════════════════════════════════════════════════
  if (callStatus !== "CONNECTED") {
    return (
      <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-between p-8 font-sans select-none relative overflow-hidden">
        {/* Ambient Radial Background Glow */}
        <div className="absolute inset-0 bg-radial from-zinc-900/60 via-black to-black pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center gap-2 z-10">
          <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
            Anva End-to-End Encrypted Call
          </span>
        </div>

        {/* Center Calling Status & Pulsing Peer Avatar */}
        <div className="flex flex-col items-center text-center z-10 max-w-sm">
          {/* Pulsing Avatar */}
          <div className="relative mb-8 flex items-center justify-center">
            {(callStatus === "CALLING" || callStatus === "RINGING") && (
              <>
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping opacity-60" />
                <div className="absolute -inset-10 rounded-full bg-emerald-500/10 animate-pulse" />
              </>
            )}

            {callStatus === "DECLINED" && (
              <div className="absolute -inset-4 rounded-full bg-red-500/20 animate-pulse" />
            )}

            {callStatus === "NOT_LIFTING" && (
              <div className="absolute -inset-4 rounded-full bg-amber-500/20 animate-pulse" />
            )}

            <div
              className={`relative size-32 sm:size-40 rounded-full overflow-hidden border-4 shadow-2xl bg-zinc-900 flex items-center justify-center z-10 transition-all ${
                callStatus === "DECLINED"
                  ? "border-red-500 opacity-80"
                  : callStatus === "NOT_LIFTING"
                  ? "border-amber-500 opacity-80"
                  : "border-white/40 shadow-emerald-500/20"
              }`}
            >
              {peerPic ? (
                <img
                  src={peerPic}
                  alt={peerName}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-20 text-zinc-500" />
              )}
            </div>
          </div>

          {/* Peer Full Name */}
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            {peerName}
          </h1>

          {/* Dynamic Status Badges */}
          {callStatus === "CALLING" && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-black uppercase tracking-wider">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Calling...</span>
            </div>
          )}

          {callStatus === "RINGING" && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-emerald-400 text-xs font-black uppercase tracking-wider animate-pulse">
              <Volume2 className="size-3.5" />
              <span>Ringing...</span>
            </div>
          )}

          {callStatus === "DECLINED" && (
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-700/80 text-red-400 text-xs font-black uppercase tracking-wider">
                <PhoneOff className="size-3.5" />
                <span>Call Declined</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                User is busy or declined the call. Closing window...
              </p>
            </div>
          )}

          {callStatus === "NOT_LIFTING" && (
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-700/80 text-amber-400 text-xs font-black uppercase tracking-wider">
                <PhoneMissed className="size-3.5" />
                <span>Not Lifting</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                User is not answering the call. Closing window...
              </p>
            </div>
          )}

          {callStatus === "ENDED" && (
            <div className="flex flex-col items-center gap-1.5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-black uppercase tracking-wider">
                <PhoneOff className="size-3.5 text-red-400" />
                <span>Call Ended</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                The call has ended. Closing window...
              </p>
            </div>
          )}
        </div>

        {/* Bottom Action Controls */}
        <div className="flex flex-col items-center gap-3 z-10 w-full max-w-xs">
          {callStatus === "CALLING" || callStatus === "RINGING" ? (
            <button
              type="button"
              onClick={handleCancelOutgoingCall}
              className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl border border-red-500/40 flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
            >
              <div className="size-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                <PhoneOff className="size-4 text-white" />
              </div>
              <span>End Call</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                window.close();
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/chat");
                }
              }}
              className="w-full py-3.5 px-6 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-zinc-200 font-bold text-xs rounded-2xl border border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <X className="size-4" />
              <span>Close Window</span>
            </button>
          )}

          <p className="text-[11px] text-zinc-500 font-mono">
            {callStatus === "RINGING" ? "Waiting for peer to pick up..." : ""}
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ACTIVE CONNECTED VIDEO CALL + COLLABORATIVE MONACO WORKSPACE
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden flex flex-col font-sans select-none" data-theme="dark">
      {/* Scoped CSS to make Stream UI popups and menus crystal clear in pure Black & White */}
      <style>{`
        .str-video__speaker-layout__wrapper {
          height: 100% !important;
          max-height: 100% !important;
          background: #000000 !important;
        }
        /* Hide unnecessary 11-item administrative popup menu on video tiles */
        .str-video__participant-actions-menu-btn,
        .str-video__menu-container,
        .str-video__menu,
        .str-video__participant-details__actions,
        .str-video__participant-actions-btn {
          display: none !important;
        }
        .str-video__call-controls {
          background: rgba(18, 18, 18, 0.95) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 9999px !important;
          padding: 8px 16px !important;
          box-shadow: 0 10px 30px -3px rgba(0, 0, 0, 0.8) !important;
          gap: 12px !important;
        }
        .str-video__composite-button__button {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          transition: all 0.2s ease !important;
        }
        .str-video__composite-button__button:hover {
          background-color: #ffffff !important;
          color: #000000 !important;
          transform: scale(1.05) !important;
        }
        .str-video__composite-button__button:hover svg {
          color: #000000 !important;
          fill: #000000 !important;
        }
      `}</style>

      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent callId={callId} />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm font-bold text-zinc-400">Could not initialize call. Please refresh or try again later.</p>
        </div>
      )}
    </div>
  );
};

const CustomCallControls = ({ seconds = 0, callId = "" }) => {
  const call = useCall();
  const { authUser } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });
  const { useMicrophoneState, useCameraState, useScreenShareState } = useCallStateHooks();
  const { isMute: isMicMute } = useMicrophoneState();
  const { isMute: isCamMute } = useCameraState();
  const { isMute: isScreenShareMute } = useScreenShareState();
  const navigate = useNavigate();

  const toggleMic = async () => {
    try {
      await call?.microphone.toggle();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCam = async () => {
    try {
      await call?.camera.toggle();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleScreenShare = async () => {
    try {
      await call?.screenShare.toggle();
    } catch (err) {
      console.error(err);
    }
  };

  const leaveCall = async () => {
    try {
      // If the call lasted at least 3 seconds, post an "Ended Call" card with duration to the chat channel
      if (seconds >= 3 && callId && authUser && tokenData?.token) {
        const chatClient = StreamChat.getInstance(STREAM_API_KEY);
        const ch = chatClient.channel("messaging", callId);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const durStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

        ch.sendMessage({
          text: `📹 Video Call (${durStr})`,
          attachments: [
            {
              type: "call_history",
              call_type: "video",
              call_status: "ended",
              duration: seconds,
              call_id: callId,
              caller_id: authUser._id,
              caller_name: authUser.fullName,
              timestamp: Date.now(),
            },
          ],
          custom: {
            type: "call_ended",
            callId,
            duration: seconds,
          },
        }).catch(() => {});
      }
      await call?.leave();
    } catch (err) {
      console.error(err);
    } finally {
      // 1. If in a popup window, close it immediately
      window.close();
      // 2. If close was blocked or in normal tab, navigate back to chat
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/chat");
      }
    }
  };

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-full shadow-2xl">
      {/* Microphone */}
      <button
        type="button"
        onClick={toggleMic}
        className={`size-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isMicMute
            ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
            : "bg-zinc-900 text-white border border-zinc-700 hover:bg-white hover:text-black"
        }`}
        title={isMicMute ? "Unmute Microphone" : "Mute Microphone"}
      >
        {isMicMute ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
      </button>

      {/* Camera */}
      <button
        type="button"
        onClick={toggleCam}
        className={`size-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isCamMute
            ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
            : "bg-zinc-900 text-white border border-zinc-700 hover:bg-white hover:text-black"
        }`}
        title={isCamMute ? "Turn Camera On" : "Turn Camera Off"}
      >
        {isCamMute ? <VideoOff className="size-3.5" /> : <Video className="size-3.5" />}
      </button>

      {/* Screen Share */}
      <button
        type="button"
        onClick={toggleScreenShare}
        className={`size-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          !isScreenShareMute
            ? "bg-white text-black border border-white"
            : "bg-zinc-900 text-white border border-zinc-700 hover:bg-white hover:text-black"
        }`}
        title={!isScreenShareMute ? "Stop Screen Share" : "Share Screen"}
      >
        <Laptop className="size-3.5" />
      </button>

      <div className="h-4 w-px bg-zinc-800 mx-0.5" />

      {/* End Call */}
      <button
        type="button"
        onClick={leaveCall}
        className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1 shadow-md transition-all cursor-pointer"
        title="Leave / End Call"
      >
        <PhoneOff className="size-3" />
        <span>End</span>
      </button>
    </div>
  );
};

const CallContent = ({ callId }) => {
  const call = useCall();
  const { authUser } = useAuthUser();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // Layout & Workspace states
  const mainContainerRef = useRef(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [hideVideo, setHideVideo] = useState(false);
  const [splitPercent, setSplitPercent] = useState(50); // percentage for Video pane (from 15% to 85%)
  const isDraggingRef = useRef(false);
  const [activeTab, setActiveTab] = useState("code"); // "code" | "whiteboard" | "notes"

  // Code editor states
  const editorRef = useRef(null);
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [codeContent, setCodeContent] = useState(CODE_LANGUAGES.javascript.defaultCode);
  const [stdin, setStdin] = useState("");
  const [bottomCodeTab, setBottomCodeTab] = useState("terminal"); // "terminal" | "stdin"
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState("");

  // Collaboration tracking states
  const [lastPeerActivity, setLastPeerActivity] = useState(null); // { name: string, action: string, time: number }
  const isRemoteUpdateRef = useRef(false);
  const codeDebounceTimerRef = useRef(null);
  const notesDebounceTimerRef = useRef(null);
  const stdinDebounceTimerRef = useRef(null);
  const latestStateRef = useRef({
    codeContent: CODE_LANGUAGES.javascript.defaultCode,
    selectedLang: "javascript",
    stdin: "",
    output: "",
    isRunning: false,
    notes: "",
  });

  // Keep latestStateRef in sync with current state for state requests from peers
  useEffect(() => {
    latestStateRef.current = {
      codeContent,
      selectedLang,
      stdin,
      output,
      isRunning,
      notes,
    };
  }, [codeContent, selectedLang, stdin, output, isRunning, notes]);

  // Broadcast helper function
  const broadcastCustomEvent = async (actionType, payload = {}) => {
    if (!call) return;
    try {
      await call.sendCustomEvent({
        actionType,
        senderId: authUser?._id,
        senderName: authUser?.fullName || "Peer",
        timestamp: Date.now(),
        ...payload,
      });
    } catch (err) {
      console.error("Error sending custom event:", err);
    }
  };

  // Real-time synchronization event listener
  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event) => {
      const data = event.custom;
      if (!data || !data.actionType) return;

      // Ignore events sent by self
      if (data.senderId && data.senderId === authUser?._id) return;

      const senderName = data.senderName || "Peer";

      switch (data.actionType) {
        case "WORKSPACE_STATE_REQUEST": {
          // Send our latest state back to the newly joined peer
          const currentState = latestStateRef.current;
          call.sendCustomEvent({
            actionType: "WORKSPACE_STATE_SYNC",
            senderId: authUser?._id,
            senderName: authUser?.fullName || "Peer",
            timestamp: Date.now(),
            state: currentState,
          }).catch(console.error);
          break;
        }

        case "WORKSPACE_STATE_SYNC": {
          if (data.state) {
            isRemoteUpdateRef.current = true;
            if (data.state.selectedLang) setSelectedLang(data.state.selectedLang);
            if (data.state.codeContent !== undefined) setCodeContent(data.state.codeContent);
            if (data.state.stdin !== undefined) setStdin(data.state.stdin);
            if (data.state.output !== undefined) setOutput(data.state.output);
            if (data.state.isRunning !== undefined) setIsRunning(data.state.isRunning);
            if (data.state.notes !== undefined) setNotes(data.state.notes);

            setLastPeerActivity({
              name: senderName,
              action: "Synced workspace",
              time: Date.now(),
            });
            toast.success(`Connected to ${senderName}'s live workspace!`, { id: "workspace-sync" });
          }
          break;
        }

        case "CODE_CHANGE": {
          if (data.code !== undefined) {
            isRemoteUpdateRef.current = true;
            setCodeContent(data.code);
            setLastPeerActivity({
              name: senderName,
              action: "Editing code",
              time: Date.now(),
            });
          }
          break;
        }

        case "LANG_CHANGE": {
          if (data.lang) {
            isRemoteUpdateRef.current = true;
            setSelectedLang(data.lang);
            if (data.code !== undefined) setCodeContent(data.code);
            setLastPeerActivity({
              name: senderName,
              action: `Switched to ${CODE_LANGUAGES[data.lang]?.label || data.lang}`,
              time: Date.now(),
            });
            toast(`${senderName} switched language to ${CODE_LANGUAGES[data.lang]?.label || data.lang}`, {
              icon: "🔀",
            });
          }
          break;
        }

        case "RESET_CODE": {
          if (data.code !== undefined) {
            isRemoteUpdateRef.current = true;
            setCodeContent(data.code);
            setOutput("");
            setLastPeerActivity({
              name: senderName,
              action: "Reset code",
              time: Date.now(),
            });
            toast(`${senderName} reset code to template`, { icon: "🔄" });
          }
          break;
        }

        case "STDIN_CHANGE": {
          if (data.stdin !== undefined) {
            setStdin(data.stdin);
            setLastPeerActivity({
              name: senderName,
              action: "Updated input",
              time: Date.now(),
            });
          }
          break;
        }

        case "RUN_START": {
          setBottomCodeTab("terminal");
          setIsRunning(true);
          setOutput(`⏳ ${senderName} is executing the code...`);
          setLastPeerActivity({
            name: senderName,
            action: "Running code",
            time: Date.now(),
          });
          break;
        }

        case "RUN_COMPLETE": {
          setIsRunning(false);
          if (data.output !== undefined) {
            setOutput(data.output);
          }
          setBottomCodeTab("terminal");
          setLastPeerActivity({
            name: senderName,
            action: "Finished execution",
            time: Date.now(),
          });
          break;
        }

        case "NOTES_CHANGE": {
          if (data.notes !== undefined) {
            setNotes(data.notes);
            setLastPeerActivity({
              name: senderName,
              action: "Updated notes",
              time: Date.now(),
            });
          }
          break;
        }

        default:
          break;
      }
    });

    // Request the latest workspace state from peers when entering
    const initialSyncTimer = setTimeout(() => {
      broadcastCustomEvent("WORKSPACE_STATE_REQUEST");
    }, 1000);

    return () => {
      clearTimeout(initialSyncTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [call, authUser]);

  // Code editor change handler
  const handleCodeChange = (newCode) => {
    const val = newCode || "";
    setCodeContent(val);

    // If change was triggered remotely, don't broadcast back
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    // Debounce code updates to avoid spamming the network on rapid keystrokes
    if (codeDebounceTimerRef.current) clearTimeout(codeDebounceTimerRef.current);
    codeDebounceTimerRef.current = setTimeout(() => {
      broadcastCustomEvent("CODE_CHANGE", { code: val });
    }, 200);
  };

  // Language change handler
  const handleLanguageChange = (lang) => {
    const defaultCode = CODE_LANGUAGES[lang]?.defaultCode || "";
    setSelectedLang(lang);
    setCodeContent(defaultCode);
    broadcastCustomEvent("LANG_CHANGE", { lang, code: defaultCode });
  };

  // Reset code handler
  const handleResetCode = () => {
    const defaultCode = CODE_LANGUAGES[selectedLang]?.defaultCode || "";
    setCodeContent(defaultCode);
    setOutput("");
    toast.success("Code reset to template.");
    broadcastCustomEvent("RESET_CODE", { lang: selectedLang, code: defaultCode });
  };

  // Stdin change handler
  const handleStdinChange = (newStdin) => {
    setStdin(newStdin);
    if (stdinDebounceTimerRef.current) clearTimeout(stdinDebounceTimerRef.current);
    stdinDebounceTimerRef.current = setTimeout(() => {
      broadcastCustomEvent("STDIN_CHANGE", { stdin: newStdin });
    }, 200);
  };

  // Notes change handler
  const handleNotesChange = (newNotes) => {
    setNotes(newNotes);
    if (notesDebounceTimerRef.current) clearTimeout(notesDebounceTimerRef.current);
    notesDebounceTimerRef.current = setTimeout(() => {
      broadcastCustomEvent("NOTES_CHANGE", { notes: newNotes });
    }, 250);
  };

  // Whiteboard drawing states
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Call duration timer
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    setTimeout(() => {
      editor.layout();
    }, 100);
  };

  // Recalibrate editor layout whenever tab, split ratio, workspace, or video visibility toggles
  useEffect(() => {
    if (activeTab === "code" && editorRef.current) {
      const timer = setTimeout(() => {
        editorRef.current?.layout();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [activeTab, workspaceOpen, splitPercent, hideVideo]);

  // Setup whiteboard canvas dimensions
  useEffect(() => {
    if (activeTab === "whiteboard" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [activeTab, workspaceOpen, splitPercent, hideVideo]);

  // Close window or navigate back to chat if call ended
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      window.close();
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/chat");
      }
    }
  }, [callingState, navigate]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (callingState === CallingState.LEFT) {
    return null;
  }

  // Drag Resizer Handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (moveEvent) => {
      if (!isDraggingRef.current || !mainContainerRef.current) return;
      const rect = mainContainerRef.current.getBoundingClientRect();
      const clientX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX;
      if (!clientX) return;
      const newPercent = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(Math.max(newPercent, 15), 85);
      setSplitPercent(clamped);
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
      if (editorRef.current) {
        setTimeout(() => editorRef.current?.layout(), 50);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("touchend", onMouseUp);
  };

  // Handle Code Execution
  const handleRunCode = async () => {
    if (!codeContent.trim()) return;
    setBottomCodeTab("terminal");
    setIsRunning(true);
    const runningMsg = "⏳ Executing code on engine...";
    setOutput(runningMsg);
    broadcastCustomEvent("RUN_START");

    try {
      const data = await executeCompilerCode({
        language: selectedLang,
        version: CODE_LANGUAGES[selectedLang]?.version || "18.15.0",
        files: [{ content: codeContent }],
        stdin: stdin,
      });

      let resultText = "";
      if (data?.run) {
        if (data.run.stderr) {
          resultText = data.run.stderr + (data.run.stdout ? "\n" + data.run.stdout : "");
        } else {
          resultText = data.run.stdout || data.run.output || "Program exited with code 0 (no output).";
        }
      } else {
        resultText = data?.output || data?.message || "Executed successfully.";
      }

      setOutput(resultText);
      broadcastCustomEvent("RUN_COMPLETE", { output: resultText });
    } catch (err) {
      const errMsg = `❌ Execution error: ${err.response?.data?.message || err.message}`;
      setOutput(errMsg);
      broadcastCustomEvent("RUN_COMPLETE", { output: errMsg });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    toast.success("Code copied to clipboard!");
  };

  // Canvas Handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? "#000000" : brushColor;
    ctx.lineWidth = isEraser ? brushSize * 5 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    toast.success("Canvas cleared!");
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `Anva-Whiteboard-${callId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Whiteboard saved as image!");
  };

  return (
    <StreamTheme className="h-full w-full flex flex-col overflow-hidden bg-black">
      {/* ── TOP BLACK & WHITE COCKPIT HEADER ── */}
      <header className="h-14 bg-black border-b border-zinc-800 px-4 flex items-center justify-between z-20 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span className="font-black text-sm tracking-wide text-white flex items-center gap-2">
            <span className="size-2 rounded-full bg-white animate-pulse" />
            Anva <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Call</span>
          </span>

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-xs font-mono font-bold text-zinc-300">Room: {callId.slice(0, 8)}...</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-700">
            <Clock className="size-3.5 text-zinc-400" />
            <span>{formatTimer(seconds)}</span>
          </div>
        </div>

        {/* Right Header Layout & Call Controls (Clean, No Duplicates) */}
        <div className="flex items-center gap-2">
          {/* Active Call Controls in Header when Video is Hidden */}
          {hideVideo && <CustomCallControls seconds={seconds} callId={callId} />}

          {/* Toggle Hide / Show Video Button */}
          <button
            type="button"
            onClick={() => {
              setHideVideo((prev) => !prev);
              if (!workspaceOpen) setWorkspaceOpen(true);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              hideVideo
                ? "bg-white text-black border border-white shadow-sm"
                : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700"
            }`}
            title={hideVideo ? "Show Video stream" : "Hide Video (Focus on Compiler Workspace)"}
          >
            {hideVideo ? <Video className="size-3.5" /> : <VideoOff className="size-3.5" />}
            <span>{hideVideo ? "Show Video" : "Hide Video"}</span>
          </button>

          {/* Toggle Workspace Button */}
          <button
            type="button"
            onClick={() => {
              if (hideVideo) setHideVideo(false);
              setWorkspaceOpen((prev) => !prev);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              workspaceOpen && !hideVideo
                ? "bg-white text-black border border-white shadow-sm"
                : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700"
            }`}
          >
            <Layout className="size-3.5" />
            <span>{workspaceOpen ? "Hide Workspace" : "Open Workspace"}</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE & CALL CONTAINER WITH INTERACTIVE ADJUST ARROW RESIZER ── */}
      <div
        ref={mainContainerRef}
        className="flex-1 min-h-0 flex overflow-hidden relative bg-black w-full select-none"
      >
        {/* ── LEFT / VIDEO PANE ── */}
        {!hideVideo && (
          <div
            style={{ width: workspaceOpen ? `${splitPercent}%` : "100%" }}
            className="flex flex-col justify-between overflow-hidden relative bg-black h-full min-h-0 shrink-0"
          >
            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden w-full h-full p-2 bg-black">
              <SpeakerLayout ParticipantViewUIConfig={{ showParticipantMenu: false }} />
            </div>
            <div className="p-3 flex justify-center z-10 bg-gradient-to-t from-black via-black/80 to-transparent shrink-0">
              <CustomCallControls seconds={seconds} callId={callId} />
            </div>
          </div>
        )}

        {/* ── INTERACTIVE ADJUST ARROW DRAG RESIZER ── */}
        {workspaceOpen && !hideVideo && (
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            className="w-3 relative group flex items-center justify-center cursor-col-resize z-30 bg-black hover:bg-zinc-900 transition-colors select-none shrink-0"
            title="Drag left or right to adjust Video and Compiler split"
          >
            {/* Center Divider Line */}
            <div className="w-[1px] h-full bg-zinc-800 group-hover:bg-white/50 transition-colors" />

            {/* Adjust Arrow Pill Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center size-7 bg-zinc-950 border border-zinc-700 group-hover:border-white rounded-full shadow-2xl transition-all group-hover:scale-125">
              <ChevronsLeftRight className="size-3.5 text-zinc-300 group-hover:text-white" />
            </div>
          </div>
        )}

        {/* ── RIGHT / COLLABORATIVE WORKSPACE PANE ── */}
        {workspaceOpen && (
          <div
            style={{ width: hideVideo ? "100%" : `${100 - splitPercent}%` }}
            className={`bg-zinc-950 flex flex-col h-full min-h-0 overflow-hidden z-10 shrink-0 ${
              !hideVideo ? "border-l border-zinc-800" : ""
            }`}
          >
              {/* Workspace Navigation Bar */}
              <div className="h-12 px-4 py-2.5 bg-black border-b border-zinc-800 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "code"
                        ? "bg-white text-black shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <Code className="size-3.5" /> Code & Run
                  </button>

                  <button
                    onClick={() => setActiveTab("whiteboard")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "whiteboard"
                        ? "bg-white text-black shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <Edit3 className="size-3.5" /> Whiteboard
                  </button>

                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === "notes"
                        ? "bg-white text-black shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <FileText className="size-3.5" /> Live Notes
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {lastPeerActivity ? (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{lastPeerActivity.name}: {lastPeerActivity.action}</span>
                    </div>
                  ) : (
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-semibold">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span>Shared Compiler</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setWorkspaceOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                    title="Close Workspace"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════
                  TAB 1: COLLABORATIVE CODE COMPILER & MONACO
                  ══════════════════════════════════════════════════ */}
              {activeTab === "code" && (
                <div className="flex-1 min-h-0 flex flex-col h-full overflow-hidden bg-[#121212]">
                  {/* Code Toolbar */}
                  <div className="h-12 px-3 py-2 bg-black border-b border-zinc-800 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedLang}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-zinc-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-white cursor-pointer"
                      >
                        {Object.entries(CODE_LANGUAGES).map(([key, val]) => (
                          <option key={key} value={key}>
                            {val.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleResetCode}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 border border-zinc-800 transition-all cursor-pointer"
                        title="Reset to starter code"
                      >
                        <RotateCcw className="size-3" /> Reset
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBottomCodeTab((prev) => (prev === "stdin" ? "terminal" : "stdin"))}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                          bottomCodeTab === "stdin"
                            ? "bg-white text-black border-white font-extrabold"
                            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800"
                        }`}
                        title="Toggle Custom Input (stdin)"
                      >
                        <LogIn className="size-3.5" />
                        <span>Input {stdin.trim() ? "•" : ""}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 border border-zinc-800 transition-all cursor-pointer"
                        title="Copy Code"
                      >
                        <Copy className="size-3.5" /> Copy
                      </button>

                      <button
                        type="button"
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className="px-4 py-1.5 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isRunning ? (
                          <span className="loading loading-spinner size-3 text-black"></span>
                        ) : (
                          <Play className="size-3.5 fill-black text-black" />
                        )}
                        <span>{isRunning ? "Running..." : "Run Code"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Monaco Editor Container */}
                  <div className="flex-1 min-h-0 w-full relative bg-[#121212] overflow-hidden">
                    <Editor
                      height="100%"
                      width="100%"
                      theme="vs-dark"
                      language={CODE_LANGUAGES[selectedLang]?.monacoLang || selectedLang}
                      value={codeContent}
                      onMount={handleEditorDidMount}
                      onChange={handleCodeChange}
                      loading={
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2 font-mono text-xs">
                          <span className="loading loading-dots loading-md text-white"></span>
                          <span>Loading Code Engine...</span>
                        </div>
                      }
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: "on",
                        padding: { top: 12, bottom: 12 },
                      }}
                    />
                  </div>

                  {/* Dual Tab Bottom Pane (Terminal & Custom Input) */}
                  <div className="h-44 bg-black text-white flex flex-col border-t border-zinc-800 shrink-0">
                    {/* Tab Navigation Header */}
                    <div className="h-9 px-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setBottomCodeTab("terminal")}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                            bottomCodeTab === "terminal"
                              ? "bg-white text-black font-extrabold shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          <Terminal className="size-3" /> Output Terminal
                        </button>

                        <button
                          type="button"
                          onClick={() => setBottomCodeTab("stdin")}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                            bottomCodeTab === "stdin"
                              ? "bg-white text-black font-extrabold shadow-sm"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          <LogIn className="size-3" /> Custom Input (stdin)
                          {stdin.trim() && (
                            <span className="size-1.5 rounded-full bg-emerald-400"></span>
                          )}
                        </button>
                      </div>

                      {bottomCodeTab === "terminal" ? (
                        output && (
                          <button
                            type="button"
                            onClick={() => setOutput("")}
                            className="text-zinc-400 hover:text-white text-[10px] font-bold cursor-pointer"
                          >
                            Clear Output
                          </button>
                        )
                      ) : (
                        stdin && (
                          <button
                            type="button"
                            onClick={() => {
                              setStdin("");
                              broadcastCustomEvent("STDIN_CHANGE", { stdin: "" });
                            }}
                            className="text-zinc-400 hover:text-white text-[10px] font-bold cursor-pointer"
                          >
                            Clear Input
                          </button>
                        )
                      )}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 min-h-0 overflow-y-auto p-3 font-mono text-xs">
                      {bottomCodeTab === "terminal" ? (
                        <pre className="whitespace-pre-wrap leading-relaxed text-zinc-100">
                          {output || '// Press "Run Code" above to execute and see console output here...'}
                        </pre>
                      ) : (
                        <div className="h-full flex flex-col gap-1.5">
                          <textarea
                            value={stdin}
                            onChange={(e) => handleStdinChange(e.target.value)}
                            placeholder="Provide program inputs here (one per line, e.g. for input(), cin >>, Scanner, scanf)..."
                            className="flex-1 min-h-0 w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-white placeholder:text-zinc-600 leading-relaxed"
                          />
                          <span className="text-[10px] text-zinc-500 font-sans shrink-0">
                            💡 Inputs typed here are shared live and automatically passed as standard input (<code>stdin</code>) when you click <strong>Run Code</strong>.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  TAB 2: INTERACTIVE WHITEBOARD CANVAS
                  ══════════════════════════════════════════════════ */}
              {activeTab === "whiteboard" && (
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative bg-black">
                  {/* Whiteboard Controls */}
                  <div className="h-14 p-3 bg-black border-b border-zinc-800 flex items-center justify-between gap-2 flex-wrap shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-400">Colors:</span>
                      {["#ffffff", "#a1a1aa", "#38bdf8", "#34d399", "#f87171", "#fbbf24"].map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            setBrushColor(color);
                            setIsEraser(false);
                          }}
                          className={`size-6 rounded-full border-2 transition-transform cursor-pointer ${
                            brushColor === color && !isEraser ? "scale-125 border-white shadow-md" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}

                      <button
                        type="button"
                        onClick={() => setIsEraser((prev) => !prev)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isEraser
                            ? "bg-white text-black border-white font-extrabold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
                        }`}
                      >
                        Eraser
                      </button>

                      {/* Brush Thickness */}
                      <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-xl border border-zinc-800">
                        {[2, 4, 8, 14].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setBrushSize(size)}
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                              brushSize === size ? "bg-white text-black font-black" : "text-zinc-400"
                            }`}
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Clear whiteboard"
                      >
                        <Trash2 className="size-3.5" /> Clear
                      </button>

                      <button
                        type="button"
                        onClick={downloadCanvas}
                        className="px-3 py-1 bg-white text-black rounded-xl text-xs font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer hover:bg-zinc-200"
                        title="Export drawing as PNG"
                      >
                        <Download className="size-3.5 text-black" /> Export
                      </button>
                    </div>
                  </div>

                  {/* HTML5 Canvas */}
                  <div className="flex-1 min-h-0 w-full h-full bg-black cursor-crosshair overflow-hidden relative">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full block bg-black"
                    />
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  TAB 3: LIVE SESSION NOTES
                  ══════════════════════════════════════════════════ */}
              {activeTab === "notes" && (
                <div className="flex-1 min-h-0 flex flex-col p-4 space-y-3 overflow-hidden bg-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-300">
                        Peer Meeting Notes & Vocab Scratchpad
                      </span>
                      <span className="text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                        Live Synced
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(notes);
                        toast.success("Notes copied to clipboard!");
                      }}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="size-3.5" /> Copy All
                    </button>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Write key vocabulary, explanations, or code logic discussed during the call here..."
                    className="flex-1 min-h-0 w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-white resize-none placeholder:text-zinc-600 leading-relaxed"
                  />
                </div>
              )}
          </div>
        )}
      </div>
    </StreamTheme>
  );
};

export default CallPage;
