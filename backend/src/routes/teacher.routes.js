import { Router } from "express";
import {
  listTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher, clearTeachers
} from "../controllers/teacher.controller.js";
import { protect, softAuth, requireSuperAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", softAuth, listTeachers);
router.get("/:id([0-9a-fA-F]{24})", softAuth, getTeacher);
router.post("/", protect(["admin"]), createTeacher);
router.put("/:id([0-9a-fA-F]{24})", protect(["admin"]), updateTeacher);
router.delete("/clear", protect(["admin"]), requireSuperAdmin, clearTeachers);
router.delete("/:id([0-9a-fA-F]{24})", protect(["admin"]), requireSuperAdmin, deleteTeacher);

export default router;
