import mongoose from "mongoose";
import dns from "dns";

// Fix for Windows ETIMEOUT SRV lookup errors on Node.js
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore if custom DNS cannot be set
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 50,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to prevent slow IPv6 DNS resolution
    });
    console.log(`⚡ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error in connecting to MongoDB:", error);
    // Retry once after 3 seconds before exiting
    setTimeout(async () => {
      try {
        console.log("🔄 Retrying MongoDB connection...");
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 15000,
          family: 4,
        });
        console.log(`⚡ MongoDB Connected on retry: ${conn.connection.host}`);
      } catch (err) {
        console.error("❌ MongoDB retry failed:", err);
      }
    }, 3000);
  }
};
