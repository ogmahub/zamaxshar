import Admin from "../models/Admin.js";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import { hashPassword } from "./hashPassword.js";

export const autoSeedIfEmpty = async () => {
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
      titleUz: "Rus tili", titleRu: "Русский язык", titleEn: "Russian Language",
      descriptionUz: "Rus tili grammatikasi va so'zlashuv amaliyoti.",
      descriptionRu: "Грамматика русского языка и разговорная практика.",
      descriptionEn: "Russian grammar and conversation practice.",
      price: 500000, duration: "8 oy", format: "offline",
      modules: ["Grammatika", "So'zlashuv", "Yozish", "O'qish"],
      results: ["Rus tilida erkin muloqot", "Sertifikat"]
    },
    {
      titleUz: "Arab tili", titleRu: "Арабский язык", titleEn: "Arabic Language",
      descriptionUz: "Arab tili alifbosi, grammatikasi va so'zlashuv.",
      descriptionRu: "Арабский алфавит, грамматика и разговор.",
      descriptionEn: "Arabic alphabet, grammar and conversation.",
      price: 500000, duration: "10 oy", format: "offline",
      modules: ["Alifbo", "Grammatika", "So'zlashuv", "Qur'on tilini tushunish"],
      results: ["Arab tilida o'qish", "Muloqot"]
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
    },
    {
      titleUz: "Chizmachilik", titleRu: "Черчение", titleEn: "Drafting",
      descriptionUz: "Texnik chizmalar va loyihalashtirish asoslari.",
      descriptionRu: "Основы технического черчения и проектирования.",
      descriptionEn: "Technical drawing and design basics.",
      price: 400000, duration: "5 oy", format: "offline",
      modules: ["Geometrik chizmalar", "Proyeksiyalar", "Texnik chizmalar"],
      results: ["Chizma o'qish", "Loyiha tuzish"]
    },
    {
      titleUz: "Tasviriy san'at", titleRu: "Изобразительное искусство", titleEn: "Visual Arts",
      descriptionUz: "Rasm chizish, akvarel va kompozitsiya.",
      descriptionRu: "Рисование, акварель и композиция.",
      descriptionEn: "Drawing, watercolor and composition.",
      price: 400000, duration: "6 oy", format: "offline",
      modules: ["Karandash chizmasi", "Akvarel", "Kompozitsiya", "Portret"],
      results: ["Rassomlik mahorati", "Ijodiy fikrlash"]
    },
    {
      titleUz: "Musiqa", titleRu: "Музыка", titleEn: "Music",
      descriptionUz: "Musiqa nazariyasi va cholg'u asboblarida ijro.",
      descriptionRu: "Теория музыки и игра на инструментах.",
      descriptionEn: "Music theory and instrument playing.",
      price: 500000, duration: "8 oy", format: "offline",
      modules: ["Notalar", "Ritm", "Cholg'u asbobi", "Vokal"],
      results: ["Cholg'u chalish", "Musiqiy savodxonlik"]
    },
    {
      titleUz: "Jismoniy tarbiya", titleRu: "Физкультура", titleEn: "Physical Education",
      descriptionUz: "Sport va sog'lom turmush tarzi.",
      descriptionRu: "Спорт и здоровый образ жизни.",
      descriptionEn: "Sports and healthy lifestyle.",
      price: 300000, duration: "12 oy", format: "offline",
      modules: ["Yengil atletika", "Sport o'yinlari", "Gimnastika"],
      results: ["Sog'lom jismoniy holat"]
    },
    {
      titleUz: "Texnologiya", titleRu: "Технология", titleEn: "Technology",
      descriptionUz: "Mehnat ta'limi va texnologik bilim.",
      descriptionRu: "Трудовое обучение и технологические знания.",
      descriptionEn: "Labor training and technological knowledge.",
      price: 350000, duration: "5 oy", format: "offline",
      modules: ["Yog'och bilan ishlash", "Metall bilan ishlash", "Elektrotexnika"],
      results: ["Amaliy ko'nikmalar"]
    }
  ]);

  const teachers = await Teacher.insertMany([
    { name: "Saodat Xolmatova", phone: "+998901234501", subject: "Ona tili",
      bio: "12 yillik tajribaga ega ona tili o'qituvchisi." },
    { name: "Gulnora Tursunova", phone: "+998901234502", subject: "Adabiyot",
      bio: "O'zbek va jahon adabiyoti mutaxassisi, 10 yillik tajriba." },
    { name: "Bobur Karimov", phone: "+998901234503", subject: "Matematika",
      bio: "Matematika fani o'qituvchisi, DTM mutaxassisi." },
    { name: "Sherzod Aliyev", phone: "+998901234504", subject: "Algebra",
      bio: "Algebra va matematik tahlil o'qituvchisi." },
    { name: "Nodira Sobirova", phone: "+998901234505", subject: "Geometriya",
      bio: "Geometriya va trigonometriya bo'yicha mutaxassis." },
    { name: "Akmal Yusupov", phone: "+998901234506", subject: "Fizika",
      bio: "Fizika fani nomzodi, 15 yillik tajriba." },
    { name: "Dilnoza Rahmonova", phone: "+998901234507", subject: "Kimyo",
      bio: "Organik va anorganik kimyo o'qituvchisi." },
    { name: "Shahnoza Karimova", phone: "+998901234508", subject: "Biologiya",
      bio: "Tibbiyot kollejida biologiya o'qituvchisi." },
    { name: "Otabek Saidov", phone: "+998901234509", subject: "Tarix",
      bio: "Tarix fanlari nomzodi, O'zbekiston tarixi mutaxassisi." },
    { name: "Zarina Tojiyeva", phone: "+998901234510", subject: "Geografiya",
      bio: "Geografiya va kartografiya o'qituvchisi." },
    { name: "Madina Yusupova", phone: "+998901234511", subject: "Ingliz tili",
      bio: "IELTS 8.5, 8 yillik tajribaga ega ingliz tili o'qituvchisi." },
    { name: "Elena Petrova", phone: "+998901234512", subject: "Rus tili",
      bio: "Filologiya magistri, rus tili va adabiyoti o'qituvchisi." },
    { name: "Abdulla Hamidov", phone: "+998901234513", subject: "Arab tili",
      bio: "Arab tili va islom ilmlari bo'yicha mutaxassis." },
    { name: "Jasur Norboyev", phone: "+998901234514", subject: "Informatika",
      bio: "Senior dasturchi, Python va veb dasturlash o'qituvchisi." },
    { name: "Sanjar Ergashev", phone: "+998901234515", subject: "Astronomiya",
      bio: "Astronomiya kruzhok rahbari, koinot ixlosmandi." },
    { name: "Lola Mahmudova", phone: "+998901234516", subject: "Iqtisodiyot",
      bio: "Iqtisodiyot fanlari nomzodi, moliya bo'yicha mutaxassis." },
    { name: "Rustam Qodirov", phone: "+998901234517", subject: "Huquq",
      bio: "Yuridik fakulteti dotsenti, huquq nazariyasi mutaxassisi." },
    { name: "Farhod Tursunov", phone: "+998901234518", subject: "Chizmachilik",
      bio: "Muhandis-konstruktor, chizmachilik o'qituvchisi." },
    { name: "Malika Saidova", phone: "+998901234519", subject: "Tasviriy san'at",
      bio: "Rassom, San'at akademiyasi bitiruvchisi." },
    { name: "Aziza Mirzayeva", phone: "+998901234520", subject: "Musiqa",
      bio: "Konservatoriya bitiruvchisi, pianino va vokal o'qituvchisi." },
    { name: "Doniyor Boboyev", phone: "+998901234521", subject: "Jismoniy tarbiya",
      bio: "Sport ustasi, futbol va yengil atletika murabbiyi." },
    { name: "Ilhom Nazarov", phone: "+998901234522", subject: "Texnologiya",
      bio: "Texnologiya va mehnat ta'limi o'qituvchisi." }
  ]);

  await Student.create({
    firstName: "Ali", lastName: "Valiyev",
    username: "ali",
    phone: "+998901111111",
    passwordHash: await hashPassword("12345"),
    course: courses[0]._id, teacher: teachers[0]._id,
    paymentStatus: "paid",
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
  });

  // Birinchi ustozga login berib qo'yamiz (demo). Login = ism familiya ko'rinishida.
  if (teachers[0]) {
    teachers[0].username = teachers[0].name; // "Saodat Xolmatova"
    teachers[0].passwordHash = await hashPassword("12345");
    await teachers[0].save();
  }

  console.log("Demo data tayyor.");
  console.log(`Admin: ${process.env.ADMIN_USERNAME || "ZAMAXSHAR12"} / ${process.env.ADMIN_PASSWORD || "zamaxshar"}`);
  console.log("Student: ali / 12345");
  console.log(`Teacher: ${teachers[0]?.name || "Saodat Xolmatova"} / 12345`);
};
