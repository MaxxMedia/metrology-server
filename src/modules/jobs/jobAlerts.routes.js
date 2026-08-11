import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";
import {
  getMyJobAlerts,
  createJobAlert,
  updateJobAlert,
  deleteJobAlert,
  getAlertMatches,
} from "./jobAlerts.controller.js";

const router = express.Router();

router.get("/me", requireAuth, getMyJobAlerts);
router.post("/", requireAuth, createJobAlert);
router.put("/:id", requireAuth, updateJobAlert);
router.delete("/:id", requireAuth, deleteJobAlert);
router.get("/:id/matches", requireAuth, getAlertMatches);

export default router;
