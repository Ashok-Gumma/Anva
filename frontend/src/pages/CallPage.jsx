import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
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
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
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
  Laptop,
  ChevronsLeftRight,
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
    defaultCode: `fun main() {\n    println("🚀 Hello from Kotlin in Anva Call Session!")\n}`,
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
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let videoClient;
    let callInstance;

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
      if (callInstance) callInstance.leave().catch(console.error);
      if (videoClient) videoClient.disconnectUser().catch(console.error);
    };
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

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

const CustomCallControls = () => {
  const call = useCall();
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
    setOutput("⏳ Executing code on engine...");
    try {
      const data = await executeCompilerCode({
        language: selectedLang,
        version: CODE_LANGUAGES[selectedLang]?.version || "18.15.0",
        files: [{ content: codeContent }],
        stdin: stdin,
      });

      if (data?.run) {
        if (data.run.stderr) {
          setOutput(data.run.stderr + (data.run.stdout ? "\n" + data.run.stdout : ""));
        } else {
          setOutput(data.run.stdout || data.run.output || "Program exited with code 0 (no output).");
        }
      } else {
        setOutput(data?.output || data?.message || "Executed successfully.");
      }
    } catch (err) {
      setOutput(`❌ Execution error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    toast.success("Code copied to clipboard!");
  };

  const handleResetCode = () => {
    setCodeContent(CODE_LANGUAGES[selectedLang]?.defaultCode || "");
    setOutput("");
    toast.success("Code reset to template.");
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
          {hideVideo && <CustomCallControls />}

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
              <CustomCallControls />
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

                <button
                  type="button"
                  onClick={() => setWorkspaceOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
                  title="Close Workspace"
                >
                  <X className="size-4" />
                </button>
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
                        onChange={(e) => {
                          const lang = e.target.value;
                          setSelectedLang(lang);
                          setCodeContent(CODE_LANGUAGES[lang]?.defaultCode || "");
                        }}
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
                      onChange={(val) => setCodeContent(val || "")}
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
                            onClick={() => setStdin("")}
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
                            onChange={(e) => setStdin(e.target.value)}
                            placeholder="Provide program inputs here (one per line, e.g. for input(), cin >>, Scanner, scanf)..."
                            className="flex-1 min-h-0 w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs resize-none focus:outline-none focus:ring-1 focus:ring-white placeholder:text-zinc-600 leading-relaxed"
                          />
                          <span className="text-[10px] text-zinc-500 font-sans shrink-0">
                            💡 Inputs typed here are automatically passed as standard input (<code>stdin</code>) when you click <strong>Run Code</strong>.
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
                    <span className="text-xs font-bold text-zinc-300">
                      Peer Meeting Notes & Vocab Scratchpad
                    </span>
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
                    onChange={(e) => setNotes(e.target.value)}
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
