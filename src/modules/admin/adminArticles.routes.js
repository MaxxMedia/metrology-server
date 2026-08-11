// import { Router } from "express"
// import { requireAuth, requireAdmin } from "../../shared/middleware/auth.js"
// import {
//   getPendingArticles,
//   approveArticle,
//   rejectArticle,
//   getAdminApprovedArticles
// } from "./adminArticles.controller.js"

// const router = Router()

// router.get("/articles/pending", requireAuth, requireAdmin, getPendingArticles)

// router.get(
//   "/articles/adminapproved",
//   requireAuth,
//   getAdminApprovedArticles
// )
// router.put("/articles/:id/approve", requireAuth, requireAdmin, approveArticle)
// router.put("/articles/:id/reject", requireAuth, requireAdmin, rejectArticle)

// export default router


import { Router } from "express"
import { requireAuth, requireAdmin } from "../../shared/middleware/auth.js"
import {
  getPendingArticles,
  approveArticle,
  rejectArticle,
  getAdminApprovedArticles
} from "./adminArticles.controller.js"

const router = Router()

router.get(
  "/articles/pending",
  requireAuth,
  requireAdmin,
  getPendingArticles
)

router.get(
  "/articles/adminapproved",
  requireAuth,
  requireAdmin,
  getAdminApprovedArticles
)

router.put(
  "/articles/:id/approve",
  requireAuth,
  requireAdmin,
  approveArticle
)

router.put(
  "/articles/:id/reject",
  requireAuth,
  requireAdmin,
  rejectArticle
)

export default router