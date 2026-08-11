import express from "express";
import { requireAuth } from "../../shared/middleware/auth.js";
import {
    connectToCompany,
    disconnectFromCompany,
    getConnectionStatus,
    getMyCompanyConnections,
} from "./companyConnection.controller.js";

const router = express.Router();

// IMPORTANT: this must be registered BEFORE the "/:companyId/..." routes,
// otherwise Express will try to parse "me" as a companyId.
router.get("/me/connections", requireAuth, getMyCompanyConnections);

router.post("/:companyId/connect", requireAuth, connectToCompany);
router.delete("/:companyId/connect", requireAuth, disconnectFromCompany);
router.get("/:companyId/connect/status", requireAuth, getConnectionStatus);

export default router;