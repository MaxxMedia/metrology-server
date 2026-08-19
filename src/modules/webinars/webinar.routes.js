import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";
import { requirePermission } from "../../shared/middleware/permissions.js";
import {
  approveWebinar,
  createWebinar,
  deleteWebinar,
  draftWebinar,
  getAdminWebinarById,
  getAdminWebinarStats,
  getPublicWebinarBySlug,
  getRelatedWebinars,
  listAdminWebinars,
  listPublicWebinars,
  publishWebinar,
  rejectWebinar,
  toggleFeatureWebinar,
  toggleOnDemandWebinar,
  updateWebinar,
} from "./webinar.controller.js";

const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.get("/", listPublicWebinars);
publicRouter.get("/:slug/related", getRelatedWebinars);
publicRouter.get("/:slug", getPublicWebinarBySlug);

adminRouter.get("/stats", requireAuth, requirePermission("webinar.view"), getAdminWebinarStats);
adminRouter.get("/", requireAuth, requirePermission("webinar.view"), listAdminWebinars);
adminRouter.get("/:id", requireAuth, requirePermission("webinar.view"), getAdminWebinarById);
adminRouter.post("/", requireAuth, requirePermission("webinar.create"), createWebinar);
adminRouter.put("/:id/approve", requireAuth, requirePermission("webinar.edit"), approveWebinar);
adminRouter.put("/:id/reject", requireAuth, requirePermission("webinar.edit"), rejectWebinar);
adminRouter.put("/:id/publish", requireAuth, requirePermission("webinar.edit"), publishWebinar);
adminRouter.put("/:id/draft", requireAuth, requirePermission("webinar.edit"), draftWebinar);
adminRouter.put("/:id/feature", requireAuth, requirePermission("webinar.edit"), toggleFeatureWebinar);
adminRouter.put("/:id/on-demand", requireAuth, requirePermission("webinar.edit"), toggleOnDemandWebinar);
adminRouter.put("/:id", requireAuth, requirePermission("webinar.edit"), updateWebinar);
adminRouter.delete("/:id", requireAuth, requirePermission("webinar.delete"), deleteWebinar);

export { publicRouter as webinarPublicRoutes, adminRouter as webinarAdminRoutes };
