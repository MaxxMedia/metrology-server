import express from "express";
import {
  getIndustryTree,
  getIndustryChildren,
  createIndustry,
} from "./adminIndustry.controller.js";

import { requireAuth, requireAdmin } from "../../shared/middleware/auth.js";

const router = express.Router();

/* ==============================
   GET ROOT INDUSTRIES (Public)
============================== */
router.get("/industries", getIndustryTree);

/* ==============================
   GET CHILDREN OF AN INDUSTRY (Public)
============================== */
router.get("/industries/:id/children", getIndustryChildren);

/* ==============================
   CREATE INDUSTRY (ADMIN ONLY)
============================== */
router.post(
  "/industries",
  requireAuth,
  requireAdmin,
  createIndustry
);

export default router;