import { Router } from "express";
import { createGroup, deleteGroup, listGroups, updateGroup } from "../controllers/group.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect(["teacher"]), listGroups);
router.post("/", protect(["teacher"]), createGroup);
router.put("/:id", protect(["teacher"]), updateGroup);
router.delete("/:id", protect(["teacher"]), deleteGroup);

export default router;
