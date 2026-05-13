import mongoose from "mongoose";

const tryConnect = async (uri, label) => {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
  console.log(`MongoDB connected (${label})`);
};

const startMemoryServer = async () => {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const mem = await MongoMemoryServer.create({
    instance: { dbName: "zamaxshar" }
  });
  const uri = mem.getUri();
  await tryConnect(uri, "in-memory");
  return mem;
};

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri && !uri.includes("127.0.0.1") && !uri.includes("localhost")) {
    try {
      await tryConnect(uri, "atlas");
      return;
    } catch (error) {
      console.warn(`Atlas connection failed: ${error.message}`);
      console.warn("Falling back to in-memory MongoDB...");
    }
  } else if (uri) {
    try {
      await tryConnect(uri, "local");
      return;
    } catch (error) {
      console.warn(`Local MongoDB not running: ${error.message}`);
      console.warn("Falling back to in-memory MongoDB...");
    }
  }

  await startMemoryServer();
};
