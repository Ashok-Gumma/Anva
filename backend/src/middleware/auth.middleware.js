import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";
import { createClerkClient } from "@clerk/express";

// Clerk backend client — requires CLERK_SECRET_KEY in backend/.env
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * Dual-mode auth middleware:
 * 1. Clerk JWT via Authorization: Bearer header → auto-creates MongoDB user if missing
 *    - Uses Clerk API for full user data (name, email, photo)
 *    - Falls back to minimal user from JWT if CLERK_SECRET_KEY is missing/wrong
 * 2. Legacy JWT cookie (existing email/password users)
 */
export const protectRoute = async (req, res, next) => {
  try {
    // ── 1. Clerk Bearer token ────────────────────────────────────────────
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      const clerkToken = authHeader.split(" ")[1];
      const decoded = jwt.decode(clerkToken);

      if (decoded?.sub) {
        const clerkId = decoded.sub;

        // Look up existing MongoDB user
        let user = await User.findOne({ clerkId }).select("-password");

        if (!user) {
          // ── Auto-create on first login ────────────────────────────────
          let email, fullName, profilePic;

          try {
            // Preferred: fetch rich user data from Clerk API
            const clerkUser = await clerkClient.users.getUser(clerkId);
            email = clerkUser.emailAddresses?.[0]?.emailAddress;
            fullName =
              [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
              email?.split("@")[0] ||
              "Anva User";
            profilePic =
              clerkUser.imageUrl ||
              `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}.png`;
          } catch {
            // Fallback: create minimal user from JWT claims
            // This happens when CLERK_SECRET_KEY is missing from backend/.env
            console.warn("⚠️  Clerk API call failed — creating minimal user from JWT.");
            console.warn("    Add CLERK_SECRET_KEY to backend/.env for full user data sync.");
            email = `${clerkId}@clerk.local`;
            fullName = decoded.name || decoded.username || "Anva User";
            profilePic = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}.png`;
          }

          // Link to existing account if email matches (e.g. Google OAuth user)
          const existingByEmail =
            email && !email.endsWith("@clerk.local")
              ? await User.findOne({ email })
              : null;

          if (existingByEmail) {
            existingByEmail.clerkId = clerkId;
            await existingByEmail.save();
            user = await User.findById(existingByEmail._id).select("-password");
          } else {
            // Create brand new user
            const newUser = await User.create({
              clerkId,
              email,
              fullName,
              profilePic,
              password: "",
              isOnboarded: false,
            });

            // Register on Stream.io
            try {
              await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
              });
            } catch (streamErr) {
              console.error("Stream user creation failed:", streamErr.message);
            }

            user = await User.findById(newUser._id).select("-password");
            console.log(`✅ Auto-created MongoDB user: ${email}`);
          }
        }

        req.user = user;
        return next();
      }
    }

    // ── 2. Legacy JWT cookie ─────────────────────────────────────────────
    const token = req.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError")
        return res.status(401).json({ message: "Unauthorized - Token expired" });
      if (err.name === "JsonWebTokenError")
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
      return res.status(401).json({ message: "Unauthorized - Token error" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized - User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
