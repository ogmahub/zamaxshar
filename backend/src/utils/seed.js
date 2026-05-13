import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import { hashPassword } from "./hashPassword.js";

dotenv.config();

const run = async () => {
  await connectDB();

  console.log("Eski ma'lumotlar tozalanmoqda...");
  await Promise.all([
    Admin.deleteMany(),
    Course.deleteMany(),
    Teacher.deleteMany(),
    Student.deleteMany()
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

  console.log("Ustozlar yaratilmoqda...");
  const teachers = await Teacher.insertMany([
    {
      name: "Saodat Xolmatova",
      phone: "+998901234567",
      subject: "Ona tili va adabiyot",
      bio: "12 yillik tajribaga ega ona tili va adabiyot fani o'qituvchisi."
    },
    {
      name: "Bobur Karimov",
      phone: "+998901234568",
      subject: "Matematika",
      bio: "Matematika fani o'qituvchisi, DTM mutaxassisi."
    },
    {
      name: "Madina Yusupova",
      phone: "+998901234569",
      subject: "Ingliz tili",
      bio: "IELTS 8.5, 8 yillik tajribaga ega ingliz tili o'qituvchisi."
    }
  ]);

  console.log("Demo student yaratilmoqda...");
  await Student.create({
    firstName: "Ali",
    lastName: "Valiyev",
    phone: "+998901111111",
    passwordHash: await hashPassword("12345"),
    course: courses[0]._id,
    teacher: teachers[0]._id,
    paymentStatus: "paid",
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
  });

  console.log("Seed tugadi.");
  console.log("Admin login: admin / admin123");
  console.log("Student login: +998901111111 / 12345");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
