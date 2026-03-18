import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const streamToken = generateStreamToken(req.user._id); // ✅ use _id

    res.status(200).json({
      streamToken, // ✅ MUST MATCH FRONTEND
    });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}