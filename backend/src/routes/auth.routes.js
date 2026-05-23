import { Router } from "express";
import { adminLogin, studentLogin, teacherLogin, logout, getSession } from "../controllers/auth.controller.js";
import { softAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/admin/login", adminLogin);
router.post("/student/login", studentLogin);
router.post("/teacher/login", teacherLogin);
router.post("/logout", logout);
router.get("/session", softAuth, getSession);

export default router;
