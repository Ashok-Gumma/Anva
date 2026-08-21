import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { axiosInstance } from "../lib/axios";
import {
  Send,
  X,
  BrainCircuit,
  Sparkles,
  Mic,
  Plus,
  Paperclip,
  Database,
  GitBranch,
  Code,
  Trash2,
  Search,
  Copy,
  Volume2,
  VolumeX,
  Award,
  RotateCcw,
  CheckCircle,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import AnvaBrandLogo from "../components/AnvaBrandLogo";
import { capitalize } from "../lib/utils";

// Quick prompt suggestions
const SUGGESTIONS = [
  {
    title: "React State & Lifecycle",
    prompt: "Explain how React state updating works under the hood and why state updates are asynchronous.",
    icon: Code,
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    title: "Python List Comprehensions",
    prompt: "Explain Python list comprehensions and write an example of filtering and mapping with an if-else statement.",
    icon: Code,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "SQL Joins Explained",
    prompt: "Can you explain the difference between INNER JOIN and LEFT JOIN with a simple database table example?",
    icon: Database,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  },
  {
    title: "BST Tree Traversal",
    prompt: "Show me a JavaScript recursive in-order traversal function for a Binary Search Tree and explain its complexity.",
    icon: GitBranch,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
];

// Historical mock doubt sessions
const INITIAL_MOCK_SESSIONS = [
  {
    id: "active",
    title: "Active Doubt Session",
    isCurrent: true,
    icon: Sparkles,
    date: "Current Session",
  },
  {
    id: "react-hook",
    title: "React Hooks State Bug",
    isCurrent: false,
    icon: Code,
    date: "2 hours ago",
    messages: [
      {
        role: "user",
        content:
          "Hey! Why is my React state not updating immediately after I call `setCount`? In my handler I call `setCount(count + 1)` and then `console.log(count)` prints the old value.",
      },
      {
        role: "assistant",
        content:
          "React's state setters (like `setCount`) do not immediately update the state in-place. Instead, they schedule a state transition.\n\nWhen you call `setCount(count + 1)`, React schedules a re-render with the new value, but the current execution context still holds the current state.\n\n### Solution\n\n1. **Use a local variable**:\n```javascript\nconst newCount = count + 1;\nsetCount(newCount);\nconsole.log(newCount);\n```\n\n2. **Use functional updater**:\n```javascript\nsetCount(prev => prev + 1);\n```",
      },
    ],
  },
  {
    id: "sql-joins",
    title: "SQL Joins Visualizer",
    isCurrent: false,
    icon: Database,
    date: "3 days ago",
    messages: [
      {
        role: "user",
        content:
          "I always get confused between LEFT JOIN and INNER JOIN. Can you explain the difference with a clear example?",
      },
      {
        role: "assistant",
        content:
          "Here is a simple breakdown:\n\n- **INNER JOIN**: Returns only matching rows in both tables.\n- **LEFT JOIN**: Returns all rows from the left table, with matching right table rows (or NULL).",
      },
    ],
  },
];

// Helper to format code blocks & backticks in assistant messages
const formatMessageContent = (text) => {
  if (!text) return "";
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : "";
      const code = match ? match[2] : part.slice(3, -3);
      return (
        <div
          key={index}
          className="my-3 rounded-2xl overflow-hidden border border-base-content/10 bg-base-300/90 text-left font-mono shadow-sm"
        >
          {language && (
            <div className="bg-base-300 px-4 py-2 text-[10px] font-extrabold text-base-content/70 uppercase border-b border-base-content/10 flex justify-between items-center tracking-wider">
              <span>{language}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(code.trim());
                  toast.success("Code copied to clipboard!");
                }}
                className="hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-base-content font-mono">
            <code>{code.trim()}</code>
          </pre>
        </div>
      );
    }

    const inlineParts = part.split(/(`[^`\n]+`)/g);
    return (
      <span key={index}>
        {inlineParts.map((subPart, subIndex) => {
          if (subPart.startsWith("`") && subPart.endsWith("`")) {
            return (
              <code
                key={subIndex}
                className="px-1.5 py-0.5 rounded-md bg-base-300 text-primary font-mono text-xs border border-base-content/10 font-bold"
              >
                {subPart.slice(1, -1)}
              </code>
            );
          }
          return subPart;
        })}
      </span>
    );
  });
};

// Pronunciation Coach Practice Dataset by Language
const PRACTICE_PHRASES = {
  spanish: [
    { phrase: "Hola, ¿cómo estás hoy? Me encanta aprender idiomas con Anva.", phonetic: "OH-lah, KOH-moh ess-TAHS oy? meh en-KAHN-tah ah-pren-DAIR ee-DYOH-mahs...", translation: "Hello, how are you today? I love learning languages with Anva." },
    { phrase: "El éxito es la suma de pequeños esfuerzos repetidos cada día.", phonetic: "el EK-see-toh ess lah SOO-mah deh peh-KAY-nyohs ess-FWAIRe-sohs...", translation: "Success is the sum of small efforts repeated every day." },
    { phrase: "La práctica constante hace al maestro.", phonetic: "lah PRAHK-tee-kah kohn-STAHN-teh AH-say ahl my-ESS-troh.", translation: "Constant practice makes the master." },
  ],
  french: [
    { phrase: "Bonjour ! Comment allez-vous aujourd'hui ?", phonetic: "bohn-ZHOOR ! koh-mahn tah-lay VOO oh-zhoor-DWEE ?", translation: "Hello! How are you today?" },
    { phrase: "La pratique régulière mène toujours au succès.", phonetic: "lah prah-TEEK ray-gyoo-LYAIR mayn too-ZHOOR oh sook-SEH.", translation: "Regular practice always leads to success." },
  ],
  german: [
    { phrase: "Guten Tag! Ich freue mich, heute Deutsch zu üben.", phonetic: "GOO-ten tahk! ikh FROY-eh mikh, HOY-teh DOYTCH tsoo OO-ben.", translation: "Good day! I am happy to practice German today." },
    { phrase: "Übung macht den Meister.", phonetic: "OO-boong mahkht dayn MYS-ter.", translation: "Practice makes master." },
  ],
  japanese: [
    { phrase: "こんにちは、お元気ですか？今日も一緒に勉強しましょう。", phonetic: "Konnichiwa, o-genki desu ka? Kyou mo issho ni benkyou shimashou.", translation: "Hello, how are you? Let's study together today too." },
    { phrase: "継続は力なり。", phonetic: "Keizoku wa chikara nari.", translation: "Continuity is strength." },
  ],
  default: [
    { phrase: "Hello! Practice makes perfect, and consistency is the key to mastery.", phonetic: "heh-LOH! PRAK-tis mayks PUR-fikt, and kahn-SIS-tuhn-see is kee...", translation: "Practice and consistency lead to mastery." },
    { phrase: "Writing clean code and collaborating with peers accelerates learning.", phonetic: "RY-ting kleen kohd and kuh-LAB-er-ay-ting ak-SEL-er-ayts LUR-ning.", translation: "Clean code and collaboration speed up growth." },
  ],
};

const getSpeechLangCode = (langName) => {
  if (!langName) return "en-US";
  const name = langName.toLowerCase();
  if (name.includes("spanish")) return "es-ES";
  if (name.includes("french")) return "fr-FR";
  if (name.includes("german")) return "de-DE";
  if (name.includes("japanese")) return "ja-JP";
  if (name.includes("italian")) return "it-IT";
  if (name.includes("portuguese")) return "pt-BR";
  if (name.includes("russian")) return "ru-RU";
  if (name.includes("chinese") || name.includes("mandarin")) return "zh-CN";
  if (name.includes("arabic")) return "ar-SA";
  if (name.includes("hindi")) return "hi-IN";
  if (name.includes("korean")) return "ko-KR";
  return "en-US";
};

const AssistantPage = () => {
  const { authUser } = useAuthUser();
  const [dbMessages, setDbMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);

  // Pronunciation Coach State
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [coachPhraseIndex, setCoachPhraseIndex] = useState(0);
  const [customCoachPhrase, setCustomCoachPhrase] = useState("");
  const [isCoachRecording, setIsCoachRecording] = useState(false);
  const [coachSpokenText, setCoachSpokenText] = useState("");
  const [coachScore, setCoachScore] = useState(null);
  const [coachFeedback, setCoachFeedback] = useState("");

  const [sessions, setSessions] = useState(() => {
    try {
      const deletedIds = JSON.parse(localStorage.getItem("anva_assistant_deleted_sessions") || "[]");
      return INITIAL_MOCK_SESSIONS.filter((s) => !deletedIds.includes(s.id));
    } catch {
      return INITIAL_MOCK_SESSIONS;
    }
  });

  const [selectedSessionId, setSelectedSessionId] = useState("active");

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const coachRecognitionRef = useRef(null);

  // Active target phrases for the user's learning language
  const targetLanguageKey = (authUser?.learningLanguage || "default").toLowerCase();
  const activePracticePhrases = PRACTICE_PHRASES[targetLanguageKey] || PRACTICE_PHRASES.default;
  const currentPracticePhrase = customCoachPhrase || activePracticePhrases[coachPhraseIndex % activePracticePhrases.length]?.phrase || activePracticePhrases[0].phrase;
  const currentPracticeItem = activePracticePhrases[coachPhraseIndex % activePracticePhrases.length] || activePracticePhrases[0];

  // Speech-to-Speech Playback handler
  const handleSpeakMessage = (content, index) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Speech playback is not supported on this device.");
      return;
    }
    if (speakingMsgIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = content.replace(/[`*_~#]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = getSpeechLangCode(authUser?.learningLanguage);
    utterance.rate = 0.92;
    utterance.onend = () => setSpeakingMsgIndex(null);
    utterance.onerror = () => setSpeakingMsgIndex(null);
    setSpeakingMsgIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakCoachPhrase = (phraseText) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Speech playback is not supported.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phraseText);
    utterance.lang = getSpeechLangCode(authUser?.learningLanguage);
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  };

  // Pronunciation Evaluation Algorithm
  const evaluatePronunciation = (target, spoken) => {
    const normalize = (str) =>
      str
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'¡¿]/g, "")
        .trim()
        .split(/\s+/);

    const targetWords = normalize(target);
    const spokenWords = normalize(spoken);

    if (spokenWords.length === 0 || !spokenWords[0]) {
      setCoachScore(0);
      setCoachFeedback("No speech detected. Please speak clearly into your microphone.");
      return;
    }

    let matches = 0;
    targetWords.forEach((word) => {
      if (spokenWords.includes(word)) matches++;
    });

    const calculatedScore = Math.min(100, Math.round((matches / targetWords.length) * 100));
    setCoachScore(calculatedScore);

    if (calculatedScore >= 90) {
      setCoachFeedback("🌟 Excellent pronunciation! Clear phonetic pacing and native rhythm.");
    } else if (calculatedScore >= 70) {
      setCoachFeedback("👍 Great effort! Good flow. Listen to the native audio and practice key vowel stress.");
    } else {
      setCoachFeedback("💡 Keep going! Try breaking down the sentence into shorter word groups.");
    }
  };

  // Fetch live active chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/assistant/history");
        if (res.data && res.data.length > 0) {
          setDbMessages(res.data);
        } else {
          setDbMessages([
            {
              role: "assistant",
              content: `Hello ${authUser?.fullName || ""}! 👋 I am your AI Study Assistant. What concept or code question can I help you clear today?`,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load assistant history:", err);
        setDbMessages([
          {
            role: "assistant",
            content: "Hello! 👋 I am your AI Study Assistant. What question can I help you with today?",
          },
        ]);
      }
    };
    fetchHistory();
  }, [authUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages, loading, selectedSessionId]);

  const clearHistory = async () => {
    try {
      await axiosInstance.delete("/assistant/history");
      setDbMessages([
        {
          role: "assistant",
          content: "Hello! 👋 I am your AI Study Assistant. What question can I help you with today?",
        },
      ]);

      const allMockIds = INITIAL_MOCK_SESSIONS.filter((s) => s.id !== "active").map((s) => s.id);
      localStorage.setItem("anva_assistant_deleted_sessions", JSON.stringify(allMockIds));
      setSessions(INITIAL_MOCK_SESSIONS.filter((s) => s.id === "active"));
      setSelectedSessionId("active");

      toast.success("Chat history cleared!");
    } catch (err) {
      console.error("Failed to clear history:", err);
      toast.error("Failed to clear chat history.");
    }
  };

  // Voice Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined" && (window.webkitSpeechRecognition || window.SpeechRecognition)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const toggleCoachRecording = () => {
    if (typeof window === "undefined" || (!window.webkitSpeechRecognition && !window.SpeechRecognition)) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isCoachRecording) {
      if (coachRecognitionRef.current) coachRecognitionRef.current.stop();
      setIsCoachRecording(false);
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const coachRec = new SpeechRecognition();
    coachRec.continuous = false;
    coachRec.interimResults = false;
    coachRec.lang = getSpeechLangCode(authUser?.learningLanguage);

    coachRec.onstart = () => {
      setIsCoachRecording(true);
      setCoachSpokenText("");
      setCoachScore(null);
      setCoachFeedback("");
    };

    coachRec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCoachSpokenText(transcript);
      evaluatePronunciation(currentPracticePhrase, transcript);
      setIsCoachRecording(false);
    };

    coachRec.onerror = (e) => {
      console.error("Coach recognition error:", e);
      setIsCoachRecording(false);
      toast.error("Could not capture speech. Please speak closer to the mic.");
    };

    coachRec.onend = () => {
      setIsCoachRecording(false);
    };

    coachRecognitionRef.current = coachRec;
    coachRec.start();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    if (selectedSessionId !== "active") {
      toast.error("This is an archived session. Click 'New Doubt' to ask live questions.");
      return;
    }

    const userMessage = {
      role: "user",
      content: input.trim(),
      image: imagePreview,
    };

    setDbMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    const currentImage = imagePreview;

    setInput("");
    removeImage();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/assistant/chat", {
        message: currentInput,
        image: currentImage,
      });

      const reply = res.data.reply || "No reply from assistant.";
      setDbMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Assistant error:", err);
      setDbMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error connecting to AI assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDoubt = async () => {
    setSelectedSessionId("active");
    setMobileMenuOpen(false);

    if (dbMessages.length <= 1) {
      toast.success("Ready for a new session!");
      return;
    }

    try {
      await axiosInstance.delete("/assistant/history");
      setDbMessages([
        {
          role: "assistant",
          content: `Hello ${authUser?.fullName || ""}! 👋 How can I assist your learning today?`,
        },
      ]);
      toast.success("Started a new doubt session!");
    } catch {
      setDbMessages([
        {
          role: "assistant",
          content: "Hello! 👋 How can I assist your learning today?",
        },
      ]);
    }
  };

  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    setMobileMenuOpen(false);
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    if (id === "active") {
      clearHistory();
      return;
    }

    setSessions((prev) => prev.filter((s) => s.id !== id));
    try {
      const deletedIds = JSON.parse(localStorage.getItem("anva_assistant_deleted_sessions") || "[]");
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem("anva_assistant_deleted_sessions", JSON.stringify(deletedIds));
      }
    } catch (err) {
      console.error("Failed to store deleted session:", err);
    }

    if (selectedSessionId === id) setSelectedSessionId("active");
    toast.success("Thread deleted.");
  };

  const handleSuggestionClick = (prompt) => {
    if (selectedSessionId !== "active") setSelectedSessionId("active");
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => s.title?.toLowerCase().includes(q));
  }, [sessions, searchQuery]);

  // Clean User Avatar
  const UserAvatar = () => {
    const initials = authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : "U";
    return (
      <div className="size-9 rounded-2xl bg-secondary text-secondary-content flex items-center justify-center font-bold text-xs border border-base-content/10 shadow-sm overflow-hidden shrink-0">
        {authUser?.profilePic ? (
          <img src={authUser.profilePic} alt="User Avatar" className="size-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  };

  // Modern AI Assistant Badge
  const AssistantAvatar = () => {
    return (
      <div className="size-9 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent text-white flex items-center justify-center shadow-md border border-white/20 shrink-0">
        <Sparkles className="size-4 text-white fill-white/20" />
      </div>
    );
  };

  const activeMessages =
    selectedSessionId === "active"
      ? dbMessages
      : sessions.find((s) => s.id === selectedSessionId)?.messages || [];

  const isNewChat = selectedSessionId === "active" && dbMessages.length <= 1;

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-base-100 w-full select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-base-content/10 bg-base-100 shrink-0 font-minimal">
        <div className="flex items-center justify-between mb-3.5">
          <AnvaBrandLogo badgeSize="size-9" textSize="text-xl" />
          {mobileMenuOpen && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* New Doubt Button */}
        <button
          type="button"
          onClick={handleNewDoubt}
          className="w-full py-2.5 bg-primary text-primary-content text-xs font-bold uppercase tracking-wider rounded-2xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mb-3"
        >
          <Plus className="size-4 stroke-[2.5]" />
          New Doubt Session
        </button>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search doubt history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-base-200/60 border border-base-content/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 font-medium text-base-content placeholder:text-base-content/40 transition-all"
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar font-minimal">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em]">
            Doubt Sessions
          </h2>
          <span className="text-[10px] font-mono text-base-content/40">{filteredSessions.length}</span>
        </div>

        {filteredSessions.length === 0 ? (
          <p className="text-xs text-base-content/40 text-center py-6 font-medium">No sessions found</p>
        ) : (
          filteredSessions.map((sess) => {
            const isSelected = selectedSessionId === sess.id;
            const SessIcon = sess.icon || Code;

            return (
              <div
                key={sess.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectSession(sess.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectSession(sess.id);
                  }
                }}
                className={`w-full p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between text-left group relative ${
                  isSelected
                    ? "bg-primary/10 border-primary/30 text-primary shadow-xs"
                    : "bg-base-100 border-base-content/5 text-base-content hover:bg-base-200/70 hover:border-base-content/10 active:scale-[0.98]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content/60 group-hover:text-base-content"
                    }`}
                  >
                    <SessIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${isSelected ? "text-primary" : "text-base-content"}`}>
                      {sess.title}
                    </p>
                    <p className="text-[9px] text-base-content/40 uppercase font-semibold">
                      {sess.date}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => deleteSession(sess.id, e)}
                  className="p-1.5 text-base-content/40 hover:text-error hover:bg-error/10 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100 cursor-pointer ml-1 shrink-0"
                  title="Remove session"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100dvh-4rem)] bg-base-200 text-base-content overflow-hidden font-minimal w-full">
      {/* Desktop Sidebar */}
      <aside className="w-80 border-r border-base-content/10 bg-base-100 hidden md:flex flex-col shrink-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Slide-in Drawer via Portal (escapes all stacking/overflow constraints) */}
      {createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100dvh",
                  backgroundColor: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(4px)",
                  zIndex: 99998,
                  cursor: "pointer",
                }}
              />

              {/* Drawer Sheet */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "320px",
                  maxWidth: "85vw",
                  height: "100dvh",
                  zIndex: 99999,
                  overflowY: "auto",
                }}
                className="bg-base-100 border-r border-base-content/15 shadow-2xl flex flex-col"
              >
                {renderSidebarContent()}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative chat-wallpaper w-full overflow-hidden">

        {/* Sticky Chat Header */}
        <header className="px-3 sm:px-6 py-3 bg-base-100/95 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-25 w-full shrink-0 flex items-center justify-between min-h-[64px] font-minimal gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-extrabold tracking-wide transition-all cursor-pointer shadow-2xs"
              title="Open Doubt Sessions Sidebar"
            >
              <BrainCircuit className="size-4" />
              <span>Sessions</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/80">
                {selectedSessionId === "active" ? "AI Assistant (Online)" : "Archived Session"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCoachModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 hover:from-primary/25 hover:to-accent/25 border border-primary/30 text-primary rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs hover:scale-102 transition-all cursor-pointer"
              title="Open Pronunciation & Speaking Coach"
            >
              <Award className="size-4 text-primary" />
              <span className="hidden sm:inline">Pronunciation Coach</span>
              <span className="sm:hidden">Coach</span>
            </button>

            <button
              type="button"
              onClick={clearHistory}
              className="px-3 py-1.5 bg-base-200 hover:bg-error/10 hover:text-error hover:border-error/30 border border-base-content/10 rounded-xl text-xs font-bold text-base-content transition-all cursor-pointer flex items-center gap-1.5"
              title="Clear Active Chat"
            >
              <Trash2 className="size-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>
        </header>

        {/* Chat Feed Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 scrollbar-thin relative pb-36 font-minimal">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            {/* Welcome Screen */}
            {isNewChat && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-10 md:py-14 px-4"
              >
                <div className="size-16 rounded-3xl bg-gradient-to-tr from-primary via-secondary to-accent text-white flex items-center justify-center shadow-xl border border-white/20 mb-5">
                  <Sparkles className="size-8 text-white fill-white/20" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-base-content tracking-tight mb-2">
                  How can I help you <span className="font-curly italic text-primary font-bold">study today?</span>
                </h2>
                <p className="text-xs md:text-sm text-base-content/60 font-medium max-w-md mb-8 leading-relaxed">
                  Ask study questions, clarify code concepts, check grammar, or get help with assignments.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl">
                  {SUGGESTIONS.map((sug, idx) => {
                    const SugIcon = sug.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(sug.prompt)}
                        className="p-4 rounded-2xl bg-base-100 border border-base-content/10 hover:border-primary/40 hover:bg-base-200/60 hover:-translate-y-0.5 hover:shadow-md transition-all text-left flex gap-3 group cursor-pointer"
                      >
                        <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 border ${sug.color}`}>
                          <SugIcon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-base-content group-hover:text-primary transition-colors">
                            {sug.title}
                          </h4>
                          <p className="text-[11px] text-base-content/60 font-medium mt-0.5 line-clamp-2 leading-relaxed">
                            {sug.prompt}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Chat Messages */}
            {!isNewChat && (
              <AnimatePresence initial={false}>
                {activeMessages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 sm:gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {isUser ? <UserAvatar /> : <AssistantAvatar />}

                      <div className={`flex flex-col max-w-[85%] sm:max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                        <div
                          className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm transition-all text-left ${
                            isUser
                              ? "bg-primary text-primary-content rounded-tr-none"
                              : "bg-base-100 border border-base-content/10 text-base-content rounded-tl-none"
                          }`}
                        >
                          {msg.image && (
                            <div className="mb-3 rounded-2xl overflow-hidden border border-base-content/10 max-h-64">
                              <img src={msg.image} alt="Attached Context" className="max-h-64 w-auto object-cover" />
                            </div>
                          )}
                          <div className="whitespace-pre-wrap font-medium">
                            {formatMessageContent(msg.content)}
                          </div>
                        </div>

                        {!isUser ? (
                          <div className="flex items-center gap-2 mt-1 px-2">
                            <button
                              type="button"
                              onClick={() => handleSpeakMessage(msg.content, index)}
                              className="text-[10px] font-bold text-base-content/60 hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                              title={speakingMsgIndex === index ? "Stop Speaking" : "Listen to audio pronunciation"}
                            >
                              {speakingMsgIndex === index ? (
                                <>
                                  <VolumeX className="size-3 text-error" />
                                  <span className="text-error font-extrabold">Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="size-3 text-primary" />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>
                            <span className="text-[10px] text-base-content/30">•</span>
                            <span className="text-[10px] font-bold text-base-content/40 uppercase">Anva AI</span>
                          </div>
                        ) : (
                          <span className="mt-1 px-2 text-[10px] font-bold text-base-content/40 uppercase">
                            {authUser?.fullName || "You"}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {/* Loading Indicator */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
                <AssistantAvatar />
                <div className="p-3.5 rounded-2xl bg-base-100 border border-base-content/10 shadow-sm flex items-center gap-2 text-xs font-bold text-base-content/60">
                  <Sparkles className="w-4 h-4 text-primary animate-spin" />
                  <span>Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        </main>

        {/* Floating Capsule Bottom Input Area */}
        <footer className="w-full bg-gradient-to-t from-base-100 via-base-100/70 to-transparent pt-6 pb-safe px-4 absolute bottom-0 left-0 right-0 z-10 pointer-events-none font-minimal" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)' }}>
          <div className="max-w-3xl mx-auto pointer-events-auto relative">
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 10 }}
                  className="absolute -top-20 left-0 p-2.5 bg-base-100 border border-base-content/20 rounded-2xl flex items-center gap-3 z-20 shadow-xl"
                >
                  <img src={imagePreview} alt="Preview" className="size-12 object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1 bg-error text-white rounded-full hover:scale-105 cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative border border-base-content/10 rounded-3xl bg-base-100/95 backdrop-blur-md transition-all focus-within:ring-2 focus-within:ring-primary/40 shadow-xl p-2 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-base-content/60 hover:text-primary hover:bg-base-200 rounded-2xl transition-colors cursor-pointer shrink-0"
                title="Attach screenshot or image"
              >
                <Paperclip className="size-5" />
              </button>

              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
                  isRecording
                    ? "bg-error text-white animate-pulse"
                    : "text-base-content/60 hover:text-primary hover:bg-base-200"
                }`}
                title={isRecording ? "Listening... click to stop" : "Voice dictation"}
              >
                <Mic className="size-5" />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask Anva AI any study question or code doubt..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 px-2 py-2 bg-transparent text-base-content text-xs sm:text-sm font-medium focus:outline-none resize-none placeholder:text-base-content/40"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || (!input.trim() && !selectedImage)}
                className="btn btn-primary btn-circle btn-sm shrink-0 shadow-md cursor-pointer"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </footer>

        {/* ── PRONUNCIATION COACH MODAL VIA PORTAL ── */}
        {createPortal(
          <AnimatePresence>
            {showCoachModal && (
              <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCoachModal(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative bg-base-100 border border-base-content/15 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 overflow-hidden z-10 font-minimal"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-base-content/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-content flex items-center justify-center shadow-md">
                        <Award className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-base-content">
                          AI Pronunciation Coach
                        </h3>
                        <p className="text-[11px] text-base-content/60 font-semibold">
                          Target Language: {capitalize(authUser?.learningLanguage || "General")}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCoachModal(false)}
                      className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/70 transition-colors cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {/* Practice Phrase Card */}
                  <div className="p-5 bg-gradient-to-br from-base-200/90 to-base-200/40 border border-base-content/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                        Target Phrase #{((coachPhraseIndex % activePracticePhrases.length) + 1)}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCoachPhraseIndex((prev) => prev + 1);
                          setCustomCoachPhrase("");
                          setCoachSpokenText("");
                          setCoachScore(null);
                          setCoachFeedback("");
                        }}
                        className="px-2.5 py-1 bg-base-100 hover:bg-base-200 border border-base-content/10 rounded-xl text-[10px] font-bold text-base-content/70 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <RotateCcw className="size-3" /> Next Phrase
                      </button>
                    </div>

                    <p className="text-base sm:text-lg font-black text-base-content leading-snug">
                      "{currentPracticePhrase}"
                    </p>

                    {currentPracticeItem.phonetic && !customCoachPhrase && (
                      <p className="text-xs text-primary font-mono bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                        🗣️ <span className="font-semibold">{currentPracticeItem.phonetic}</span>
                      </p>
                    )}

                    {currentPracticeItem.translation && !customCoachPhrase && (
                      <p className="text-xs text-base-content/60 italic font-medium">
                        "{currentPracticeItem.translation}"
                      </p>
                    )}

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSpeakCoachPhrase(currentPracticePhrase)}
                        className="btn btn-sm btn-outline btn-primary rounded-xl font-bold gap-1.5"
                      >
                        <Volume2 className="size-4" /> Listen Native
                      </button>
                    </div>
                  </div>

                  {/* Speech Recording & Feedback Section */}
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-6 bg-base-200/40 border border-dashed border-base-content/15 rounded-2xl text-center space-y-3">
                      <button
                        type="button"
                        onClick={toggleCoachRecording}
                        className={`size-16 rounded-3xl flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                          isCoachRecording
                            ? "bg-error text-white scale-110 animate-pulse ring-4 ring-error/30"
                            : "bg-primary text-primary-content hover:scale-105"
                        }`}
                      >
                        <Mic className="size-7" />
                      </button>
                      <p className="text-xs font-extrabold text-base-content">
                        {isCoachRecording ? "Listening to your pronunciation... Speak now!" : "Tap microphone and speak the sentence aloud"}
                      </p>
                    </div>

                    {/* Detected Speech & Score */}
                    {coachSpokenText && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-base-100 border border-base-content/10 rounded-2xl space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/50">
                            We Heard:
                          </span>
                          {coachScore !== null && (
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                              coachScore >= 85
                                ? "bg-success/15 text-success border border-success/30"
                                : coachScore >= 65
                                ? "bg-warning/15 text-warning border border-warning/30"
                                : "bg-error/15 text-error border border-error/30"
                            }`}>
                              {coachScore}% Accuracy
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-base-content">
                          "{coachSpokenText}"
                        </p>
                        {coachFeedback && (
                          <p className="text-xs font-medium text-base-content/80 pt-1 border-t border-base-content/5">
                            {coachFeedback}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </div>
  );
};

export default AssistantPage;
