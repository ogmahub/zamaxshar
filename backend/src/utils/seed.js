import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";
import Course from "../models/Course.js";
import { hashPassword } from "./hashPassword.js";

dotenv.config();

const run = async () => {
  await connectDB();

  console.log("Eski ma'lumotlar tozalanmoqda...");
  await Promise.all([
    Admin.deleteMany(),
    Course.deleteMany(),
  ]);

  console.log("Admin yaratilmoqda...");
  await Admin.create({
    username: process.env.ADMIN_USERNAME || "admin",
    passwordHash: await hashPassword(process.env.ADMIN_PASSWORD || "admin123")
  });

  console.log("Kurslar yaratilmoqda...");
  const courses = await Course.insertMany([
    {
      titleUz: "Ona tili va adabiyot",
      titleRu: "Родной язык и литература",
      titleEn: "Native Language & Literature",
      descriptionUz: "Imlo, matn tahlili va insho yozish bo'yicha kurs.",
      descriptionRu: "Курс по орфографии, анализу текста и сочинению.",
      descriptionEn: "Course on spelling, text analysis and essay writing.",
      price: 500000,
      duration: "6 oy",
      format: "offline",
      modules: ["Fonetika", "Morfologiya", "Sintaksis", "Adabiyot tahlili"],
      results: ["To'g'ri imlo", "Insho yozish", "Adabiy tahlil"]
    },
    {
      titleUz: "Matematika",
      titleRu: "Математика",
      titleEn: "Mathematics",
      descriptionUz: "DTM va xalqaro testlarga tayyorlov kursi.",
      descriptionRu: "Курс подготовки к DTM и международным тестам.",
      descriptionEn: "Preparation course for DTM and international tests.",
      price: 600000,
      duration: "8 oy",
      format: "offline",
      modules: ["Algebra", "Geometriya", "Trigonometriya"],
      results: ["DTM-ga tayyorlik", "IELTS Math", "SAT"]
    },
    {
      titleUz: "Ingliz tili",
      titleRu: "Английский язык",
      titleEn: "English Language",
      descriptionUz: "IELTS va CEFR sertifikatiga tayyorlov.",
      descriptionRu: "Подготовка к IELTS и CEFR.",
      descriptionEn: "IELTS and CEFR preparation course.",
      price: 700000,
      duration: "10 oy",
      format: "online",
      modules: ["Grammar", "Speaking", "Writing", "Listening"],
      results: ["IELTS 6.5+", "CEFR B2+"]
    }
  ]);

  console.log("Seed tugadi.");
  console.log("Admin login: admin / admin123");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
