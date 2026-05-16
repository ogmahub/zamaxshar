import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { autoSeedIfEmpty } from "./utils/autoSeed.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import studentRoutes from "./routes/student.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();
await autoSeedIfEmpty();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://10.111.74.219:5173",
  "https://zamaxshar.vercel.app",
  "https://zamaxshar.netlify.app",
];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: ${origin} ruxsatsiz`));
  },
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ name: "ZAMAXSHAR API", version: "1.0.0", status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admins", adminRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ZAMAXSHAR backend running on http://0.0.0.0:${PORT}`);
});
