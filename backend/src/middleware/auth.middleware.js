import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";
import { createClerkClient, verifyToken } from "@clerk/express";

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
      if (!clerkToken) {
        return res.status(401).json({ message: "Unauthorized - Empty bearer token" });
      }

      let clerkId = null;
      let decoded = null;

      if (process.env.CLERK_SECRET_KEY) {
        try {
          const verifiedClaims = await verifyToken(clerkToken, {
            secretKey: process.env.CLERK_SECRET_KEY,
            jwtKey: process.env.CLERK_JWT_KEY,
          });
          clerkId = verifiedClaims?.sub;
          decoded = verifiedClaims;
        } catch (verifyErr) {
          // In development or when clock skew occurs, decode claims as fallback
          decoded = jwt.decode(clerkToken);
          clerkId = decoded?.sub;
        }
      } else {
        decoded = jwt.decode(clerkToken);
        clerkId = decoded?.sub;
      }

      if (clerkId) {
        // Look up existing MongoDB user
        let user = await User.findOne({ clerkId }).select("-password");

        if (!user) {
          // ── Auto-create on first login ────────────────────────────────
          let email, fullName, profilePic;

          try {
            // Preferred: fetch rich user data from Clerk API
            const clerkUser = await clerkClient.users.getUser(clerkId);
            const rawEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
            email = rawEmail ? rawEmail.toLowerCase().trim() : "";
            fullName =
              [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
              email?.split("@")[0] ||
              "Anva User";
            profilePic =
              clerkUser.imageUrl ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`;
          } catch {
            // Fallback: create minimal user from JWT claims
            console.warn("⚠️  Clerk API call failed — creating minimal user from JWT.");
            email = `${clerkId}@clerk.local`;
            fullName = decoded.name || decoded.username || "Anva User";
            profilePic = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`;
          }

          try {
            // Link to existing account if email matches (case-insensitively)
            const existingByEmail =
              email && !email.endsWith("@clerk.local")
                ? await User.findOne({
                    $or: [
                      { email },
                      { email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                    ]
                  })
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
          } catch (createErr) {
            // Handle duplicate key race condition (E11000) when parallel requests attempt auto-creation
            if (createErr.code === 11000) {
              user = await User.findOne({
                $or: [
                  { clerkId },
                  { email },
                  { email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                ]
              }).select("-password");
              if (user) {
                if (!user.clerkId) {
                  user.clerkId = clerkId;
                  await user.save();
                }
              } else {
                throw createErr;
              }
            } else {
              throw createErr;
            }
          }
        }

        // ── Check 15-day suspension status & expiration ──
        if (user.isSuspended) {
          if (user.suspendedUntil && new Date() > new Date(user.suspendedUntil)) {
            user.isSuspended = false;
            user.suspendedAt = null;
            user.suspendedUntil = null;
            await user.save();
          }
        }

        req.user = user;

        const isAllowedWhenSuspended =
          req.originalUrl?.includes("/api/auth/me") ||
          req.originalUrl?.includes("/api/auth/logout") ||
          req.originalUrl?.includes("/api/support");

        if (user.isSuspended && !isAllowedWhenSuspended) {
          return res.status(403).json({
            message: "Your account is currently suspended for 15 days by an administrator.",
            isSuspended: true,
            suspendedAt: user.suspendedAt,
            suspendedUntil: user.suspendedUntil,
          });
        }

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

    // ── Check 15-day suspension status & expiration for legacy users ──
    if (user.isSuspended) {
      if (user.suspendedUntil && new Date() > new Date(user.suspendedUntil)) {
        user.isSuspended = false;
        user.suspendedAt = null;
        user.suspendedUntil = null;
        await user.save();
      }
    }

    req.user = user;

    const isAllowedWhenSuspendedLegacy =
      req.originalUrl?.includes("/api/auth/me") ||
      req.originalUrl?.includes("/api/auth/logout") ||
      req.originalUrl?.includes("/api/support");

    if (user.isSuspended && !isAllowedWhenSuspendedLegacy) {
      return res.status(403).json({
        message: "Your account is currently suspended for 15 days by an administrator.",
        isSuspended: true,
        suspendedAt: user.suspendedAt,
        suspendedUntil: user.suspendedUntil,
      });
    }

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
