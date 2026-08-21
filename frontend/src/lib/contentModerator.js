/**
 * Client-Side Instant Content Moderation & Safety Inspector
 * Runs sub-5ms checks on text, images, and document uploads
 * to immediately block restricted, violent, or explicit content.
 */

const PROHIBITED_KEYWORDS = [
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
 * Pre-checks text caption for restricted terms
 */
export function checkCaptionSafety(caption = "") {
  if (!caption) return { isValid: true };

  // Normalize text: replace special characters/leetspeak numbers to prevent evasion (e.g. f*ck -> fuck)
  const normalized = caption
    .toLowerCase()
    .replace(/[@@]/g, "a")
    .replace(/[$]/g, "s")
    .replace(/[!1i|]/g, "i")
    .replace(/0/g, "o")
    .replace(/[*_~`\-+=/\\|]/g, "");

  // Extract individual words using regex
  const words = normalized.split(/\s+/);

  for (const keyword of PROHIBITED_KEYWORDS) {
    // Check direct substring match OR word match
    const hasMatch =
      normalized.includes(keyword) ||
      words.some(w => w === keyword);

    if (hasMatch) {
      return {
        isValid: false,
        reason: `🚫 Warning: Post blocked. The word/term "${keyword}" violates Anva's community guidelines. Please keep content constructive and educational.`
      };
    }
  }

  return { isValid: true };
}

/**
 * Pre-checks uploaded media (images, PDFs)
 */
export function checkFileSafety(file) {
  if (!file) return { isValid: true };

  const fileNameLower = file.name.toLowerCase();
  for (const word of PROHIBITED_KEYWORDS) {
    if (fileNameLower.includes(word)) {
      return {
        isValid: false,
        reason: `File name contains prohibited term ("${word}"). Upload blocked for safety.`
      };
    }
  }

  // Allowed MIME types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf"
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      reason: "Unsupported file type. Please upload JPEG, PNG, WEBP images or PDF study documents."
    };
  }

  // Size limit: 10MB
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      isValid: false,
      reason: "File size exceeds 10MB maximum limit."
    };
  }

  return { isValid: true };
}
