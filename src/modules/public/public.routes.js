import { Router } from "express"
import { getApprovedArticles } from "./public.controller.js"
import { getPackages } from "../admin/adminPackage.controller.js"

const router = Router()

/**
 * 🌍 PUBLIC ROUTES
 */
router.get("/articles/approved", getApprovedArticles)

/**
 * 🌍 PUBLIC PACKAGES (no auth)
 * Used by the pricing page. getPackages defaults to isActive:true
 * unless ?includeInactive is passed, so this only ever exposes
 * active packages — never gated behind requireAuth/requireAdmin.
 */
router.get("/packages", getPackages)

export default router