import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import assistantRoutes from "./routes/assistant.route.js";
import compilerRoutes from "./routes/compiler.route.js";
import clerkWebhookRoutes from "./routes/clerk.route.js";
import supportRoutes from "./routes/support.route.js";
import adminRoutes from "./routes/admin.route.js";
import notificationRoutes from "./routes/notification.route.js";
import postRoutes from "./routes/post.route.js";

import { connectDB } from "./lib/db.js";
import { ensureDefaultAdmin } from "./lib/seedAdmin.js";

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
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "https://anva-akzm.onrender.com", // production Render URL
  process.env.CLIENT_URL,
].filter(Boolean);

// ✅ CORS config
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow any localhost / 127.0.0.1 port in development
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }

      // Allow configured origins
      if (allowedOrigins.includes(origin)) {
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
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth/login", authLimiter);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postRoutes);

// ✅ Serve frontend static assets (Images, Favicons, PDFs)
const distPath = path.join(__dirname, "../dist");
const publicPath = path.join(__dirname, "../../frontend/public");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

if (process.env.NODE_ENV === "production") {
  // Catch-all route for Single Page Application
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        console.error("❌ sendFile error:", err.message);
        res.status(500).send("Frontend not found.");
      }
    });
  });
}

// ✅ Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  await connectDB();
  await ensureDefaultAdmin();
}); 