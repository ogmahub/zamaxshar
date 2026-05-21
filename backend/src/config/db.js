import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log("MongoDB connected (Atlas)");
      
      // Eski unikal indeksni to'liq o'chirib tashlash (agar mavjud bo'lsa)
      try {
        await mongoose.connection.db.collection("groups").dropIndex("teacher_1_name_1");
        console.log("Eski unikal indeks (teacher_1_name_1) muvaffaqiyatli o'chirildi.");
      } catch (indexError) {
        // Agar indeks allaqachon o'chirilgan bo'lsa yoki yo'q bo'lsa, xatolikni o'tkazib yuboramiz
      }
      
      return;
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          `MongoDB Atlas connection failed: ${error.message}. Productionda MONGO_URI to'g'ri bo'lishi kerak.`
        );
      }

      console.warn("MongoDB Atlas connection failed, using in-memory MongoDB for development");
      console.warn("For production, ensure MONGO_URI is correct and IP is whitelisted");
    }
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("MONGO_URI topilmadi. Productionda doimiy MongoDB ulanishi kerak.");
  }

  // Fallback to in-memory for deployment
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri());
  console.log("MongoDB connected (in-memory)");
  return mem;
};
