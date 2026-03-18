import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const token = generateStreamToken(userId);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Token error:", error.message);
    res.status(500).json({ message: "Failed to generate token" });
  }
};