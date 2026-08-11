import express from "express";
import { uploadImage } from "../upload/upload.controller.js";
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.js";

const router = express.Router();

/**
 * ADMIN – Upload Advertisement Banner Image
 */
router.post(
  "/upload",
  requireAuth,
  requireAdmin,
  uploadImage
);

export default router;
