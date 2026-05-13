import { Router } from "express";
import {
  listCourses, getCourse, createCourse, updateCourse, deleteCourse
} from "../controllers/course.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", protect(["admin"]), createCourse);
router.put("/:id", protect(["admin"]), updateCourse);
router.delete("/:id", protect(["admin"]), deleteCourse);

export default router;
