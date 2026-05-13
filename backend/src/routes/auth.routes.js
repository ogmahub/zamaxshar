import { Router } from "express";
import { adminLogin, studentLogin, logout, getSession } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/admin/login", adminLogin);
router.post("/student/login", studentLogin);
router.post("/logout", logout);
router.get("/session", protect(), getSession);

export default router;
