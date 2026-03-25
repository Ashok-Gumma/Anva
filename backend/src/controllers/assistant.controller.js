import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    console.log("Assistant received:", message);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-3.5-turbo" if you want cheaper
      messages: [
        { role: "system", content: "You are a helpful programming and study assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 Assistant backend error:", error);

    // Handle quota / rate limit nicely
    if (error?.status === 429 || error?.code === "insufficient_quota") {
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

export const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional language teacher. Review the user's text for spelling and grammar errors. If there are errors, provide the corrected text clearly and explain the corrections briefly. If it is already correct, just say 'The grammar is perfect!'." },
        { role: "user", content: text },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Assistant grammar error:", error);

    if (error?.status === 429 || error?.code === "insufficient_quota") {
      return res.status(200).json({
        reply: "⚠️ Grammar check is temporarily unavailable — the AI quota has been exceeded. Please add credits to your OpenAI account at platform.openai.com/settings/billing, or try again later.",
        isFallback: true,
      });
    }

    return res.status(200).json({
      reply: "❌ Grammar check failed. Please try again in a moment.",
      isFallback: true,
    });
  }
};
