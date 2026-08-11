import { Router } from "express"
import { getCompanyArticles } from "./companyArticles.controller.js"

const router = Router()

router.get("/:companyId/articles", getCompanyArticles)

export default router
