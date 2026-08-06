/**
 * Fast & Lightweight Content Safety Inspection
 * Powered by sub-millisecond pattern checks + NVIDIA Nemotron 3.5 Content Safety AI via OpenRouter
 */

// Prohibited restricted, profane, and violent terms
const RESTRICTED_TERMS = [
  // Profanity & Vulgarity
  "fuck", "fucking", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy",
  "cock", "whore", "slut", "motherfucker", "wtf", "stfu",

  // Violence & Harm
  "violence", "gore", "blood", "behead", "murder", "suicide", "kill", "killing",
  "slaughter", "die", "death", "bomb", "weapon", "shoot", "gun", "stab", "terrorist",

  // Explicit & Adult Content
  "nude", "naked", "nsfw", "explicit", "porn", "porno", "sex", "xxx", "erotic",

  // Hate Speech & Harassment
  "hate speech", "hitler", "nazi", "racist", "abuse", "abusive", "harass"
];

/**
 * Fast local text safety validation (sub-millisecond)
 */
export function checkTextSafety(text = "") {
  if (!text) return { isValid: true };

  const normalized = text
    .toLowerCase()
    .replace(/[@@]/g, "a")
    .replace(/[$]/g, "s")
    .replace(/[!1i|]/g, "i")
    .replace(/0/g, "o")
    .replace(/[*_~`\-+=\/\\|]/g, "");

  for (const term of RESTRICTED_TERMS) {
    if (normalized.includes(term)) {
      return {
        isValid: false,
        reason: `🚫 Warning: Post blocked. The restricted term "${term}" violates Anva's community safety rules. Please maintain a constructive environment.`
      };
    }
  }

  return { isValid: true };
}

/**
 * AI-Powered Advanced Content Moderation using NVIDIA Nemotron 3.5 Content Safety (OpenRouter)
 */
export async function checkTextSafetyAI(text = "") {
  if (!text || !text.trim()) return { isValid: true };

  // Step 1: Fast local pre-check first
  const localCheck = checkTextSafety(text);
  if (!localCheck.isValid) {
    return localCheck;
  }

  // Step 2: OpenRouter AI Content Moderation
  const apiKey = process.env.OPENROUTER_API_KEY;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout guard

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5001",
        "X-Title": "Anva Platform",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3.5-content-safety:free",
        messages: [{ role: "user", content: text }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const aiContent = data?.choices?.[0]?.message?.content || "";

      if (aiContent.toLowerCase().includes("user safety: unsafe")) {
        const categoriesLine = aiContent
          .split("\n")
          .find((line) => line.toLowerCase().includes("safety categories:"));
        const category = categoriesLine
          ? categoriesLine.split(":")[1]?.trim()
          : "Violent or Restricted Content";

        return {
          isValid: false,
          reason: `🚫 Warning: Post blocked by NVIDIA Nemotron Safety AI (${category}). Please keep community content safe and respectful.`,
        };
      }
    }
  } catch (error) {
    console.warn("⚠️ AI Content Moderation fallback to local safety check:", error.message);
  }

  return { isValid: true };
}

/**
 * Fast inspection of Base64 image or PDF payload
 */
export function checkMediaSafety(mediaDataUrl = "", fileName = "") {
  if (!mediaDataUrl) return { isValid: true };

  // Check file extension / filename if provided
  if (fileName) {
    const lowerName = fileName.toLowerCase();
    for (const term of RESTRICTED_TERMS) {
      if (lowerName.includes(term)) {
        return {
          isValid: false,
          reason: "File name contains restricted terms."
        };
      }
    }
  }

  // Validate Data URL structure
  if (!mediaDataUrl.startsWith("data:")) {
    // Standard URL or relative path - pass
    return { isValid: true };
  }

  // Extract header and payload
  const [header, base64Data] = mediaDataUrl.split(",");
  if (!base64Data) {
    return { isValid: false, reason: "Corrupted or invalid media payload." };
  }

  // Allowed MIME types
  const allowedMime = [
    "data:image/jpeg",
    "data:image/jpg",
    "data:image/png",
    "data:image/webp",
    "data:image/gif",
    "data:application/pdf"
  ];

  const isAllowed = allowedMime.some(mime => header.toLowerCase().includes(mime));
  if (!isAllowed) {
    return {
      isValid: false,
      reason: "Unsupported or unsafe file format. Only JPEG, PNG, WEBP, GIF images and PDF documents are allowed."
    };
  }

  // File size sanity check (max 12MB base64 ~ 9MB binary)
  const approximateSizeBytes = (base64Data.length * 3) / 4;
  if (approximateSizeBytes > 12 * 1024 * 1024) {
    return {
      isValid: false,
      reason: "File size exceeds the 10MB safety limit."
    };
  }

  return { isValid: true };
}
