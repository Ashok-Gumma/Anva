import { Webhook } from "svix";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export async function handleClerkWebhook(req, res) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return res.status(500).json({ message: "Webhook secret not configured" });
  }

  // Svix headers
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ message: "Missing svix headers" });
  }

  let payload;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    payload = wh.verify(req.body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).json({ message: "Webhook verification failed" });
  }

  const { type, data } = payload;
  console.log(`📨 Clerk webhook: ${type}`);

  try {
    if (type === "user.created") {
      const { id: clerkId, email_addresses, first_name, last_name, image_url } = data;
      const email = email_addresses?.[0]?.email_address;
      const fullName = [first_name, last_name].filter(Boolean).join(" ") || email;

      // Check if user already exists (e.g. via Google OAuth earlier)
      let user = await User.findOne({ email });

      if (!user) {
        // Create new MongoDB user for Clerk-signed-up user
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = image_url || `https://avatar.iran.liara.run/public/${idx}.png`;

        user = await User.create({
          clerkId,
          email,
          fullName,
          profilePic: randomAvatar,
          password: "", // No password for Clerk users
          isOnboarded: false,
        });

        // Create Stream user
        try {
          await upsertStreamUser({
            id: user._id.toString(),
            name: user.fullName,
            image: user.profilePic || "",
          });
        } catch (streamErr) {
          console.error("Stream user creation failed:", streamErr.message);
        }

        console.log(`✅ Created MongoDB user for Clerk user: ${email}`);
      } else {
        // Already exists, just link clerkId
        user.clerkId = clerkId;
        await user.save();
        console.log(`🔗 Linked Clerk ID to existing user: ${email}`);
      }
    }

    if (type === "user.updated") {
      const { id: clerkId, first_name, last_name, image_url } = data;
      const fullName = [first_name, last_name].filter(Boolean).join(" ");

      const user = await User.findOne({ clerkId });
      if (user) {
        if (fullName) user.fullName = fullName;
        if (image_url) user.profilePic = image_url;
        await user.save();

        await upsertStreamUser({
          id: user._id.toString(),
          name: user.fullName,
          image: user.profilePic || "",
        }).catch(() => {});

        console.log(`🔄 Updated user from Clerk: ${clerkId}`);
      }
    }

    if (type === "user.deleted") {
      const { id: clerkId } = data;
      const user = await User.findOne({ clerkId });
      if (user) {
        // Soft delete — just clear clerkId so they lose Clerk login
        user.clerkId = "";
        await user.save();
        console.log(`🗑️ Unlinked deleted Clerk user: ${clerkId}`);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling Clerk webhook:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
