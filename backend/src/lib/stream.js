import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// ✅ SAFE UPSERT (NEVER THROWS)
export const upsertStreamUser = async (userData) => {
  try {
    const users = Array.isArray(userData) ? userData : [userData];

    const safeUsers = users.map((u) => ({
      id: String(u.id),

      // limit size
      name: (u.name || "").slice(0, 50),

      // ❌ block large/base64 images
      image:
        typeof u.image === "string" && u.image.startsWith("http")
          ? u.image
          : "",
    }));

    await streamClient.upsertUsers(safeUsers);

    return true;
  } catch (error) {
    console.log("⚠️ Stream error ignored:", error.message);

    // ✅ NEVER THROW
    return false;
  }
};

// ✅ TOKEN
export const generateStreamToken = (userId) => {
  try {
    return streamClient.createToken(String(userId));
  } catch (err) {
    console.log("Stream token error:", err.message);
    return null;
  }
};