import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";

import {
  getMyInterests,
  addInterest,
  updateInterest,
  deleteInterest,
} from "./candidateInterest.controller.js";

const router = express.Router();

router.get("/", requireAuth, getMyInterests);

router.post("/", requireAuth, addInterest);

router.put("/:id", requireAuth, updateInterest);

router.delete("/:id", requireAuth, deleteInterest);

export default router;