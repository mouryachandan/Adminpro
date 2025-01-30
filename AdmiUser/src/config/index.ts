import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const connectionMethod = await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
    console.log(`✅ DATABASE CONNECTED SUCCESSFULLY: ${connectionMethod.connection.host}`);
  } catch (error) {
    console.error("❌ DATABASE CONNECTION FAILED:", error.message);
    process.exit(1);
  }
};
