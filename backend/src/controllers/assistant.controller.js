import axios from "axios";
import ChatMessage from "../models/ChatMessage.js";

// ─────────────────────────────────────────────────────────────────────────────
// Helper for RapidAPI ChatGPT-42 request
// ─────────────────────────────────────────────────────────────────────────────
const callAiApi = async (messages) => {
  const options = {
    method: 'POST',
    url: `https://chatgpt-42.p.rapidapi.com/gpt4`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': "chatgpt-42.p.rapidapi.com",
      'Content-Type': 'application/json'
    },
    data: {
      messages: messages,
      web_access: false
    }
  };

  const response = await axios.request(options);
  return response.data.result;
};

export const chatWithAssistant = async (req, res) => {
  try {
    const { message, image } = req.body;
    const userId = req.user._id;

    if (!message && !image) {
      return res.status(400).json({ message: "Message or image is required" });
    }

    // 1. Save User Message to DB
    const userMsg = await ChatMessage.create({
      userId,
      role: "user",
      content: message || "Can you help me with this?",
      image
    });

    // 2. Call AI
    const reply = await callAiApi([
      { role: "system", content: "You are a professional study assistant. Help students clarify doubts clearly." },
      { role: "user", content: message || "Can you help me with this?" },
    ]);

    // 3. Save AI Reply to DB
    await ChatMessage.create({
      userId,
      role: "assistant",
      content: reply
    });

    res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 Assistant backend error:", error.response?.data || error.message);

    if (error?.response?.status === 429) {
      return res.status(200).json({
        reply: "⚠️ AI service is currently rate-limited. Please try again later.",
        isFallback: true,
      });
    }

    return res.status(200).json({
      reply: "❌ Sorry, the AI assistant encountered an error while processing your request.",
      isFallback: true,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: 1 })
      .limit(50);
    
    res.status(200).json(history);
  } catch (error) {
    console.error("Fetch history error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await ChatMessage.deleteMany({ userId });
    res.status(200).json({ message: "Chat history cleared successfully" });
  } catch (error) {
    console.error("Clear history error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const reply = await callAiApi([
      { role: "system", content: "You are a professional language teacher. Review the user's text for spelling and grammar errors. If there are errors, provide the corrected text clearly and explain the corrections briefly. If it is already correct, just say 'The grammar is perfect!'." },
      { role: "user", content: text },
    ], "gpt-4o-mini");

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Assistant grammar error:", error.response?.data || error.message);

    if (error?.response?.status === 429) {
      return res.status(200).json({
        reply: "⚠️ Grammar check is temporarily unavailable due to rate limits. Please try again later.",
        isFallback: true,
      });
    }

    return res.status(200).json({
      reply: "❌ Grammar check failed. Please try again in a moment.",
      isFallback: true,
    });
  }
};
