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

const app = express();
const PORT = process.env.PORT || 5001;

// __dirname fix for ES Modules — resolves to backend/src/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ⚡ Clerk webhook needs RAW body for Svix signature verification — register BEFORE express.json()
app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhookRoutes
);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/compiler", compilerRoutes);

if (process.env.NODE_ENV === "production") {
  // __dirname = backend/src/ → ../dist = backend/dist/
  const distPath = path.join(__dirname, "../dist");
  console.log("📁 Serving frontend from:", distPath);
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        console.error("sendFile error:", err.message, "| distPath:", distPath);
        res.status(500).send("Frontend not found. Build may have failed.");
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB();
});
