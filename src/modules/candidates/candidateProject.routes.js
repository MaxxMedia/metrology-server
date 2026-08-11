import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";

import {
  getMyProjects,
  addProject,
  updateProject,
  deleteProject,
} from "./candidateProject.controller.js";

const router = express.Router();

router.get("/", requireAuth, getMyProjects);

router.post("/", requireAuth, addProject);

router.put("/:id", requireAuth, updateProject);

router.delete("/:id", requireAuth, deleteProject);

export default router;