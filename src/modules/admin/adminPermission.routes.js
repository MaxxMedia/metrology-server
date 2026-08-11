// src/routes/adminPermissionRoutes.js
import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";
import { requireSuperAdmin } from "../../shared/middleware/permissions.js";
import { getAllPermissions } from "./permission.controller.js";

const router = express.Router();

// Same policy as roles/sub-admins: only super admin can view the full
// permission catalogue (used to build the role/sub-admin permission picker UI).
router.use(requireAuth, requireSuperAdmin);

router.get("/permissions", getAllPermissions);

export default router;