import { Router } from "express";
import {
  createApplication, listApplications, getApplication,
  updateApplication, deleteApplication, convertToStudent
} from "../controllers/application.controller.js";
import { protect, requirePermission } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", createApplication);
router.get("/", protect(["admin"]), requirePermission("applications"), listApplications);
router.get("/:id", protect(["admin"]), requirePermission("applications"), getApplication);
router.put("/:id", protect(["admin"]), requirePermission("applications"), updateApplication);
router.delete("/:id", protect(["admin"]), requirePermission("applications"), deleteApplication);
router.post("/:id/convert", protect(["admin"]), requirePermission("applications"), convertToStudent);

export default router;
