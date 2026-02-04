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
      model: "gpt-4o-mini",
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
    if (error?.code === "insufficient_quota" || error?.status === 429) {
      return res.status(200).json({
        reply:
          "⚠️ I'm currently out of AI credits. Please try again later or contact the admin to enable billing.",
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
