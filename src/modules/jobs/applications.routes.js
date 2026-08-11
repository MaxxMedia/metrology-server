import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";
import { upload } from "../upload/upload.controller.js";
import {
  applyJob,
  getMyApplications,
  getApplicantsByJob,
  getApplicationById,
  updateApplicationStatus,
} from "./jobApplications.controller.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  upload.single("resume"),
  applyJob
);

router.get("/me", requireAuth, getMyApplications);

router.get("/job/:jobId", requireAuth, getApplicantsByJob);

router.get("/:applicationId", requireAuth, getApplicationById);

router.put("/:applicationId/status", requireAuth, updateApplicationStatus);

export default router;