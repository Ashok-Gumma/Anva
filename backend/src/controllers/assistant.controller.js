import ChatMessage from "../models/ChatMessage.js";

// ─────────────────────────────────────────────────────────────────────────────
// OpenRouter AI Service Configuration & Model Cascades
// ─────────────────────────────────────────────────────────────────────────────
const CANDIDATE_MODELS = [
  process.env.OPENROUTER_MODEL,
  "minimax/minimax-m2.7:free",
  "liquid/lfm-2.5-2.6b:free",
  "cohere/north-mini-code:free",
  "poolside/laguna-s-2.1:free",
  "google/gemma-4-26b-a4b-it:free",
  "openrouter/free",
  "nvidia/nemotron-3.5-lightning:free",
].filter(Boolean);

/**
 * Strips internal thinking tags, reasoning logs, and leading/trailing filler
 */
export const cleanAiResponse = (text = "") => {
  if (!text) return "";
  let cleaned = text
    // Strip <think>...</think> or <thought>...</thought> tags
    .replace(/<think[\s\S]*?<\/think>/gi, "")
    .replace(/<thought[\s\S]*?<\/thought>/gi, "")
    .replace(/\[THINK\][\s\S]*?\[\/THINK\]/gi, "")
    // Strip raw reasoning preamble if leaked into content
    .replace(/^Here['’]s a thinking process:[\s\S]*?(?=\n\n[A-Z0-9#*-]|$)/i, "")
    .replace(/^Thinking Process:[\s\S]*?(?=\n\n[A-Z0-9#*-]|$)/i, "")
    .trim();

  return cleaned || text.trim();
};

/**
 * Robust non-streaming AI completion with automatic model failover & timeout guards
 */
export const callAiApi = async (messages, options = {}) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const maxTokens = options.maxTokens || 600;
  const temperature = options.temperature ?? 0.7;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout per model

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://anva.app",
          "X-Title": "Anva Study Assistant",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const rawText = await response.text();
      let data = null;
      try {
        data = JSON.parse(rawText.trim());
      } catch (parseErr) {
        throw new Error(`Invalid JSON from ${model}: ${rawText.slice(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data?.error?.message || `HTTP ${response.status}`);
      }

      const rawContent = data?.choices?.[0]?.message?.content;
      if (!rawContent) {
        throw new Error(`Empty content returned by ${model}`);
      }

      const cleaned = cleanAiResponse(rawContent);
      if (cleaned) {
        return cleaned;
      }
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ OpenRouter model [${model}] failed (${err.message}). Trying next fallback...`);
    }
  }

  console.error("🔥 All OpenRouter models exhausted:", lastError?.message);
  throw lastError || new Error("All AI models are currently busy.");
};

/**
 * Standard POST /api/assistant/chat (Non-streaming fallback)
 */
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
      image: image || undefined,
    });

    // 2. Retrieve recent history for conversational context (last 6 messages)
    const history = await ChatMessage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const formattedHistory = history.reverse().map((m) => {
      if (m.role === "user" && m.image) {
        return {
          role: "user",
          content: [
            { type: "text", text: m.content || "Analyze this image and explain." },
            { type: "image_url", image_url: { url: m.image } },
          ],
        };
      }
      return {
        role: m.role,
        content: m.content,
      };
    });

    const messages = [
      {
        role: "system",
        content:
          "You are Anva's expert AI Study & Code Assistant. Provide clear, accurate, direct, and concise explanations. Format code blocks cleanly with appropriate language tags. Never output internal thought processes or planning traces.",
      },
      ...formattedHistory,
    ];

    // 3. Call OpenRouter AI
    let reply = "";
    try {
      reply = await callAiApi(messages, { maxTokens: 600 });
    } catch {
      reply =
        "I'm here to help! Could you please rephrase or simplify your question so I can assist you right away?";
    }

    // 4. Save Assistant Reply to DB
    await ChatMessage.create({
      userId,
      role: "assistant",
      content: reply,
    });

    res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 Assistant backend error:", error.message);
    return res.status(200).json({
      reply: "❌ Encountered a momentary connection issue. Please try your question again.",
      isFallback: true,
    });
  }
};

