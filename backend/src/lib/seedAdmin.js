import User from "../models/User.js";
import { upsertStreamUser } from "./stream.js";
import bcrypt from "bcryptjs";

/**
 * Ensures system administrator account exists securely.
 * Credentials can be supplied via environment variables (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME).
 */
export const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Administrator";

    // Clean up legacy test admin if present
    await User.deleteOne({ email: "ashok@gmail.com" });

    // If environment credentials are provided, ensure account is active and seeded
    if (adminEmail && adminPassword) {
      let adminUser = await User.findOne({ email: adminEmail });

      if (!adminUser) {
        const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(adminName)}`;
        adminUser = new User({
          fullName: adminName,
          email: adminEmail,
          password: adminPassword,
          role: "admin",
          isOnboarded: true,
          profilePic: avatar,
          bio: "Platform Administrator",
          nativeLanguage: "English",
          learningLanguage: "Spanish",
          location: "India",
        });
        await adminUser.save();
        console.log(`✅ Admin account initialized for ${adminEmail}`);

        try {
          await upsertStreamUser({
            id: adminUser._id.toString(),
            name: adminUser.fullName,
            image: adminUser.profilePic || "",
          });
        } catch (streamErr) {
          console.warn("Stream user sync notice:", streamErr.message);
        }
      } else {
        adminUser.role = "admin";
        adminUser.isOnboarded = true;
        await adminUser.save();
      }
    }
  } catch (error) {
    console.error("Notice during ensureDefaultAdmin:", error);
  }
};
