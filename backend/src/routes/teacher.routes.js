import { Router } from "express";
import {
  listTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher
} from "../controllers/teacher.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listTeachers);
router.get("/:id", getTeacher);
router.post("/", protect(["admin"]), createTeacher);
router.put("/:id", protect(["admin"]), updateTeacher);
router.delete("/:id", protect(["admin"]), deleteTeacher);

export default router;
