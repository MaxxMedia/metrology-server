import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";

import {
  getMyAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} from "./candidateAchievement.controller.js";

const router = express.Router();

router.get("/", requireAuth, getMyAchievements);

router.post("/", requireAuth, addAchievement);

router.put("/:id", requireAuth, updateAchievement);

router.delete("/:id", requireAuth, deleteAchievement);

export default router;