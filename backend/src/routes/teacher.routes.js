import { Router } from "express";
import {
  listTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher
} from "../controllers/teacher.controller.js";
import { protect, softAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", softAuth, listTeachers);
router.get("/:id", softAuth, getTeacher);
router.post("/", protect(["admin"]), createTeacher);
router.put("/:id", protect(["admin"]), updateTeacher);
router.delete("/:id", protect(["admin"]), deleteTeacher);

export default router;
