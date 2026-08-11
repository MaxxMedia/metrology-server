import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";

import {
  getMySkills,
  addSkill,
  updateSkill,
  deleteSkill,
} from "./candidateSkills.controller.js";

const router = express.Router();

router.get("/", requireAuth, getMySkills);

router.post("/", requireAuth, addSkill);

router.put("/:id", requireAuth, updateSkill);

router.delete("/:id", requireAuth, deleteSkill);

export default router;