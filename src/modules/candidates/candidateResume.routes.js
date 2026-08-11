import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";
import { upload } from "../upload/upload.controller.js";
import {
  uploadResume,
  getMyResume,
  deleteResume,
  getCandidateResume
} from "./candidateResume.controller.js";

const router = express.Router();

router.get(
  "/me",
  requireAuth,
  getMyResume
);

router.post(
  "/upload",
  requireAuth,
  upload.single("resume"),
  uploadResume
);

router.delete(
  "/delete",
  requireAuth,
  deleteResume
);

router.get("/:userId", requireAuth, getCandidateResume);

export default router;