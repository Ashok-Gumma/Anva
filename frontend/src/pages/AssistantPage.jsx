import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { axiosInstance } from "../lib/axios";
import { streamAssistantChat } from "../lib/api";
import {
  Send,
  X,
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
  BookOpen,
  Terminal,
  Layers,
  ChevronRight,
  FileText,
  Clock,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useAuthUser from "../hooks/useAuthUser";
import { capitalize } from "../lib/utils";

// Notion-style Quick Command suggestions
const NOTION_COMMANDS = [
  {
    cmd: "/explain",
    label: "Explain Concept",
    desc: "Break down complex topics with analogies",
    prompt: "Can you explain how [topic] works with a simple step-by-step intuition and real-world analogy?",
    icon: BookOpen,
  },
  {
    cmd: "/code",
    label: "Write Solution",
    desc: "Generate clean, production-grade code",
    prompt: "Write a clean, optimized implementation in JavaScript / Python for [problem] with time & space complexity analysis.",
    icon: Code,
  },
  {
    cmd: "/debug",
    label: "Debug Code",
    desc: "Find and fix bugs in your code snippet",
    prompt: "Here is my code snippet with a bug. Can you analyze what is wrong and show the fixed version?\n\n```\n// paste code here\n```",
    icon: Terminal,
  },
  {
    cmd: "/sql",
    label: "SQL Query",
    desc: "Design database queries and schemas",
    prompt: "Explain how to write an efficient SQL query for [use case] including indexing tips.",
    icon: Database,
  },
  {
    cmd: "/summarize",
    label: "Summarize Notes",
    desc: "Condense long text into key takeaways",
    prompt: "Please summarize the following study material into structured bullet points with key formulas and takeaways:\n\n",
    icon: FileText,
  },
];

// Quick prompt suggestions for blank page
const SUGGESTIONS = [
  {
    title: "React State & Lifecycle",
    prompt: "Explain how React state updating works under the hood and why state updates are asynchronous.",
    icon: Code,
    category: "Frontend",
  },
  {
    title: "Python List Comprehensions",
    prompt: "Explain Python list comprehensions and write an example of filtering and mapping with an if-else statement.",
    icon: Code,
    category: "Python",
  },
  {
    title: "SQL Joins Explained",
    prompt: "Can you explain the difference between INNER JOIN and LEFT JOIN with a simple database table example?",
    icon: Database,
    category: "Databases",
  },
  {
    title: "Binary Tree Traversal",
    prompt: "Show me a recursive in-order and level-order traversal function for a Binary Tree and explain its complexity.",
    icon: GitBranch,
    category: "DSA",
  },
];

// Historical mock doubt sessions
const INITIAL_MOCK_SESSIONS = [
  {
    id: "active",
    title: "Active Doubt Session",
    isCurrent: true,
    icon: Sparkles,
    date: "Just now",
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
          "Why is my React state not updating immediately after I call `setCount`? In my handler I call `setCount(count + 1)` and then `console.log(count)` prints the old value.",
      },
      {
        role: "assistant",
        content:
          "React's state setters (like `setCount`) do not immediately update the state in-place. Instead, they schedule a state transition.\n\nWhen you call `setCount(count + 1)`, React schedules a re-render with the new value, but the current execution context still holds the current state.\n\n### 💡 Key Takeaways\n\n1. **Use a local variable**:\n```javascript\nconst newCount = count + 1;\nsetCount(newCount);\nconsole.log(newCount);\n```\n\n2. **Use functional updater**:\n```javascript\nsetCount(prev => prev + 1);\n```",
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

// Rich Notion-style Markdown & Code renderer
const MarkdownContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="markdown-content text-xs sm:text-sm leading-relaxed text-base-content/90 space-y-3 font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1({ children }) {
            return (
              <h1 className="text-lg sm:text-xl font-black text-base-content tracking-tight mt-5 mb-2 pb-1 border-b border-base-content/10 flex items-center gap-2">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-base sm:text-lg font-extrabold text-base-content tracking-tight mt-4 mb-1.5 flex items-center gap-1.5">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-sm sm:text-base font-bold text-base-content tracking-tight mt-3 mb-1">
                {children}
              </h3>
            );
          },
          p({ children }) {
            return <p className="my-2 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-outside my-2 space-y-1 pl-5 text-base-content/90">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-outside my-2 space-y-1 pl-5 text-base-content/90">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return <li className="leading-relaxed pl-1">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-3 border-primary bg-base-200/60 px-4 py-2.5 my-3 rounded-r-2xl italic text-base-content/85 text-xs sm:text-sm">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-3.5 overflow-x-auto rounded-2xl border border-base-content/15 bg-base-100 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="bg-base-200/90 px-3.5 py-2.5 font-bold text-base-content uppercase tracking-wider text-[11px] border-b border-base-content/15">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-3.5 py-2.5 border-b border-base-content/10 text-base-content/90 text-xs">
                {children}
              </td>
            );
          },
          hr() {
            return <hr className="my-4 border-base-content/15" />;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold underline hover:text-primary-focus transition-colors"
              >
                {children}
              </a>
            );
          },
          strong({ children }) {
            return <strong className="font-bold text-base-content">{children}</strong>;
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");

            if (!inline && (match || codeString.includes("\n") || codeString.length > 50)) {
              return (
                <div className="my-3.5 rounded-2xl overflow-hidden border border-base-content/15 bg-base-300/80 text-left font-mono shadow-sm">
                  {/* Notion-style Code Header Bar */}
                  <div className="bg-base-300/90 px-4 py-2 text-[10px] font-extrabold text-base-content/70 uppercase border-b border-base-content/10 flex justify-between items-center tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Code className="size-3 text-primary" />
                      <span>{lang || "code"}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(codeString);
                        toast.success("Code copied to clipboard!");
                      }}
                      className="hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1 bg-base-100/80 hover:bg-base-100 px-2 py-0.5 rounded-md border border-base-content/10"
                    >
                      <Copy className="size-3" /> Copy
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-base-content font-mono">
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded-md bg-base-300/90 text-primary font-mono text-[11px] sm:text-xs border border-base-content/10 font-bold"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Pronunciation Coach Practice Dataset
const PRACTICE_PHRASES = {
  spanish: [
    { phrase: "Hola, ¿cómo estás hoy? Me encanta aprender idiomas con Anva.", phonetic: "OH-lah, KOH-moh ess-TAHS oy? meh en-KAHN-tah ah-pren-DAIR ee-DYOH-mahs...", translation: "Hello, how are you today? I love learning languages with Anva." },
    { phrase: "El éxito es la suma de pequeños esfuerzos repetidos cada día.", phonetic: "el EK-see-toh ess lah SOO-mah deh peh-KAY-nyohs ess-FWAIRe-sohs...", translation: "Success is the sum of small efforts repeated every day." },
  ],
  french: [
    { phrase: "Bonjour ! Comment allez-vous aujourd'hui ?", phonetic: "bohn-ZHOOR ! koh-mahn tah-lay VOO oh-zhoor-DWEE ?", translation: "Hello! How are you today?" },
    { phrase: "La pratique régulière mène toujours au succès.", phonetic: "lah prah-TEEK ray-gyoo-LYAIR mayn too-ZHOOR oh sook-SEH.", translation: "Regular practice always leads to success." },
  ],
  german: [
    { phrase: "Guten Tag! Ich freue mich, heute Deutsch zu üben.", phonetic: "GOO-ten tahk! ikh FROY-eh mikh, HOY-teh DOYTCH tsoo OO-ben.", translation: "Good day! I am happy to practice German today." },
  ],
  japanese: [
    { phrase: "こんにちは、お元気ですか？今日も一緒に勉強しましょう。", phonetic: "Konnichiwa, o-genki desu ka? Kyou mo issho ni benkyou shimashou.", translation: "Hello, how are you? Let's study together today too." },
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
  if (name.includes("chinese")) return "zh-CN";
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

  const targetLanguageKey = (authUser?.learningLanguage || "default").toLowerCase();
  const activePracticePhrases = PRACTICE_PHRASES[targetLanguageKey] || PRACTICE_PHRASES.default;
  const currentPracticePhrase = customCoachPhrase || activePracticePhrases[coachPhraseIndex % activePracticePhrases.length]?.phrase || activePracticePhrases[0].phrase;
  const currentPracticeItem = activePracticePhrases[coachPhraseIndex % activePracticePhrases.length] || activePracticePhrases[0];

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

  // Fetch chat history on mount
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
              content: `Hello ${authUser?.fullName || ""}! 👋 I am your AI Study Workspace Assistant. What concept or code doubt can I help you break down today?`,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load assistant history:", err);
        setDbMessages([
          {
            role: "assistant",
            content: "Hello! 👋 I am your AI Study Assistant. What doubt or coding challenge can I help you solve today?",
          },
        ]);
      }
    };
    fetchHistory();
  }, [authUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages, loading, selectedSessionId]);

  // Voice recording
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLangCode(authUser?.learningLanguage);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      toast.error("Could not capture speech. Please try again.");
    };
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Coach Voice Recording
  const toggleCoachRecording = () => {
    if (isCoachRecording) {
      coachRecognitionRef.current?.stop();
      setIsCoachRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLangCode(authUser?.learningLanguage);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsCoachRecording(true);
      setCoachSpokenText("");
      setCoachScore(null);
      setCoachFeedback("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCoachSpokenText(transcript);
      evaluatePronunciation(currentPracticePhrase, transcript);
    };

    recognition.onerror = (event) => {
      console.error("Coach speech error:", event.error);
      setIsCoachRecording(false);
      toast.error("Speech error. Try speaking closer to the microphone.");
    };

    recognition.onend = () => setIsCoachRecording(false);
    coachRecognitionRef.current = recognition;
    recognition.start();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPEG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear this workspace chat history?")) return;
    try {
      await axiosInstance.delete("/assistant/history");
      setDbMessages([
        {
          role: "assistant",
          content: `Workspace cleared! ✨ How can I assist your study today, ${authUser?.fullName || ""}?`,
        },
      ]);
      toast.success("Active session history cleared.");
    } catch {
      toast.error("Failed to clear chat history.");
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    if (selectedSessionId !== "active") {
      setSelectedSessionId("active");
    }

    const currentInput = input.trim();
    const currentImage = selectedImage;

    const userMessage = {
      role: "user",
      content: currentInput,
      image: currentImage,
    };

    setDbMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setLoading(true);

    const assistantPlaceholder = {
      role: "assistant",
      content: "",
    };
    setDbMessages((prev) => [...prev, assistantPlaceholder]);

    let accumulatedReply = "";

    try {
      await streamAssistantChat(
        currentInput,
        currentImage,
        (token) => {
          accumulatedReply += token;
          setDbMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex]?.role === "assistant") {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: accumulatedReply,
              };
            }
            return updated;
          });
        },
        () => setLoading(false)
      );
    } catch (streamErr) {
      console.warn("SSE stream fallback to REST /assistant/chat:", streamErr);
      try {
        const res = await axiosInstance.post("/assistant/chat", {
          message: currentInput,
          image: currentImage,
        });

        const reply = res.data.reply || "No reply from assistant.";
        setDbMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex]?.role === "assistant") {
            updated[lastIndex] = { ...updated[lastIndex], content: reply };
          } else {
            updated.push({ role: "assistant", content: reply });
          }
          return updated;
        });
      } catch (err) {
        console.error("Assistant error:", err);
        setDbMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex]?.role === "assistant" && !accumulatedReply) {
            updated[lastIndex] = {
              role: "assistant",
              content: "❌ Error connecting to AI assistant. Please try again.",
            };
          }
          return updated;
        });
      }
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
          content: `Hello ${authUser?.fullName || ""}! 👋 Starting a fresh workspace page. What shall we learn?`,
        },
      ]);
      toast.success("Started a new doubt session!");
    } catch {
      setDbMessages([
        {
          role: "assistant",
          content: "Hello! 👋 Starting a fresh workspace page. What shall we learn?",
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
    toast.success("Page deleted from workspace.");
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

  const activeMessages =
    selectedSessionId === "active"
      ? dbMessages
      : sessions.find((s) => s.id === selectedSessionId)?.messages || [];

  const isNewChat = selectedSessionId === "active" && dbMessages.length <= 1;

  // ── NOTION-STYLE SIDEBAR COMPONENT ──
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-base-100 w-full select-none font-sans">
      {/* Workspace Header */}
      <div className="p-4 border-b border-base-content/10 bg-base-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-black text-base-content truncate uppercase tracking-wider">
                Anva Workspace
              </h2>
              <span className="text-[10px] text-base-content/50 font-bold block">
                AI Knowledge Hub
              </span>
            </div>
          </div>

          {mobileMenuOpen && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-base-content/60 hover:text-base-content hover:bg-base-200 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Notion-style "+ New Page" Button */}
        <button
          type="button"
          onClick={handleNewDoubt}
          className="w-full py-2 px-3 bg-base-200/80 hover:bg-primary hover:text-primary-content text-base-content text-xs font-bold rounded-xl transition-all flex items-center justify-between group cursor-pointer mb-2.5 border border-base-content/10"
        >
          <span className="flex items-center gap-2">
            <Plus className="size-3.5" />
            <span>New Doubt Page</span>
          </span>
          <span className="text-[10px] opacity-50 group-hover:opacity-100 font-mono">⌘N</span>
        </button>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search pages & notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-base-200/50 border border-base-content/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 font-medium text-base-content placeholder:text-base-content/40 transition-all"
          />
        </div>
      </div>

      {/* Notion Document Tree */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 custom-scrollbar">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest">
            Pages & Sessions
          </span>
          <span className="text-[10px] font-mono text-base-content/40">{filteredSessions.length}</span>
        </div>

        {filteredSessions.length === 0 ? (
          <p className="text-xs text-base-content/40 text-center py-6 font-medium">No pages found</p>
        ) : (
          filteredSessions.map((sess) => {
            const isSelected = selectedSessionId === sess.id;
            const SessIcon = sess.icon || FileText;

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
                className={`w-full px-2.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-left group ${
                  isSelected
                    ? "bg-primary/10 border-primary/20 text-primary font-bold shadow-2xs"
                    : "bg-transparent border-transparent hover:bg-base-200/80 text-base-content/80 hover:text-base-content"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    className={`size-6 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                      isSelected
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content/60 group-hover:text-base-content"
                    }`}
                  >
                    <SessIcon className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs truncate ${isSelected ? "font-bold text-primary" : "font-medium"}`}>
                      {sess.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[9px] text-base-content/40 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {sess.date}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => deleteSession(sess.id, e)}
                    className="p-1 text-base-content/40 hover:text-error hover:bg-error/10 rounded-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer ml-1"
                    title="Delete page"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100dvh-4rem)] bg-base-100 text-base-content overflow-hidden font-sans w-full">
      {/* Desktop Sidebar */}
      <aside className="w-64 lg:w-72 border-r border-base-content/10 bg-base-100 hidden md:flex flex-col shrink-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Slide-in Drawer via Portal */}
      {createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
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
                  width: "300px",
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

      {/* Main Notion Canvas Area */}
      <div className="flex-1 flex flex-col relative w-full overflow-hidden bg-base-100">
        {/* Notion Top Breadcrumb Header */}
        <header className="px-4 sm:px-8 py-2.5 bg-base-100/90 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-20 w-full shrink-0 flex items-center justify-between min-h-[52px] gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg bg-base-200 hover:bg-base-300 text-base-content/80 transition-colors"
              title="Open Pages"
            >
              <Layers className="size-4" />
            </button>

            {/* Notion Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-base-content/60 font-medium truncate">
              <span className="hover:text-base-content cursor-pointer">Anva Workspace</span>
              <ChevronRight className="size-3 text-base-content/40 shrink-0" />
              <span className="font-bold text-base-content truncate">
                {selectedSessionId === "active" ? "AI Study Assistant" : "Archived Doubt Note"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowCoachModal(true)}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Pronunciation & Speech Coach"
            >
              <Award className="size-3.5" />
              <span className="hidden sm:inline">Pronunciation Coach</span>
            </button>

            <button
              type="button"
              onClick={clearHistory}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-base-200/80 hover:bg-error/10 hover:text-error rounded-xl text-xs font-bold text-base-content/70 transition-all cursor-pointer flex items-center gap-1 border border-base-content/5"
              title="Clear Canvas History"
            >
              <Trash2 className="size-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </header>

        {/* Notion Document Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-10 md:px-16 py-8 space-y-6 custom-scrollbar bg-base-100 flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-6">
            {/* Clean Notion Page Header */}
            <div className="space-y-2 pb-2">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs text-xl">
                  🧠
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                    AI Doubt Solver & Study Workspace
                  </h1>
                  <p className="text-xs text-base-content/50 font-medium">
                    Powered by OpenRouter High-Speed Cascade & Multi-Modal Vision
                  </p>
                </div>
              </div>
            </div>

            {/* Welcome Prompts on Empty Page */}
            {isNewChat && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-1"
              >

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {SUGGESTIONS.map((sug, idx) => {
                    const SugIcon = sug.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(sug.prompt)}
                        className="p-4 rounded-2xl bg-base-200/50 hover:bg-base-200 border border-base-content/10 hover:border-primary/40 transition-all text-left flex gap-3.5 group cursor-pointer shadow-2xs"
                      >
                        <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <SugIcon className="size-4.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs sm:text-sm font-bold text-base-content group-hover:text-primary transition-colors">
                              {sug.title}
                            </h4>
                            <span className="text-[10px] text-base-content/40 font-semibold">{sug.category}</span>
                          </div>
                          <p className="text-xs text-base-content/60 font-medium line-clamp-2 leading-relaxed">
                            {sug.prompt}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Document Messages Stream */}
            {!isNewChat && (
              <div className="space-y-6 pt-2">
                {activeMessages.map((msg, index) => {
                  const isUser = msg.role === "user";

                  return isUser ? (
                    /* Notion-style User Callout Block */
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-5 rounded-2xl bg-base-200/80 hover:bg-base-200 border border-base-content/10 space-y-2.5 transition-colors shadow-2xs text-left"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-base-content/60 border-b border-base-content/5 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-lg bg-primary text-primary-content font-black text-[11px] flex items-center justify-center">
                            {authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <span className="text-base-content font-bold">{authUser?.fullName || "You"}</span>
                        </div>
                        <span className="text-[10px] font-mono text-base-content/40">Doubt Prompt</span>
                      </div>

                      {msg.image && (
                        <div className="my-2 rounded-xl overflow-hidden border border-base-content/10 max-h-64 shadow-xs">
                          <img src={msg.image} alt="Context" className="max-h-64 w-auto object-cover" />
                        </div>
                      )}

                      <p className="text-xs sm:text-sm font-medium text-base-content leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </motion.div>
                  ) : (
                    /* Notion-style AI Document Section */
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 sm:p-6 rounded-3xl bg-base-100 border border-base-content/10 space-y-3.5 shadow-xs text-left"
                    >
                      <div className="flex items-center justify-between border-b border-base-content/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Sparkles className="size-3.5" />
                          </div>
                          <span className="text-xs font-black text-base-content">Anva AI Explanation</span>
                        </div>
                        <span className="badge badge-xs font-bold bg-primary/10 text-primary border-transparent uppercase text-[9px]">
                          Verified Tutor
                        </span>
                      </div>

                      {msg.image && (
                        <div className="mb-3 rounded-2xl overflow-hidden border border-base-content/10 max-h-64">
                          <img src={msg.image} alt="Context" className="max-h-64 w-auto object-cover" />
                        </div>
                      )}

                      {msg.content ? (
                        <MarkdownContent content={msg.content} />
                      ) : (
                        <div className="flex items-center gap-2 text-primary font-bold text-xs py-2">
                          <Sparkles className="size-4 animate-spin" />
                          <span>Structuring explanation in real-time...</span>
                        </div>
                      )}

                      {/* Notion Block Action Bar */}
                      {msg.content && (
                        <div className="flex items-center gap-3 pt-3 border-t border-base-content/5 text-[11px] font-semibold text-base-content/50">
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(msg.content, index)}
                            className="hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {speakingMsgIndex === index ? (
                              <>
                                <VolumeX className="size-3.5 text-error" />
                                <span className="text-error font-bold">Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="size-3.5 text-primary" />
                                <span>Listen (TTS)</span>
                              </>
                            )}
                          </button>
                          <span className="text-base-content/20">•</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              toast.success("Explanation copied to clipboard!");
                            }}
                            className="hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Copy className="size-3" />
                            <span>Copy Markdown</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Loading placeholder */}
            {loading && activeMessages.length > 0 && activeMessages[activeMessages.length - 1]?.role !== "assistant" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-2xl bg-base-100 border border-base-content/10 shadow-xs flex items-center gap-2 text-xs font-bold text-base-content/70 text-left"
              >
                <Sparkles className="size-4 text-primary animate-spin" />
                <span>Thinking & querying knowledge base...</span>
              </motion.div>
            )}

            <div ref={bottomRef} className="h-4" />
          </div>
        </main>

        {/* Notion Slash Command Bar & Input Capsule */}
        <footer className="shrink-0 w-full bg-base-100 border-t border-base-content/10 p-3 sm:p-4 z-20">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Slash Command Quick Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
              <span className="text-[10px] font-extrabold uppercase text-base-content/40 shrink-0 mr-1">
                Quick Prompts:
              </span>
              {NOTION_COMMANDS.map((cmd, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInput(cmd.prompt);
                    textareaRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-base-200/70 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-base-content/10 text-base-content/70 font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span className="font-mono text-primary font-bold">{cmd.cmd}</span>
                  <span>{cmd.label}</span>
                </button>
              ))}
            </div>

            {/* Image Preview if attached */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 6 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 6 }}
                  className="p-2 bg-base-200 rounded-2xl border border-base-content/10 inline-flex items-center gap-3"
                >
                  <img src={imagePreview} alt="Preview" className="size-12 object-cover rounded-xl" />
                  <span className="text-xs font-semibold text-base-content/70">Image attached</span>
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

            {/* Input Capsule */}
            <div className="relative border border-base-content/15 rounded-2xl bg-base-200/50 focus-within:bg-base-100 focus-within:border-primary/60 transition-all shadow-xs p-1.5 sm:p-2 flex items-center gap-2">
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
                className="p-2 text-base-content/60 hover:text-primary hover:bg-base-200 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Attach screenshot or problem image"
              >
                <Paperclip className="size-4" />
              </button>

              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isRecording
                    ? "bg-error text-white animate-pulse"
                    : "text-base-content/60 hover:text-primary hover:bg-base-200"
                }`}
                title={isRecording ? "Listening... click to stop" : "Voice dictation"}
              >
                <Mic className="size-4" />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask any doubt, explain code, or type '/' for commands..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 px-2 py-1.5 bg-transparent text-base-content text-xs sm:text-sm font-medium focus:outline-none resize-none placeholder:text-base-content/40 max-h-32 min-h-[2rem]"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || (!input.trim() && !selectedImage)}
                className="btn btn-primary btn-sm rounded-xl px-4 font-bold shrink-0 shadow-xs cursor-pointer disabled:opacity-40 gap-1.5"
              >
                <Send className="size-3.5" />
                <span className="hidden sm:inline">Ask</span>
              </button>
            </div>
          </div>
        </footer>

        {/* ── PRONUNCIATION COACH MODAL VIA PORTAL ── */}
        {createPortal(
          <AnimatePresence>
            {showCoachModal && (
              <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCoachModal(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="relative bg-base-100 border border-base-content/15 rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 overflow-hidden z-10 font-sans"
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
