import { Router } from "express";
import {
  createApplication, listApplications, getApplication,
  updateApplication, deleteApplication, convertToStudent
} from "../controllers/application.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", createApplication);
router.get("/", protect(["admin"]), listApplications);
router.get("/:id", protect(["admin"]), getApplication);
router.put("/:id", protect(["admin"]), updateApplication);
router.delete("/:id", protect(["admin"]), deleteApplication);
router.post("/:id/convert", protect(["admin"]), convertToStudent);

export default router;
