import { Router } from "express";
import {
  listStudents, getStudent, createStudent, updateStudent, deleteStudent, myProfile
} from "../controllers/student.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", protect(["student"]), myProfile);
router.get("/", protect(["admin"]), listStudents);
router.get("/:id", protect(["admin"]), getStudent);
router.post("/", protect(["admin"]), createStudent);
router.put("/:id", protect(["admin"]), updateStudent);
router.delete("/:id", protect(["admin"]), deleteStudent);

export default router;
