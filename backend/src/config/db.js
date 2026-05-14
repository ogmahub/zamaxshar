import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log("MongoDB connected (Atlas)");
      return;
    } catch (error) {
      console.warn("MongoDB Atlas connection failed, using in-memory MongoDB");
      console.warn("For production, ensure MONGO_URI is correct and IP is whitelisted");
    }
  }

  // Fallback to in-memory for deployment
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri());
  console.log("MongoDB connected (in-memory)");
  return mem;
};
