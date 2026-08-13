import express from "express";
import {
  getIndustryTree,
  getAllIndustries,
  getIndustryChildren,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from "./adminIndustry.controller.js";

import { requireAuth } from "../../shared/middleware/auth.js";

const router = express.Router();

/* GET ROOT INDUSTRIES (Public) */
router.get("/industries", getIndustryTree);

/* GET ALL INDUSTRIES — flat list for admin UI */
router.get("/industries/all", getAllIndustries);

/* GET CHILDREN OF AN INDUSTRY (Public) */
router.get("/industries/:id/children", getIndustryChildren);

/* CREATE / UPDATE / DELETE (Admin) */
router.post("/industries", requireAuth, createIndustry);
router.put("/industries/:id", requireAuth, updateIndustry);
router.delete("/industries/:id", requireAuth, deleteIndustry);

export default router;
