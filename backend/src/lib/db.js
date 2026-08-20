import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 50,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to prevent slow IPv6 DNS resolution
    });
    console.log(`⚡ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error in connecting to MongoDB:", error);
    process.exit(1);
  }
};

