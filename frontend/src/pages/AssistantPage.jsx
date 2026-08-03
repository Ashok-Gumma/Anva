import { useEffect, useRef, useState, useMemo } from "react";
import { axiosInstance } from "../lib/axios";
import { 
  Send, 
  X, 
  Bot, 
  BrainCircuit,
  Wand2,
  Mic, 
  MicOff, 
  Plus, 
  Settings, 
  Paperclip,
  ArrowUp,
  Menu,
  Database,
  GitBranch,
  Code,
  Trash2,
  Search,
  Zap,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";

// Suggestions for new doubts
const SUGGESTIONS = [
  {
    title: "React State Hook",
    prompt: "Explain how React state updating works under the hood and why state updates are asynchronous.",
    icon: Code,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  },
  {
    title: "Python List Comprehensions",
    prompt: "Explain Python list comprehensions and write an example of filtering and mapping with an if-else statement.",
    icon: Code,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  },
  {
    title: "SQL Joins Explained",
    prompt: "Can you explain the difference between INNER JOIN and LEFT JOIN with a simple database table example?",
    icon: Database,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  },
  {
    title: "BST Tree Traversal",
    prompt: "Show me a JavaScript recursive in-order traversal function for a Binary Search Tree and explain its complexity.",
    icon: GitBranch,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  }
];

// Historical mock doubt sessions
const INITIAL_MOCK_SESSIONS = [
  {
    id: "active",
    title: "Active Doubt Session",
    isCurrent: true,
    icon: BrainCircuit,
    date: "Current"
  },
  {
    id: "react-hook",
    title: "React Hooks State Bug",
    isCurrent: false,
    icon: Code,
    date: "2 hours ago",
    messages: [
      { role: "user", content: "Hey! Why is my React state not updating immediately after I call `setCount`? In my handler I call `setCount(count + 1)` and then `console.log(count)` prints the old value." },
      { role: "assistant", content: "React's state setters (like `setCount`) do not immediately update the state in-place. Instead, they schedule a state transition. \n\nWhen you call `setCount(count + 1)`, React schedules a re-render with the new value, but the current execution context of your function still has the old `count` value (due to closure).\n\n### Solution\n\nIf you need to execute code with the **new** state value immediately, you have two main options:\n\n1. **Use a local variable** if you just need the value inside the same function:\n```javascript\nconst newCount = count + 1;\nsetCount(newCount);\nconsole.log(newCount); // Works immediately!\n```\n\n2. **Use a `useEffect` hook** if you want to perform a side effect in response to the state change:\n```javascript\nuseEffect(() => {\n  console.log(\"Count updated to:\", count);\n}, [count]);\n```\n\n3. **Use the functional updater form** if the next state depends on the previous state to avoid race conditions:\n```javascript\nsetCount(prev => prev + 1);\n```" }
    ]
  },
  {
    id: "python-comprehension",
    title: "Python List Comprehensions",
    isCurrent: false,
    icon: Code,
    date: "Yesterday",
    messages: [
      { role: "user", content: "Can you explain how python list comprehensions work, and how to write one with an `if-else` condition?" },
      { role: "assistant", content: "List comprehensions in Python provide a concise way to create lists. They are generally faster and more readable than using traditional `for` loops.\n\n### Basic Syntax\n```python\n# Syntax: [expression for item in iterable]\nsquares = [x**2 for x in range(5)]\n# Result: [0, 1, 4, 9, 16]\n```\n\n### With `if` condition (Filtering)\nPlace the `if` at the **end** of the comprehension:\n```python\n# Syntax: [expression for item in iterable if condition]\nevens = [x for x in range(10) if x % 2 == 0]\n# Result: [0, 2, 4, 6, 8]\n```\n\n### With `if-else` condition (Transformation)\nPlace the `if-else` at the **beginning** of the comprehension, right after the expression:\n```python\n# Syntax: [val_if_true if condition else val_if_false for item in iterable]\nlabels = [\"Even\" if x % 2 == 0 else \"Odd\" for x in range(5)]\n# Result: ['Even', 'Odd', 'Even', 'Odd', 'Even']\n```" }
    ]
  },
  {
    id: "sql-joins",
    title: "SQL Joins Visualizer",
    isCurrent: false,
    icon: Database,
    date: "3 days ago",
    messages: [
      { role: "user", content: "I always get confused between LEFT JOIN and INNER JOIN. Can you explain the difference with a clear example?" },
      { role: "assistant", content: "Here is a simple breakdown of the difference between `INNER JOIN` and `LEFT JOIN`.\n\nImagine we have two tables:\n1. **Students**: `id`, `name`\n2. **Grades**: `student_id`, `score`\n\n### 1. INNER JOIN\nAn `INNER JOIN` only returns rows where there is a match in **both** tables.\n\n```sql\nSELECT Students.name, Grades.score\nFROM Students\nINNER JOIN Grades ON Students.id = Grades.student_id;\n```\n* **Result**: If a student doesn't have a grade recorded, they won't appear in the results at all.\n\n### 2. LEFT JOIN (or LEFT OUTER JOIN)\nA `LEFT JOIN` returns **all** records from the left table (`Students`), and the matched records from the right table (`Grades`). If there is no match, the right side will contain `NULL`.\n\n```sql\nSELECT Students.name, Grades.score\nFROM Students\nLEFT JOIN Grades ON Students.id = Grades.student_id;\n```\n* **Result**: Every single student will be listed. If a student doesn't have a grade, their score will just show as `NULL`.\n\n### Summary Rule of Thumb\n* Use **INNER JOIN** when you only want complete pairs (must have both Student and Grade).\n* Use **LEFT JOIN** when you want everything from the first table, even if it doesn't have matching details in the second table." }
    ]
  },
  {
    id: "bst-traversal",
    title: "BST In-Order Traversal",
    isCurrent: false,
    icon: GitBranch,
    date: "June 12",
    messages: [
      { role: "user", content: "How do you do an in-order traversal of a Binary Search Tree recursively in JavaScript?" },
      { role: "assistant", content: "An **In-Order** traversal visits the nodes in the following order: **Left subtree ➔ Root node ➔ Right subtree**.\n\nIn a Binary Search Tree (BST), an in-order traversal visits the nodes in **ascending sorted order**!\n\n### Implementation in JavaScript\n\nHere is a simple Node definition and the recursive traversal function:\n\n```javascript\nclass TreeNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nfunction inOrderTraversal(root) {\n  const result = [];\n  \n  function traverse(node) {\n    if (node === null) return;\n    \n    traverse(node.left);       // 1. Visit Left\n    result.push(node.value);   // 2. Visit Root\n    traverse(node.right);      // 3. Visit Right\n  }\n  \n  traverse(root);\n  return result;\n}\n```\n\n### Complexity\n- **Time Complexity**: `O(N)` where `N` is the number of nodes in the tree, because we visit each node exactly once.\n- **Space Complexity**: `O(H)` where `H` is the height of the tree, due to the call stack during recursion. In the worst case (skewed tree), this can be `O(N)`." }
    ]
  }
];

// Helper to format/parse simple markdown elements (code blocks, inline code backticks)
const formatMessageContent = (text) => {
  if (!text) return "";
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : "";
      const code = match ? match[2] : part.slice(3, -3);
      return (
        <div key={index} className="my-4 rounded-2xl overflow-hidden border border-base-content/10 bg-base-300/80 text-left font-mono shadow-inner">
          {language && (
            <div className="bg-base-300 px-4 py-2 text-[10px] font-black text-base-content/60 uppercase border-b border-base-content/10 flex justify-between items-center tracking-wider">
              <span>{language}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  toast.success("Code copied to clipboard!");
                }}
                className="hover:text-primary transition-colors text-[9px] font-bold uppercase tracking-wider cursor-pointer btn-ghost btn-xs btn"
              >
                Copy
              </button>
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed text-base-content selection:bg-primary/30">
            <code>{code.trim()}</code>
          </pre>
        </div>
      );
    }
    
    // Also parse inline backticks
    const inlineParts = part.split(/(`[^`\n]+`)/g);
    return (
      <span key={index}>
        {inlineParts.map((subPart, subIndex) => {
          if (subPart.startsWith("`") && subPart.endsWith("`")) {
            return (
              <code key={subIndex} className="px-1.5 py-0.5 rounded-md bg-base-300 text-primary font-mono text-xs border border-base-content/10 font-bold">
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

const AssistantPage = () => {
  const { authUser } = useAuthUser();
  const [dbMessages, setDbMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Doubt History States
  const [sessions, setSessions] = useState(() => {
    try {
      localStorage.removeItem("anva_assistant_sessions");
      const deletedIds = JSON.parse(localStorage.getItem("anva_assistant_deleted_sessions") || "[]");
      return INITIAL_MOCK_SESSIONS.filter(s => !deletedIds.includes(s.id));
    } catch {
      console.error("Failed to parse deleted sessions from local storage");
    }
    return INITIAL_MOCK_SESSIONS;
  });
  const [selectedSessionId, setSelectedSessionId] = useState("active");

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Fetch live active chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/assistant/history");
        if (res.data && res.data.length > 0) {
          setDbMessages(res.data);
        } else {
          setDbMessages([{ role: "assistant", content: "Hi! I'm your AI study assistant. How can I help you study today?" }]);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
        setDbMessages([{ role: "assistant", content: "Hi! I'm your AI study assistant. How can I help you today?" }]);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages, loading, selectedSessionId]);

  const clearHistory = async () => {
    try {
      await axiosInstance.delete("/assistant/history");
      setDbMessages([{ role: "assistant", content: "Hi! I'm your AI study assistant. How can I help you today?" }]);

      const allMockIds = INITIAL_MOCK_SESSIONS.filter(s => s.id !== "active").map(s => s.id);
      localStorage.setItem("anva_assistant_deleted_sessions", JSON.stringify(allMockIds));
      setSessions(INITIAL_MOCK_SESSIONS.filter(s => s.id === "active"));
      setSelectedSessionId("active");

      setSettingsOpen(false);
      toast.success("All chat history cleared successfully!");
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

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
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
      toast.error("This is an archived read-only session. Start a 'New Doubt' to ask live questions.");
      return;
    }

    const userMessage = { 
      role: "user", 
      content: input.trim(),
      image: imagePreview 
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
        image: currentImage
      });

      const reply = res.data.reply || "No reply from assistant.";
      setDbMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Assistant error:", err);
      setDbMessages((prev) => [...prev, { role: "assistant", content: "❌ Error connecting to intelligence core." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDoubt = async () => {
    setSelectedSessionId("active");
    setMobileMenuOpen(false);
    
    if (dbMessages.length <= 1) {
      toast.success("Ready for a new doubt session.");
      return;
    }

    try {
      await axiosInstance.delete("/assistant/history");
      setDbMessages([{ role: "assistant", content: "Hi! I'm your AI study assistant. How can I help you today?" }]);
      toast.success("Started a new live doubt session.");
    } catch (err) {
      console.error("Failed to clear for new session:", err);
      setDbMessages([{ role: "assistant", content: "Hi! I'm your AI study assistant. How can I help you today?" }]);
    }
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();

    if (id === "active") {
      try {
        await axiosInstance.delete("/assistant/history");
        setDbMessages([{ role: "assistant", content: "Hi! I'm your AI study assistant. How can I help you today?" }]);
        toast.success("Active chat history cleared.");
      } catch (err) {
        console.error("Failed to clear active history:", err);
        toast.error("Failed to clear active chat history.");
      }
      return;
    }

    setSessions(prev => prev.filter(s => s.id !== id));
    
    try {
      const deletedIds = JSON.parse(localStorage.getItem("anva_assistant_deleted_sessions") || "[]");
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem("anva_assistant_deleted_sessions", JSON.stringify(deletedIds));
      }
    } catch(err) {
      console.error("Failed to save deleted session id:", err);
    }

    if (selectedSessionId === id) {
      setSelectedSessionId("active");
    }
    toast.success("Doubt thread removed from history.");
  };

  const handleSuggestionClick = (prompt) => {
    if (selectedSessionId !== "active") {
      setSelectedSessionId("active");
    }
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => s.title?.toLowerCase().includes(q));
  }, [sessions, searchQuery]);

  const UserAvatar = () => {
    const initials = authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : "S";
    return (
      <div className="size-9 rounded-full bg-secondary text-secondary-content flex items-center justify-center font-bold text-xs border border-base-content/10 shadow-sm overflow-hidden shrink-0">
        {authUser?.profilePic ? (
          <img src={authUser.profilePic} alt="User Avatar" className="size-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    );
  };

  const BotAvatar = () => {
    return (
      <div className="size-9 rounded-xl bg-gradient-to-tr from-primary to-accent text-primary-content flex items-center justify-center shadow-md border border-primary/20 shrink-0">
        <Bot className="size-5 text-primary-content" />
      </div>
    );
  };

  const activeMessages = selectedSessionId === "active"
    ? dbMessages
    : (sessions.find(s => s.id === selectedSessionId)?.messages || []);

  const isNewChat = selectedSessionId === "active" && dbMessages.length <= 1;

  const renderSidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="p-5 border-b border-base-content/10 bg-base-100/50 backdrop-blur-md shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-inner">
              <BrainCircuit className="size-5 text-primary stroke-[2]" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest uppercase text-base-content">Anva AI</h1>
              <span className="text-[9px] text-base-content/40 font-bold uppercase tracking-wider">Neural Core v5.2</span>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden p-2 text-base-content/60 hover:text-base-content hover:bg-base-content/5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>
        
        {/* New Doubt Button */}
        <button 
          onClick={handleNewDoubt}
          className="w-full py-2.5 bg-primary text-primary-content text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer mb-3"
        >
          <Plus className="size-4 stroke-[2.5]" />
          New Doubt
        </button>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search doubt threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-base-200/60 border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium text-base-content placeholder:text-base-content/40 transition-all"
          />
        </div>
      </div>
      
      {/* Threads List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        <h2 className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em] px-2 mb-2">Doubt History</h2>
        
        {filteredSessions.length === 0 ? (
          <p className="text-xs text-base-content/40 text-center py-6 font-medium">No threads found</p>
        ) : (
          filteredSessions.map((sess) => {
            const isSelected = selectedSessionId === sess.id;
            const SessIcon = sess.icon || Code;
            
            return (
              <div 
                key={sess.id}
                onClick={() => {
                  setSelectedSessionId(sess.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                  isSelected 
                    ? "bg-primary/10 border-primary/30 text-primary shadow-sm" 
                    : "bg-base-100/50 border-base-content/5 text-base-content hover:bg-base-200/80 hover:border-base-content/10"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/60 group-hover:text-base-content"
                  }`}>
                    <SessIcon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-black truncate ${isSelected ? "text-primary" : "text-base-content"}`}>
                      {sess.title}
                    </p>
                    <p className="text-[9px] text-base-content/40 mt-0.5 uppercase font-bold tracking-tight">
                      {sess.date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => deleteSession(sess.id, e)}
                  className="p-1 text-base-content/40 hover:text-error hover:bg-error/10 rounded-md transition-all md:opacity-0 md:group-hover:opacity-100 cursor-pointer ml-1 shrink-0"
                  title={sess.id === "active" ? "Clear active chat" : "Remove thread"}
                >
                  <Trash2 className="size-3.5" />
                </button>

                {sess.id === "active" && (
                  <span className="size-2 rounded-full bg-success animate-pulse shrink-0 ml-1" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Settings Footer */}
      <div className="p-4 border-t border-base-content/10 bg-base-100/30 shrink-0">
        <button 
          onClick={() => {
            setSettingsOpen(true);
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 text-base-content/60 hover:text-base-content hover:bg-base-content/5 p-2 rounded-xl transition-all cursor-pointer text-xs font-bold uppercase tracking-wider w-full"
        >
          <Settings className="size-4" />
          Settings
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-[calc(100dvh-4rem-4.25rem)] md:h-[calc(100vh-4rem)] bg-base-200 text-base-content overflow-hidden font-sans selection:bg-primary/20 w-full">
      {/* Desktop Sidebar */}
      <aside className="w-72 border-r border-base-content/10 bg-base-100 hidden md:flex flex-col shrink-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[60] bg-base-100 flex flex-col md:hidden w-72 border-r border-base-content/10 shadow-2xl"
          >
            {renderSidebarContent()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col relative chat-wallpaper w-full overflow-hidden">
        
        {/* Settings Overlay */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-base-300/80 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="max-w-md w-full border border-base-content/10 bg-base-100 rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black uppercase tracking-wider text-base-content">System Settings</h2>
                  <button onClick={() => setSettingsOpen(false)} className="btn btn-sm btn-circle btn-ghost">
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-base-200 border border-base-content/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest mb-1 text-base-content">Clear Chat History</h3>
                      <p className="text-[10px] text-base-content/50 font-bold uppercase tracking-wider">Permanently delete all sessions</p>
                    </div>
                    <button 
                      onClick={clearHistory}
                      className="btn btn-error btn-outline btn-sm font-black uppercase tracking-widest text-[9px]"
                    >
                      Delete All
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-base-200 border border-base-content/5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest mb-1 text-base-content">Voice Assistant</h3>
                      <p className="text-[10px] text-base-content/50 font-bold uppercase tracking-wider">Speech-to-text input enabled</p>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
                  </div>
                </div>

                <p className="mt-10 text-center text-[8px] font-black text-base-content/30 uppercase tracking-[0.5em]">
                  ANVA CORE SETTINGS v5.2
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky Header */}
        <header className="px-4 sm:px-6 py-3 bg-base-100/90 backdrop-blur-md border-b border-base-content/10 sticky top-0 z-25 w-full shrink-0 flex items-center justify-between min-h-[64px]">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-base-content hover:bg-base-content/10 rounded-xl transition-colors cursor-pointer"
            >
              <Menu className="size-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-base-content/70">
                {selectedSessionId === "active" ? "Neural Core (Online)" : "Archived Thread"}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedSessionId !== "active" ? (
              <span className="px-2.5 py-1 rounded-lg bg-base-300 border border-base-content/10 text-[9px] font-black uppercase tracking-wider text-base-content/50">
                Read-Only
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-success/15 border border-success/20 text-[9px] font-black uppercase tracking-wider text-success">
                Live Session
              </span>
            )}
            
            <button 
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="p-2 border border-base-content/10 hover:border-base-content/20 rounded-full hover:bg-base-content/5 transition-all text-base-content cursor-pointer"
              title="Settings"
            >
              <Settings className="size-4" />
            </button>
          </div>
        </header>

        {/* Chat Feed Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 scrollbar-thin relative pb-36">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            {/* Welcome Screen if New Active Chat */}
            {isNewChat && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-10 md:py-16 px-4"
              >
                <div className="size-16 rounded-3xl bg-gradient-to-tr from-primary to-accent text-primary-content flex items-center justify-center shadow-lg border border-primary/20 mb-6">
                  <BrainCircuit className="size-8 text-primary-content" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-base-content tracking-tight mb-3">
                  How can I help you study today?
                </h2>
                <p className="text-xs md:text-sm text-base-content/50 font-semibold max-w-md mb-10 uppercase tracking-wider leading-relaxed">
                  Ask about programming concepts, verify code grammar, clear doubts, or debug runtime errors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  {SUGGESTIONS.map((sug, idx) => {
                    const SugIcon = sug.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(sug.prompt)}
                        className="p-4 rounded-2xl bg-base-100 border border-base-content/10 hover:border-primary/40 hover:bg-base-200/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 text-left flex gap-3 group relative cursor-pointer"
                      >
                        <div className={`size-8 rounded-xl flex items-center justify-center shrink-0 border ${sug.color}`}>
                          <SugIcon className="size-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-black uppercase tracking-wider text-base-content/85 group-hover:text-primary transition-colors">
                            {sug.title}
                          </h4>
                          <p className="text-[11px] text-base-content/50 font-bold mt-1 line-clamp-2 leading-relaxed">
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
                      {isUser ? <UserAvatar /> : <BotAvatar />}
                      
                      <div className={`flex flex-col max-w-[80%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                        <div className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all text-left ${
                          isUser
                            ? "bg-primary text-primary-content rounded-tr-none"
                            : "bg-base-100 border border-base-content/10 text-base-content rounded-tl-none"
                        }`}>
                          {msg.image && (
                            <div className="mb-3 rounded-xl overflow-hidden border border-base-content/10 shadow-inner max-w-full">
                              <img src={msg.image} alt="Context" className="max-h-64 md:max-h-80 w-auto object-cover" />
                            </div>
                          )}
                          <div className="whitespace-pre-wrap select-text selection:bg-primary/30">
                            {formatMessageContent(msg.content)}
                          </div>
                        </div>
                        <span className="mt-1.5 px-2 text-[9px] font-bold uppercase tracking-wider text-base-content/40">
                          {isUser ? (authUser?.fullName || "Student") : "ANVA AI"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                <BotAvatar />
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-3 text-base-content/40 font-black text-[9px] uppercase tracking-[0.4em] p-3 rounded-xl bg-base-100 border border-base-content/5 shadow-sm">
                    <div className="size-1.5 bg-primary rounded-full animate-ping" />
                    Synthesizing reply...
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        </main>

        {/* Floating Capsule Bottom Input Area */}
        <footer className="w-full bg-gradient-to-t from-base-100/90 via-base-100/50 to-transparent pt-8 pb-6 px-4 absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
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
                  <button onClick={removeImage} className="btn btn-circle btn-xs btn-error text-error-content shadow-lg cursor-pointer">
                    <X className="size-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative border border-base-content/10 rounded-2xl bg-base-100/90 backdrop-blur-md transition-all focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary shadow-xl">
              <div className="flex items-end p-2 sm:p-2.5 gap-1.5 sm:gap-2.5">
                <div className="flex shrink-0">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content cursor-pointer"
                    title="Attach screenshot"
                    disabled={selectedSessionId !== "active"}
                  >
                    <Paperclip className="size-4 stroke-[2.5]" />
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                  </button>
                  
                  <button 
                    onClick={toggleRecording}
                    className={`btn btn-ghost btn-circle btn-sm transition-colors cursor-pointer ${
                      isRecording ? "text-error animate-pulse bg-error/10" : "text-base-content/60 hover:text-base-content"
                    }`}
                    title="Voice doubt"
                    disabled={selectedSessionId !== "active"}
                  >
                    {isRecording ? <MicOff className="size-4 stroke-[2.5]" /> : <Mic className="size-4 stroke-[2.5]" />}
                  </button>
                </div>

                <textarea
                  ref={textareaRef}
                  className="textarea flex-1 resize-none bg-transparent min-h-[40px] max-h-[140px] h-[40px] py-2 px-1 text-sm text-base-content placeholder:text-base-content/35 border-none outline-none focus:ring-0 focus:outline-none custom-scrollbar leading-relaxed"
                  placeholder={
                    selectedSessionId !== "active" 
                      ? "Thread is read-only. Click 'New Doubt'..."
                      : isRecording 
                        ? "Listening closely..." 
                        : "Message Anva AI..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={selectedSessionId !== "active"}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                <button
                  className={`btn btn-circle btn-sm shadow-md transition-all shrink-0 cursor-pointer ${
                    input.trim() || selectedImage ? "btn-primary hover:scale-105" : "btn-ghost text-base-content/20"
                  }`}
                  onClick={sendMessage}
                  disabled={(!input.trim() && !selectedImage) || loading || selectedSessionId !== "active"}
                >
                  <ArrowUp className="size-4 stroke-[3]" />
                </button>
              </div>
            </div>
            
            <p className="mt-3 text-center text-[8px] font-black text-base-content/25 uppercase tracking-[0.4em] select-none pointer-events-none">
              ANVA CORE v5.2 • THEMED CORE
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AssistantPage;
