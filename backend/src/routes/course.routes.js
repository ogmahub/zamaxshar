import { Router } from "express";
import {
  listCourses, getCourse, createCourse, updateCourse, deleteCourse
} from "../controllers/course.controller.js";
import { protect, softAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", softAuth, listCourses);
router.get("/:id", softAuth, getCourse);
router.post("/", protect(["admin"]), createCourse);
router.put("/:id", protect(["admin"]), updateCourse);
router.delete("/:id", protect(["admin"]), deleteCourse);

export default router;
