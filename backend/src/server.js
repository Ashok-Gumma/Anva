import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import assistantRoutes from "./routes/assistant.route.js";
import compilerRoutes from "./routes/compiler.route.js";
import clerkWebhookRoutes from "./routes/clerk.route.js";

import { connectDB } from "./lib/db.js";

import { globalLimiter, authLimiter } from "./middleware/rateLimiter.js";

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Proxy support (if behind Render, Heroku, etc.)
app.set("trust proxy", 1);

// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://anva-akzm.onrender.com", // production Render URL
].filter(Boolean);

// ✅ CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ⚡ Clerk webhook (RAW body BEFORE express.json)
app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhookRoutes
);

// ✅ Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// 🔥 Rate Limiting
app.use("/api/", globalLimiter);
app.use("/api/auth", authLimiter);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/compiler", compilerRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // backend/src/ → ../dist = backend/dist/ (committed to git, always exists on Render)
  const distPath = path.join(__dirname, "../dist");

  console.log("📁 Serving frontend from:", distPath);

  // Serve static files
  app.use(express.static(distPath));

  // Catch-all route (React Router)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        console.error("❌ sendFile error:", err.message);
        res.status(500).send("Frontend not found. Build may have failed.");
      }
    });
  });
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB();
});