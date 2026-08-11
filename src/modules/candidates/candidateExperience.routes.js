import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";

import {
  getMyExperience,
  addExperience,
  updateExperience,
  deleteExperience,
} from "./candidateExperience.controller.js";

const router = express.Router();

router.get("/", requireAuth, getMyExperience);

router.post("/", requireAuth, addExperience);

router.put("/:id", requireAuth, updateExperience);

router.delete("/:id", requireAuth, deleteExperience);

export default router;