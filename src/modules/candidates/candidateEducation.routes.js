import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";

import {
  getMyEducation,
  addEducation,
  updateEducation,
  deleteEducation,
} from "./candidateEducation.controller.js";

const router = express.Router();

router.get("/", requireAuth, getMyEducation);

router.post("/", requireAuth, addEducation);

router.put("/:id", requireAuth, updateEducation);

router.delete("/:id", requireAuth, deleteEducation);

export default router;