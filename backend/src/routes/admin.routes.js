import express from "express";
import { protect, requireSuperAdmin } from "../middleware/auth.middleware.js";
import { listAdmins, createAdmin, updateAdmin, deleteAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protect(["admin"]), requireSuperAdmin);
router.get("/", listAdmins);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
