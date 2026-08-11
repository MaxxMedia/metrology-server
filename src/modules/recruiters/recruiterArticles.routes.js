import { Router } from "express"
import { requireAuth } from "../../shared/middleware/auth.js"
import {
  createRecruiterArticle,
  updateRecruiterArticle,
  deleteRecruiterArticle,
  getMyRecruiterArticles,
  getArticlePostingEligibilityHandler,
} from "./recruiterArticles.controller.js"

const router = Router()

router.get("/articles/eligibility", requireAuth, getArticlePostingEligibilityHandler)

// ✅ LIST recruiter articles
router.get("/articles", requireAuth, getMyRecruiterArticles)

// ✅ CREATE
router.post("/articles", requireAuth, createRecruiterArticle)

// ✅ UPDATE
router.put("/articles/:id", requireAuth, updateRecruiterArticle)

// ✅ DELETE
router.delete("/articles/:id", requireAuth, deleteRecruiterArticle)

export default router
