import { Router } from "express";
import {
  listStudents, getStudent, createStudent, updateStudent, updateTeacherStudent, deleteStudent, myProfile
} from "../controllers/student.controller.js";
import { protect, softAuth, requirePermission } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", protect(["student"]), myProfile);
router.get("/", softAuth, listStudents);
router.get("/:id", softAuth, getStudent);
router.post("/", protect(["admin"]), requirePermission("students"), createStudent);
router.put("/teacher/:id", protect(["teacher"]), updateTeacherStudent);
router.put("/:id", protect(["admin"]), requirePermission("students"), updateStudent);
router.delete("/:id", protect(["admin"]), requirePermission("students"), deleteStudent);

export default router;
