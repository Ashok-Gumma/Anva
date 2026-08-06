import ChatMessage from "../models/ChatMessage.js";

// ─────────────────────────────────────────────────────────────────────────────
// OpenRouter AI Service (Powered by openrouter/free & Google Gemma 4)
// ─────────────────────────────────────────────────────────────────────────────
const callAiApi = async (messages) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5001",
        "X-Title": "Anva Study Assistant",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response received.");
    }

    return content;
  } catch (primaryErr) {
    console.warn("⚠️ OpenRouter free model fallback attempt:", primaryErr.message);

    // Fallback to Google Gemma 4 31B Instruct if primary router is busy
    const fallbackRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-4-31b-it:free",
        messages: messages,
      }),
    });

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      return fallbackData?.choices?.[0]?.message?.content || "Hello! I am your study assistant.";
    }

    throw primaryErr;
  }
};

export const chatWithAssistant = async (req, res) => {
  try {
    const { message, image } = req.body;
    const userId = req.user._id;

    if (!message && !image) {
      return res.status(400).json({ message: "Message or image is required" });
    }

    // 1. Save User Message to DB
    await ChatMessage.create({
      userId,
      role: "user",
      content: message || "Can you help me with this?",
      image,
    });

    // 2. Call AI Assistant
    const reply = await callAiApi([
      {
        role: "system",
        content:
          "You are Anva's intelligent, polite, and professional Study Assistant. Help students answer questions, explain concepts clearly, assist with programming, and guide them in their learning journey.",
      },
      { role: "user", content: message || "Can you help me with this?" },
    ]);

    // 3. Save AI Reply to DB
    await ChatMessage.create({
      userId,
      role: "assistant",
      content: reply,
    });

    res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 Assistant backend error:", error.message);

    return res.status(200).json({
      reply: "❌ Sorry, the AI assistant encountered an error while processing your request. Please try again.",
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
      {
        role: "system",
        content:
          "You are a professional language & grammar assistant. Review the user's text for spelling and grammar errors. If there are errors, provide the corrected text clearly and explain the corrections briefly. If it is already correct, say 'The grammar is perfect!'.",
      },
      { role: "user", content: text },
    ]);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Assistant grammar error:", error.message);

    return res.status(200).json({
      reply: "❌ Grammar check failed. Please try again in a moment.",
      isFallback: true,
    });
  }
};
