import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    console.log("Assistant received:", message);

    // Use Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful programming and study assistant.\n\nUser: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 Assistant backend error:", error);

    // Handle quota / rate limit nicely
    if (error?.status === 429) {
      return res.status(200).json({
        reply:
          "⚠️ I'm currently out of AI credits or rate-limited. Please try again later or contact the admin.",
        isFallback: true,
      });
    }

    // Generic fallback
    return res.status(200).json({
      reply:
        "❌ Sorry, something went wrong on the server. Please try again in a few minutes.",
      isFallback: true,
    });
  }
};