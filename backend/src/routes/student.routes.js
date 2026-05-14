import { Router } from "express";
import {
  listStudents, getStudent, createStudent, updateStudent, deleteStudent, myProfile
} from "../controllers/student.controller.js";
import { protect, softAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", protect(["student"]), myProfile);
router.get("/", softAuth, listStudents);
router.get("/:id", softAuth, getStudent);
router.post("/", protect(["admin"]), createStudent);
router.put("/:id", protect(["admin"]), updateStudent);
router.delete("/:id", protect(["admin"]), deleteStudent);

export default router;
