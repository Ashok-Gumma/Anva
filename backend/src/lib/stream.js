import { StreamChat } from "stream-chat";
import "dotenv/config";

// Validate environment variables early
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "STREAM_API_KEY and STREAM_API_SECRET must be set in your .env file"
  );
}

// Initialize client once (singleton pattern recommended)
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// Optional: Set log level in development
// streamClient.logger = (level, msg, extra) => console.log(`[${level}] ${msg}`, extra);

/**
 * Upserts a single user or multiple users into Stream Chat
 * @param {Object|Array} userData - Single user object or array of user objects
 * @returns {Promise<Object|Array>} The upserted user(s)
 */
export const upsertStreamUser = async (userData) => {
  if (!userData || (Array.isArray(userData) && userData.length === 0)) {
    throw new Error("userData is required and cannot be empty");
  }

  try {
    // Stream accepts both single object and array
    const users = Array.isArray(userData) ? userData : [userData];

    await streamClient.upsertUsers(users);

    // Return the original input (or you could return response from Stream)
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user(s):", error.message || error);
    throw error; // re-throw so caller can handle it
  }
};

/**
 * Generates a secure user token for Stream Chat authentication
 * @param {string|number} userId - The user ID (must be unique)
 * @param {number} [exp] - Optional expiration time in seconds (Unix timestamp)
 * @returns {string} JWT token
 */
export const generateStreamToken = (userId, exp) => {
  if (!userId) {
    throw new Error("userId is required to generate Stream token");
  }

  try {
    const userIdStr = userId.toString();

    // Optionally set token expiration (recommended for security)
    // e.g., expires in 24 hours
    if (exp) {
      return streamClient.createToken(userIdStr, exp);
    }

    // Default: no expiration (less secure, but common in dev)
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error.message || error);
    throw error;
  }
};