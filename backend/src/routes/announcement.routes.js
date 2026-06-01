import { Router } from "express";
import {
  createAnnouncement,
  getAllAnnouncements,
  getMyAnnouncements,
  deleteAnnouncement
} from "../controllers/announcement.controller.js";
import { protect, softAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", protect(["teacher"]), createAnnouncement);
router.get("/all", softAuth, getAllAnnouncements);
router.get("/teacher/my", protect(["teacher"]), getMyAnnouncements);
router.delete("/:id", protect(["teacher"]), deleteAnnouncement);

export default router;
