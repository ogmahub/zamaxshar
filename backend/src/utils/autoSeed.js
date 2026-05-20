import Admin from "../models/Admin.js";
import Course from "../models/Course.js";
import { hashPassword } from "./hashPassword.js";

export const autoSeedIfEmpty = async () => {
  if (process.env.ENABLE_AUTO_SEED !== "true") return;

  const adminCount = await Admin.countDocuments();
  if (adminCount > 0) return;

  console.log("DB bo'sh, demo ma'lumotlar yaratilmoqda...");

  await Admin.create({
    username: process.env.ADMIN_USERNAME || "ZAMAXSHAR12",
    passwordHash: await hashPassword(process.env.ADMIN_PASSWORD || "zamaxshar"),
    isSuperAdmin: true,
    permissions: ["applications", "students", "teachers", "admins"]
  });

  const courses = await Course.insertMany([
    {
      titleUz: "Ona tili", titleRu: "Родной язык", titleEn: "Native Language",
      descriptionUz: "Fonetika, leksikologiya, imlo va punktuatsiya bo'yicha kurs.",
      descriptionRu: "Курс по фонетике, лексикологии, орфографии и пунктуации.",
      descriptionEn: "Course on phonetics, lexicology, spelling and punctuation.",
      price: 400000, duration: "6 oy", format: "offline",
      modules: ["Fonetika", "Leksikologiya", "Morfologiya", "Sintaksis", "Imlo"],
      results: ["To'g'ri imlo", "Savodli yozish", "DTM-ga tayyorlik"]
    },
    {
      titleUz: "Adabiyot", titleRu: "Литература", titleEn: "Literature",
      descriptionUz: "O'zbek va jahon adabiyoti, insho yozish va matn tahlili.",
      descriptionRu: "Узбекская и мировая литература, написание сочинений.",
      descriptionEn: "Uzbek and world literature, essay writing and text analysis.",
      price: 400000, duration: "6 oy", format: "offline",
      modules: ["Mumtoz adabiyot", "Zamonaviy adabiyot", "Jahon adabiyoti", "Insho"],
      results: ["Adabiy tahlil", "Insho yozish", "Mustaqil fikrlash"]
    },
    {
      titleUz: "Matematika", titleRu: "Математика", titleEn: "Mathematics",
      descriptionUz: "Umumiy matematika, DTM va xalqaro testlarga tayyorlov.",
      descriptionRu: "Общая математика, подготовка к DTM и международным тестам.",
      descriptionEn: "General mathematics, DTM and international test preparation.",
      price: 600000, duration: "8 oy", format: "offline",
      modules: ["Arifmetika", "Algebra", "Geometriya", "Test masalalari"],
      results: ["DTM-ga tayyorlik", "Mantiqiy fikrlash"]
    },
    {
      titleUz: "Algebra", titleRu: "Алгебра", titleEn: "Algebra",
      descriptionUz: "Tenglamalar, funksiyalar va algebraik ifodalar kursi.",
      descriptionRu: "Курс уравнений, функций и алгебраических выражений.",
      descriptionEn: "Course on equations, functions and algebraic expressions.",
      price: 500000, duration: "6 oy", format: "offline",
      modules: ["Tenglamalar", "Tengsizliklar", "Funksiyalar", "Progressiyalar"],
      results: ["Murakkab masalalarni yechish", "DTM-ga tayyorlik"]
    },
    {
      titleUz: "Geometriya", titleRu: "Геометрия", titleEn: "Geometry",
      descriptionUz: "Planimetriya va stereometriya asoslari.",
      descriptionRu: "Основы планиметрии и стереометрии.",
      descriptionEn: "Fundamentals of planimetry and stereometry.",
      price: 500000, duration: "6 oy", format: "offline",
      modules: ["Planimetriya", "Stereometriya", "Vektorlar", "Trigonometriya"],
      results: ["Fazoviy tasavvur", "Geometrik isbotlash"]
    },
    {
      titleUz: "Fizika", titleRu: "Физика", titleEn: "Physics",
      descriptionUz: "Mexanika, elektr, optika va zamonaviy fizika.",
      descriptionRu: "Механика, электричество, оптика и современная физика.",
      descriptionEn: "Mechanics, electricity, optics and modern physics.",
      price: 550000, duration: "8 oy", format: "offline",
      modules: ["Mexanika", "Molekulyar fizika", "Elektr", "Optika", "Atom fizikasi"],
      results: ["Tabiat qonunlarini tushunish", "DTM-ga tayyorlik"]
    },
    {
      titleUz: "Kimyo", titleRu: "Химия", titleEn: "Chemistry",
      descriptionUz: "Anorganik va organik kimyo, kimyoviy masalalar.",
      descriptionRu: "Неорганическая и органическая химия, химические задачи.",
      descriptionEn: "Inorganic and organic chemistry, chemical problems.",
      price: 550000, duration: "8 oy", format: "offline",
      modules: ["Anorganik kimyo", "Organik kimyo", "Kimyoviy reaksiyalar", "Masalalar"],
      results: ["Modda tuzilishini tushunish", "DTM-ga tayyorlik"]
    },
    {
      titleUz: "Biologiya", titleRu: "Биология", titleEn: "Biology",
      descriptionUz: "Botanika, zoologiya, anatomiya va genetika.",
      descriptionRu: "Ботаника, зоология, анатомия и генетика.",
      descriptionEn: "Botany, zoology, anatomy and genetics.",
      price: 500000, duration: "6 oy", format: "offline",
      modules: ["Botanika", "Zoologiya", "Inson anatomiyasi", "Genetika", "Ekologiya"],
      results: ["Tirik dunyoni tushunish", "Tibbiyot fakultetiga tayyorlik"]
    },
    {
      titleUz: "Tarix", titleRu: "История", titleEn: "History",
      descriptionUz: "O'zbekiston va jahon tarixi kursi.",
      descriptionRu: "Курс истории Узбекистана и мира.",
      descriptionEn: "Course of Uzbekistan and world history.",
      price: 400000, duration: "6 oy", format: "offline",
      modules: ["Qadimgi davr", "O'rta asrlar", "Yangi davr", "Eng yangi tarix"],
      results: ["Tarixiy bilim", "DTM-ga tayyorlik"]
    },
    {
      titleUz: "Geografiya", titleRu: "География", titleEn: "Geography",
      descriptionUz: "Tabiiy va iqtisodiy geografiya.",
      descriptionRu: "Физическая и экономическая география.",
      descriptionEn: "Physical and economic geography.",
      price: 400000, duration: "6 oy", format: "offline",
      modules: ["Tabiiy geografiya", "Iqtisodiy geografiya", "Kartografiya"],
      results: ["Dunyo xaritasini bilish", "DTM-ga tayyorlik"]
    },
    {
      titleUz: "Ingliz tili", titleRu: "Английский язык", titleEn: "English Language",
      descriptionUz: "IELTS va CEFR sertifikatiga tayyorlov kursi.",
      descriptionRu: "Подготовка к IELTS и CEFR.",
      descriptionEn: "IELTS and CEFR preparation course.",
      price: 700000, duration: "10 oy", format: "online",
      modules: ["Grammar", "Speaking", "Writing", "Listening", "Reading"],
      results: ["IELTS 6.5+", "CEFR B2+", "Erkin gaplashish"]
    },
    {
      titleUz: "Informatika", titleRu: "Информатика", titleEn: "Computer Science",
      descriptionUz: "Kompyuter savodxonligi, dasturlash asoslari.",
      descriptionRu: "Компьютерная грамотность, основы программирования.",
      descriptionEn: "Computer literacy, programming basics.",
      price: 600000, duration: "8 oy", format: "online",
      modules: ["Kompyuter savodxonligi", "Algoritmlar", "Python", "Veb dasturlash"],
      results: ["Dasturlash bilimi", "IT mutaxassisi sari"]
    },
    {
      titleUz: "Astronomiya", titleRu: "Астрономия", titleEn: "Astronomy",
      descriptionUz: "Quyosh tizimi, yulduzlar va galaktikalar.",
      descriptionRu: "Солнечная система, звёзды и галактики.",
      descriptionEn: "Solar system, stars and galaxies.",
      price: 350000, duration: "4 oy", format: "offline",
      modules: ["Quyosh tizimi", "Yulduzlar", "Galaktikalar", "Kosmologiya"],
      results: ["Koinotni tushunish"]
    },
    {
      titleUz: "Iqtisodiyot asoslari", titleRu: "Основы экономики", titleEn: "Economics Basics",
      descriptionUz: "Mikro va makro iqtisodiyot, moliya savodxonligi.",
      descriptionRu: "Микро- и макроэкономика, финансовая грамотность.",
      descriptionEn: "Micro and macroeconomics, financial literacy.",
      price: 450000, duration: "5 oy", format: "offline",
      modules: ["Mikroiqtisodiyot", "Makroiqtisodiyot", "Moliya", "Biznes"],
      results: ["Iqtisodiy fikrlash", "Moliya savodxonligi"]
    },
    {
      titleUz: "Huquq asoslari", titleRu: "Основы права", titleEn: "Law Basics",
      descriptionUz: "Davlat va huquq, fuqarolik huquqi asoslari.",
      descriptionRu: "Государство и право, основы гражданского права.",
      descriptionEn: "State and law, civil law basics.",
      price: 450000, duration: "5 oy", format: "offline",
      modules: ["Konstitutsiyaviy huquq", "Fuqarolik huquqi", "Mehnat huquqi"],
      results: ["Huquqiy savodxonlik"]
    }
  ]);

  console.log("Demo data tayyor.");
  console.log(`Admin: ${process.env.ADMIN_USERNAME || "ZAMAXSHAR12"} / ${process.env.ADMIN_PASSWORD || "zamaxshar"}`);
};
