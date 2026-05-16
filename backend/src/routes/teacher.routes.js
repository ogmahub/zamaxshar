import { Router } from "express";
import {
  listTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher
} from "../controllers/teacher.controller.js";
import { protect, softAuth, requirePermission } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", softAuth, listTeachers);
router.get("/:id", softAuth, getTeacher);
router.post("/", protect(["admin"]), requirePermission("teachers"), createTeacher);
router.put("/:id", protect(["admin"]), requirePermission("teachers"), updateTeacher);
router.delete("/:id", protect(["admin"]), requirePermission("teachers"), deleteTeacher);

export default router;
