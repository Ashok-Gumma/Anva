import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { 
  Image as ImageIcon, 
  Send, 
  X, 
  User, 
  Bot, 
  Sparkles, 
  Mic, 
  MicOff, 
  History, 
  Plus, 
  Settings, 
  Paperclip,
  ArrowUp,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Fetch history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/assistant/history");
        if (res.data && res.data.length > 0) {
          setMessages(res.data);
        } else {
            setMessages([{ role: "assistant", content: "Hi! I'm your AI study assistant. How can I help you today?" }]);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const clearHistory = async () => {
    try {
      await axiosInstance.delete("/assistant/history");
      setMessages([{ role: "assistant", content: "History cleared. How can I help you now?" }]);
      setSettingsOpen(false);
    } catch (err) {
      console.error("Failed to clear history:", err);
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
    if (!recognitionRef.current) return;
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
        alert("Image size should be less than 5MB");
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

    const userMessage = { 
      role: "user", 
      content: input.trim(),
      image: imagePreview 
    };

    setMessages((prev) => [...prev, userMessage]);
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
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Assistant error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Error connecting to intelligence core." }]);
    } finally {
      setLoading(false);
    }
  };

  const SidebarContent = () => (
    <>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="size-5 text-black stroke-[2.5]" />
              </div>
              <h1 className="text-sm font-black tracking-widest uppercase">Anva AI</h1>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden p-2 text-zinc-500 hover:text-white">
                <X className="size-5" />
            </button>
          </div>
          <button 
            onClick={() => {
                setMessages([{ role: "assistant", content: "Starting a new session. How can I help you?" }]);
                setMobileMenuOpen(false);
            }}
            className="w-full py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="size-4 stroke-[3]" />
            New Doubt
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-2 mb-4">Chat History</h2>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all group">
            <p className="text-xs font-bold truncate text-zinc-300 group-hover:text-white">Active Session</p>
            <p className="text-[9px] text-zinc-600 mt-1 uppercase font-bold tracking-tighter">Current</p>
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
            <button 
              onClick={() => {
                setSettingsOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-xs font-black uppercase tracking-widest w-full text-left"
            >
                <Settings className="size-4" />
                Settings
            </button>
        </div>
    </>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-black text-white overflow-hidden font-sans selection:bg-white/20">
      
      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a] flex flex-col md:hidden w-72 border-r border-white/10"
          >
            <SidebarContent />
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
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col relative bg-black w-full">
        {/* Settings Overlay */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="max-w-md w-full border border-white/10 bg-[#0a0a0a] rounded-3xl p-6 sm:p-10 shadow-[0_0_100px_rgba(255,255,255,0.05)]"
                >
                    <div className="flex items-center justify-between mb-8 sm:mb-12">
                        <h2 className="text-xl font-black italic uppercase tracking-tighter">System Settings</h2>
                        <button onClick={() => setSettingsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X className="size-6" />
                        </button>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest mb-1">Clear Chat History</h3>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Permanently delete all sessions</p>
                            </div>
                            <button 
                              onClick={clearHistory}
                              className="w-full sm:w-auto px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border border-red-500/20"
                            >
                                Delete All
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between opacity-50">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest mb-1">Monochrome Mode</h3>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Active Preference</p>
                            </div>
                            <div className="size-6 rounded-full bg-white flex items-center justify-center">
                                <span className="size-3 bg-black rounded-full" />
                            </div>
                        </div>

                        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest mb-1">Voice Feedback</h3>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Experimental feature</p>
                            </div>
                            <input type="checkbox" className="toggle toggle-sm border-white bg-black checked:bg-white checked:border-white" defaultChecked />
                        </div>
                    </div>

                    <p className="mt-12 text-center text-[8px] font-black text-zinc-800 uppercase tracking-[0.5em]">
                        ANVA CORE SETTINGS v1.2
                    </p>
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header - Fixed on top for Mobile */}
        <header className="p-4 sm:p-6 flex items-center justify-between bg-black/50 backdrop-blur-md border-b md:border-none border-white/10 sticky top-0 md:absolute md:top-0 md:left-0 md:right-0 z-10">
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <Menu className="size-5" />
                </button>
                <span className="px-3 py-1 rounded-full border border-white/20 bg-black/50 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    Neural Core Active
                </span>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setSettingsOpen(true)}
                    className="p-2 border border-white/10 rounded-full hover:bg-white/10 transition-colors md:hidden"
                >
                    <Settings className="size-4 text-white" />
                </button>
            </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-12 md:py-24 scrollbar-hide space-y-8 md:space-y-12">
          <div className="max-w-3xl mx-auto space-y-8 md:space-y-10">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 md:gap-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col max-w-[90%] sm:max-w-[85%] ${msg.role === "user" ? "items-end text-right" : "items-start text-left"}`}>
                    <div className={`p-4 md:p-5 rounded-2xl text-[14px] md:text-[16px] leading-[1.6] transition-all shadow-lg ${
                      msg.role === "user"
                        ? "bg-[#1a1a1a] text-white border border-white/10 rounded-tr-none"
                        : "bg-white/5 border border-white/5 text-zinc-300 font-medium whitespace-pre-wrap rounded-tl-none"
                    }`}>
                      {msg.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                          <img src={msg.image} alt="Context" className="max-h-64 md:max-h-80 w-auto" />
                        </div>
                      )}
                      <div>{msg.content}</div>
                    </div>
                    <div className="mt-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
                        {msg.role === "user" ? "STUDENT" : "ANVA INTELLIGENCE"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-center gap-3 text-zinc-600 font-black text-[9px] uppercase tracking-[0.4em]">
                  <div className="size-1 bg-white rounded-full animate-ping" />
                  Synthesizing
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        </main>

        {/* Bottom Input Area */}
        <footer className="p-4 sm:p-8 pb-8 sm:pb-12 bg-black">
          <div className="max-w-3xl mx-auto relative">
            
            <AnimatePresence>
                {imagePreview && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 10 }}
                    className="absolute -top-24 left-0 p-3 bg-zinc-900 border border-white/20 rounded-xl flex items-center gap-3 z-20"
                >
                    <img src={imagePreview} alt="Preview" className="size-14 object-cover rounded-md" />
                    <button onClick={removeImage} className="bg-white text-black rounded-full p-1 shadow-lg"><X className="size-3" /></button>
                </motion.div>
                )}
            </AnimatePresence>

            <div className="relative border border-white/20 rounded-2xl bg-[#0a0a0a] transition-all focus-within:border-white focus-within:ring-1 focus-within:ring-white shadow-2xl">
              <div className="flex items-end p-2 sm:p-4 gap-1 sm:gap-4">
                <div className="flex">
                    <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 sm:p-2 text-zinc-600 hover:text-white transition-colors"
                    title="Attach screenshot"
                    >
                        <Paperclip className="size-5 stroke-[2.5]" />
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                    </button>
                    
                    <button 
                    onClick={toggleRecording}
                    className={`p-3 sm:p-2 transition-colors ${isRecording ? "text-red-500 animate-pulse" : "text-zinc-600 hover:text-white"}`}
                    title="Voice doubt"
                    >
                    {isRecording ? <MicOff className="size-5 stroke-[2.5]" /> : <Mic className="size-5 stroke-[2.5]" />}
                    </button>
                </div>

                <textarea
                  className="textarea flex-1 resize-none bg-transparent min-h-[48px] h-[48px] py-3 text-[14px] sm:text-[16px] text-white placeholder:text-zinc-700 border-none outline-none focus:ring-0 custom-scrollbar"
                  placeholder={isRecording ? "Capturing doubt..." : "Message Anva AI..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                <button
                  className={`p-3 sm:p-2 rounded-xl transition-all ${
                    input.trim() || selectedImage ? "bg-white text-black" : "text-zinc-800"
                  }`}
                  onClick={sendMessage}
                  disabled={(!input.trim() && !selectedImage) || loading}
                >
                  <ArrowUp className="size-5 stroke-[3]" />
                </button>
              </div>
            </div>
            
            <p className="mt-4 text-center text-[8px] sm:text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] sm:tracking-[0.5em] opacity-50">
              ANVA MOBILE CORE v5.1 • MONOCHROME
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AssistantPage;
