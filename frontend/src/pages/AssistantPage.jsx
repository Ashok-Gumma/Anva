import { useEffect, useRef, useState } from "react";
import axios from "axios";

const AssistantPage = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about your doubts 😊" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // For typing animation
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText, loading]);

  const typeWriterEffect = (fullText) => {
    setIsTyping(true);
    setTypingText("");

    let index = 0;
    const speed = 20; // ms per character (adjust if you want faster/slower)

    const interval = setInterval(() => {
      index++;
      setTypingText((prev) => prev + fullText.charAt(index - 1));

      if (index >= fullText.length) {
        clearInterval(interval);

        // Once typing is done, push full message to messages
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: fullText },
        ]);

        setTypingText("");
        setIsTyping(false);
      }
    }, speed);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || isTyping) return;

    const userMessage = { role: "user", content: input.trim() };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/assistant/chat",
        { message: userMessage.content },
        { withCredentials: true }
      );

      const reply = res.data.reply || "No reply from assistant.";

      // Start typing animation instead of adding instantly
      typeWriterEffect(reply);
    } catch (err) {
      console.error("Assistant error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">AI Assistant</h1>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div
              className={`chat-bubble ${
                msg.role === "user" ? "chat-bubble-primary" : ""
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Thinking bubble */}
        {loading && !isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble opacity-70">Thinking...</div>
          </div>
        )}

        {/* Typing animation bubble */}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-bubble">{typingText}</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          className="input input-bordered flex-1"
          placeholder="Ask your doubt..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          disabled={loading || isTyping}
        />
        <button
          className="btn btn-primary"
          onClick={sendMessage}
          disabled={loading || isTyping}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AssistantPage;
