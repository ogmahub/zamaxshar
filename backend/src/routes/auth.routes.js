import { Router } from "express";
import { adminLogin, studentLogin, teacherLogin, logout, getSession } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/admin/login", adminLogin);
router.post("/student/login", studentLogin);
router.post("/teacher/login", teacherLogin);
router.post("/logout", logout);
router.get("/session", (req, res, next) => { if (!req.cookies?.token) return res.json({ user: null }); return protect()(req, res, next); }, getSession);

export default router;
