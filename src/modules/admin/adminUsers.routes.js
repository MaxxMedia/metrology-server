/** Defines Express routes for admin endpoints and connects them to their handlers. */
import express from "express";
import { adminCreateRecruiter } from "./adminUsers.controller.js";
import { requireAuth } from "../../shared/middleware/auth.js";

const router = express.Router();

router.post("/create-recruiter", requireAuth, adminCreateRecruiter);

export default router;
