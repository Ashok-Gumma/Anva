import User from "../models/User.js";
import { upsertStreamUser } from "./stream.js";
import bcrypt from "bcryptjs";

export const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = "ashok@gmail.com";
    const adminPassword = "Ashok@2185";
    const adminName = "Ashok Admin";

    // Remove admin role from previous test email if present
    await User.updateOne({ email: "ashokgumma20@gmail.com" }, { role: "user" });

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
        location: "Global",
      });
      await adminUser.save();
      console.log(`✅ Admin account created: ${adminEmail}`);

      try {
        await upsertStreamUser({
          id: adminUser._id.toString(),
          name: adminUser.fullName,
          image: adminUser.profilePic || "",
        });
      } catch (streamErr) {
        console.warn("Stream user creation notice:", streamErr.message);
      }
    } else {
      let isPasswordValid = false;
      if (adminUser.password) {
        try {
          isPasswordValid = await adminUser.matchPassword(adminPassword);
        } catch (err) {
          isPasswordValid = false;
        }
      }

      adminUser.role = "admin";
      adminUser.isOnboarded = true;

      if (!isPasswordValid) {
        const salt = await bcrypt.genSalt(10);
        adminUser.password = await bcrypt.hash(adminPassword, salt);
        console.log(`✅ Admin password reset & set for ${adminEmail}`);
      }

      await adminUser.save();
      console.log(`✅ Admin privileges verified for ${adminEmail}`);
    }
  } catch (error) {
    console.error("Notice during ensureDefaultAdmin:", error);
  }
};