/**
 * POST /api/assistant/chat/stream
 * Real-time SSE streaming for instant low-latency responses
 */
export const streamChatWithAssistant = async (req, res) => {
  const { message, image } = req.body;
  const userId = req.user._id;

  if (!message && !image) {
    return res.status(400).json({ message: "Message or image is required" });
  }

  // Set SSE Headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  // Save User Message to DB
  await ChatMessage.create({
    userId,
    role: "user",
    content: message || "Can you help me with this?",
    image: image || undefined,
  });

  // Retrieve recent context history
  const history = await ChatMessage.find({ userId })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  const formattedHistory = history.reverse().map((m) => {
    if (m.role === "user" && m.image) {
      return {
        role: "user",
        content: [
          { type: "text", text: m.content || "Analyze this image and explain." },
          { type: "image_url", image_url: { url: m.image } },
        ],
      };
    }
    return {
      role: m.role,
      content: m.content,
    };
  });

  const messages = [
    {
      role: "system",
      content:
        "You are Anva's expert AI Study & Code Assistant. Provide clear, accurate, direct, and concise explanations. Format code blocks cleanly with appropriate language tags. Never output internal thought processes, planning traces, or preamble.",
    },
    ...formattedHistory,
  ];

  const apiKey = process.env.OPENROUTER_API_KEY;
  let fullReply = "";
  let streamSucceeded = false;

  for (const model of CANDIDATE_MODELS) {
    if (streamSucceeded) break;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for stream start

      const upstreamRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://anva.app",
          "X-Title": "Anva Study Assistant",
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          max_tokens: 600,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!upstreamRes.ok || !upstreamRes.body) {
        continue;
      }

      const reader = upstreamRes.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(":")) continue;
          if (trimmed === "data: [DONE]") continue;

          if (trimmed.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const deltaContent = parsed.choices?.[0]?.delta?.content;
              if (deltaContent) {
                fullReply += deltaContent;
                streamSucceeded = true;
                res.write(`data: ${JSON.stringify({ delta: deltaContent })}\n\n`);
              }
            } catch {}
          }
        }
      }

      if (fullReply.trim()) {
        streamSucceeded = true;
        break;
      }
    } catch (streamErr) {
      console.warn(`⚠️ Stream attempt failed on ${model}:`, streamErr.message);
    }
  }

  // If streaming failed across candidates, fallback to non-streaming single call
  if (!streamSucceeded || !fullReply.trim()) {
    try {
      fullReply = await callAiApi(messages, { maxTokens: 600 });
      res.write(`data: ${JSON.stringify({ delta: fullReply })}\n\n`);
    } catch (fallbackErr) {
      fullReply = "I am ready to help! Please ask your study or programming question again.";
      res.write(`data: ${JSON.stringify({ delta: fullReply })}\n\n`);
    }
  }

  const finalCleanReply = cleanAiResponse(fullReply);

  // Save Assistant Reply to DB
  try {
    await ChatMessage.create({
      userId,
      role: "assistant",
      content: finalCleanReply || fullReply,
    });
  } catch (dbErr) {
    console.error("Failed to save assistant stream message to DB:", dbErr.message);
  }

  res.write(`data: ${JSON.stringify({ done: true, reply: finalCleanReply })}\n\n`);
  res.end();
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

    const reply = await callAiApi(
      [
        {
          role: "system",
          content:
            "You are a professional language and grammar assistant. Check the user's text for spelling, grammar, and syntax errors. If the grammar is correct, reply: '✅ Perfect grammar! No errors found.' If there are errors, provide: 1. Corrected version, 2. Brief explanation of corrections.",
        },
        { role: "user", content: text },
      ],
      { maxTokens: 300, temperature: 0.3 }
    );

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Assistant grammar error:", error.message);
    return res.status(200).json({
      reply: "❌ Grammar check unavailable right now. Please try again.",
      isFallback: true,
    });
  }
};
